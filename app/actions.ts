"use server"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import type { CartItem } from "@/types/database"

// Create a Supabase client with admin privileges for server actions
function createAdminClient() {
  const cookieStore = cookies()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Supabase admin credentials are missing")
  }

  return createServerClient(supabaseUrl, supabaseServiceKey, {
    cookies: {
      get(name) {
        return cookieStore.get(name)?.value
      },
      set(name, value, options) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name, options) {
        cookieStore.set({ name, value: "", ...options })
      },
    },
  })
}

// Regular client for auth operations
function createRegularClient() {
  const cookieStore = cookies()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase credentials are missing")
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name) {
        return cookieStore.get(name)?.value
      },
      set(name, value, options) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name, options) {
        cookieStore.set({ name, value: "", ...options })
      },
    },
  })
}

export async function createOrder(items: CartItem[], total: number) {
  // Get the current user session with regular client
  const regularClient = createRegularClient()
  const {
    data: { session },
  } = await regularClient.auth.getSession()

  if (!session) {
    console.error("Create order failed: No active session")
    return { success: false, error: "You must be logged in to place an order" }
  }

  try {
    console.log("Creating order for user:", session.user.id, "with total:", total)

    // Use admin client for database operations
    const adminClient = createAdminClient()

    // Create order
    const { data: order, error: orderError } = await adminClient
      .from("orders")
      .insert({
        user_id: session.user.id,
        total,
        status: "pending",
      })
      .select()
      .single()

    if (orderError) {
      console.error("Order creation error:", orderError)
      return { success: false, error: `Failed to create order: ${orderError.message}` }
    }

    if (!order) {
      console.error("Order was created but no data was returned")
      return { success: false, error: "Order was created but no data was returned" }
    }

    console.log("Order created successfully with ID:", order.id)

    // Create order items
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.product.id,
      quantity: item.quantity,
      price: item.product.price,
    }))

    const { error: itemsError } = await adminClient.from("order_items").insert(orderItems)

    if (itemsError) {
      console.error("Order items creation error:", itemsError)
      return { success: false, error: `Failed to create order items: ${itemsError.message}` }
    }

    // Update product stock
    try {
      for (const item of items) {
        await adminClient
          .from("products")
          .update({ stock: Math.max(0, item.product.stock - item.quantity) })
          .eq("id", item.product.id)
      }
    } catch (stockError) {
      console.error("Error updating product stock:", stockError)
      // Don't fail the order if stock update fails
    }

    revalidatePath("/orders")
    console.log("Order process completed successfully")
    return { success: true, orderId: order.id }
  } catch (error) {
    console.error("Checkout error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred during checkout",
    }
  }
}

// New action to delete an order
export async function deleteOrder(orderId: string) {
  // Get the current user session with regular client
  const regularClient = createRegularClient()
  const {
    data: { session },
  } = await regularClient.auth.getSession()

  if (!session) {
    return { success: false, error: "You must be logged in to delete an order" }
  }

  try {
    // Use admin client for database operations
    const adminClient = createAdminClient()

    // First, delete all order items
    const { error: itemsDeleteError } = await adminClient.from("order_items").delete().eq("order_id", orderId)

    if (itemsDeleteError) {
      console.error("Order items deletion error:", itemsDeleteError)
      return { success: false, error: `Failed to delete order items: ${itemsDeleteError.message}` }
    }

    // Then delete the order
    const { error: orderDeleteError } = await adminClient.from("orders").delete().eq("id", orderId)

    if (orderDeleteError) {
      console.error("Order deletion error:", orderDeleteError)
      return { success: false, error: `Failed to delete order: ${orderDeleteError.message}` }
    }

    // Force revalidation of all relevant paths
    revalidatePath("/orders")
    revalidatePath("/orders/[id]", "page")
    revalidatePath("/admin/orders")

    return { success: true }
  } catch (error) {
    console.error("Delete order error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred while deleting the order",
    }
  }
}

// Action to update an order
export async function updateOrder(orderId: string, data: { status?: string }) {
  // Get the current user session with regular client
  const regularClient = createRegularClient()
  const {
    data: { session },
  } = await regularClient.auth.getSession()

  if (!session) {
    return { success: false, error: "You must be logged in to update an order" }
  }

  try {
    // Use admin client for database operations
    const adminClient = createAdminClient()

    // Update order
    const { error: updateError } = await adminClient.from("orders").update(data).eq("id", orderId)

    if (updateError) {
      console.error("Order update error:", updateError)
      return { success: false, error: `Failed to update order: ${updateError.message}` }
    }

    // Force revalidation of all relevant paths
    revalidatePath("/orders")
    revalidatePath(`/orders/${orderId}`)
    revalidatePath("/admin/orders")
    revalidatePath(`/admin/orders/${orderId}`)

    return { success: true }
  } catch (error) {
    console.error("Update order error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred while updating the order",
    }
  }
}


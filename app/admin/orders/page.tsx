"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { DataTable } from "@/components/admin/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { OrderStatusCell, OrderPriceCell, OrderDateCell, OrderActionsCell } from "@/components/admin/order-table-cells"

interface Order {
  id: string
  user_id: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  total: number
  created_at: string
  user_email?: string
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true)
      setError(null)

      try {
        const supabase = createClient()

        // Fetch all orders with no filters and explicit ordering
        const { data: ordersData, error: ordersError } = await supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false })

        if (ordersError) {
          console.error("Error fetching orders:", ordersError)
          setError(`Failed to fetch orders: ${ordersError.message}`)
          setLoading(false)
          return
        }

        console.log("Fetched orders:", ordersData?.length || 0)

        // Initialize orders with user_id but without email
        const ordersWithoutEmails = ordersData || []

        // Create a map to store user emails
        const userEmails = new Map<string, string>()

        // Get unique user IDs
        const userIds = [...new Set(ordersWithoutEmails.map((order) => order.user_id))]

        // If we have user IDs, fetch their emails
        if (userIds.length > 0) {
          try {
            // Fetch user emails in batches if needed
            for (let i = 0; i < userIds.length; i += 10) {
              const batchIds = userIds.slice(i, i + 10)
              const { data: userData, error: userError } = await supabase
                .from("users")
                .select("id, email")
                .in("id", batchIds)

              if (!userError && userData) {
                userData.forEach((user) => {
                  userEmails.set(user.id, user.email)
                })
              }
            }
          } catch (error) {
            console.error("Error fetching user emails:", error)
            // Continue without emails if there's an error
          }
        }

        // Combine orders with user emails
        const ordersWithEmails = ordersWithoutEmails.map((order) => ({
          ...order,
          user_email: userEmails.get(order.user_id) || "Unknown",
        }))

        setOrders(ordersWithEmails)
      } catch (error) {
        console.error("Unexpected error fetching orders:", error)
        setError("An unexpected error occurred while fetching orders")
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "id",
      header: "Order ID",
      cell: ({ row }) => {
        const id = row.getValue("id") as string
        return <span className="font-medium">#{id.substring(0, 8)}</span>
      },
    },
    {
      accessorKey: "user_id",
      header: "Customer ID",
      cell: ({ row }) => {
        const userId = row.getValue("user_id") as string
        return <span>{userId.substring(0, 8)}...</span>
      },
    },
    {
      accessorKey: "total",
      header: "Total",
      cell: ({ row }) => {
        const total = Number(row.getValue("total"))
        return <OrderPriceCell total={total} />
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return <OrderStatusCell status={status} />
      },
    },
    {
      accessorKey: "created_at",
      header: "Date",
      cell: ({ row }) => {
        const date = row.getValue("created_at") as string
        return <OrderDateCell date={date} />
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const order = row.original
        return <OrderActionsCell orderId={order.id} />
      },
    },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Orders</h1>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Orders</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="mt-2 text-sm underline">
            Try again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground">Total: {orders.length} orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-muted/40 rounded-lg p-8 text-center">
          <p className="text-muted-foreground">No orders found</p>
        </div>
      ) : (
        <DataTable columns={columns} data={orders} />
      )}
    </div>
  )
}


import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createClient()

    // Create tables

    // Products table
    const { error: productsError } = await supabase.rpc("create_table_if_not_exists", {
      table_name: "products",
      table_definition: `
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        image_url TEXT,
        category TEXT,
        stock INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      `,
    })

    if (productsError) {
      return NextResponse.json({ error: productsError.message }, { status: 500 })
    }

    // Orders table
    const { error: ordersError } = await supabase.rpc("create_table_if_not_exists", {
      table_name: "orders",
      table_definition: `
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        total DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      `,
    })

    if (ordersError) {
      return NextResponse.json({ error: ordersError.message }, { status: 500 })
    }

    // Order items table
    const { error: orderItemsError } = await supabase.rpc("create_table_if_not_exists", {
      table_name: "order_items",
      table_definition: `
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
        product_id UUID REFERENCES products(id),
        quantity INTEGER NOT NULL,
        price DECIMAL(10, 2) NOT NULL
      `,
    })

    if (orderItemsError) {
      return NextResponse.json({ error: orderItemsError.message }, { status: 500 })
    }

    // Create RLS policies

    // Enable RLS on tables
    await supabase.rpc("enable_rls", { table_name: "products" })
    await supabase.rpc("enable_rls", { table_name: "orders" })
    await supabase.rpc("enable_rls", { table_name: "order_items" })

    // Create policies
    // Products - anyone can read, only admins can write
    await supabase.rpc("create_policy", {
      table_name: "products",
      name: "Public read access",
      definition: `FOR SELECT USING (true)`,
    })

    await supabase.rpc("create_policy", {
      table_name: "products",
      name: "Admin write access",
      definition: `FOR ALL USING (auth.uid() IN (SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'))`,
    })

    // Orders - users can read and insert their own orders
    await supabase.rpc("create_policy", {
      table_name: "orders",
      name: "Users read own orders",
      definition: `FOR SELECT USING (auth.uid() = user_id)`,
    })

    await supabase.rpc("create_policy", {
      table_name: "orders",
      name: "Users insert own orders",
      definition: `FOR INSERT WITH CHECK (auth.uid() = user_id)`,
    })

    await supabase.rpc("create_policy", {
      table_name: "orders",
      name: "Admin access all orders",
      definition: `FOR ALL USING (auth.uid() IN (SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'))`,
    })

    // Order items - users can read and insert their own order items
    await supabase.rpc("create_policy", {
      table_name: "order_items",
      name: "Users read own order items",
      definition: `FOR SELECT USING (order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()))`,
    })

    await supabase.rpc("create_policy", {
      table_name: "order_items",
      name: "Users insert own order items",
      definition: `FOR INSERT WITH CHECK (order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()))`,
    })

    await supabase.rpc("create_policy", {
      table_name: "order_items",
      name: "Admin access all order items",
      definition: `FOR ALL USING (auth.uid() IN (SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'))`,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Setup error:", error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}


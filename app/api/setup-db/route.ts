import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createClient()

    // Enable UUID extension
    await supabase.rpc("extensions", { name: "uuid-ossp" })

    // Create products table
    await supabase.rpc("create_table_if_not_exists", {
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

    // Create orders table
    await supabase.rpc("create_table_if_not_exists", {
      table_name: "orders",
      table_definition: `
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        total DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      `,
    })

    // Create order_items table
    await supabase.rpc("create_table_if_not_exists", {
      table_name: "order_items",
      table_definition: `
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
        product_id UUID REFERENCES products(id),
        quantity INTEGER NOT NULL,
        price DECIMAL(10, 2) NOT NULL
      `,
    })

    // Enable RLS on tables
    await supabase.rpc("enable_rls", { table_name: "products" })
    await supabase.rpc("enable_rls", { table_name: "orders" })
    await supabase.rpc("enable_rls", { table_name: "order_items" })

    // Create policies

    // Products - anyone can read
    await supabase.rpc("create_policy", {
      table_name: "products",
      name: "Public read access",
      definition: `FOR SELECT USING (true)`,
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

    return NextResponse.json({ success: true, message: "Database setup completed successfully" })
  } catch (error) {
    console.error("Database setup error:", error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}


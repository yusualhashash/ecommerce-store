import { createClient } from "@/utils/supabase/server"
import { DataTable } from "@/components/admin/data-table"
import type { ColumnDef } from "@tanstack/react-table"

interface Customer {
  id: string
  email: string
  created_at: string
  order_count: number
  total_spent: number
}

export default async function AdminCustomersPage() {
  const supabase = createClient()

  // Get users with role 'user'
  const { data: users } = await supabase.from("users").select("id, email, created_at").eq("role", "user")

  // Get order counts and total spent for each user
  const { data: orderStats } = await supabase.from("orders").select("user_id, total")

  // Format the data
  const customers =
    users?.map((user) => {
      const userOrders = orderStats?.filter((order) => order.user_id === user.id) || []
      const orderCount = userOrders.length
      const totalSpent = userOrders.reduce((sum, order) => sum + order.total, 0)

      return {
        ...user,
        order_count: orderCount,
        total_spent: totalSpent,
      }
    }) || []

  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "created_at",
      header: "Joined",
      cell: ({ row }) => {
        const date = new Date(row.getValue("created_at"))
        return date.toLocaleDateString()
      },
    },
    {
      accessorKey: "order_count",
      header: "Orders",
    },
    {
      accessorKey: "total_spent",
      header: "Total Spent",
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("total_spent"))
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount)
      },
    },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Customers</h1>
      <DataTable columns={columns} data={customers} />
    </div>
  )
}


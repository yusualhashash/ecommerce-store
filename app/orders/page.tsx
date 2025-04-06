import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/utils/supabase/server"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function OrdersPage() {
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login?redirect=/orders")
  }

  // Fetch user's orders
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })

  if (!orders || orders.length === 0) {
    return (
      <div className="container py-12">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-2">You haven't placed any orders yet</h2>
              <p className="text-muted-foreground mb-6">Browse our products and place your first order today!</p>
              <Button asChild>
                <Link href="/products">Shop Now</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-12 px-4 md:px-6 sm:px-8 ">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Order #{order.id.substring(0, 8)}</CardTitle>
                <Badge
                  className={
                    order.status === "delivered"
                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                      : order.status === "processing"
                        ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                        : order.status === "shipped"
                          ? "bg-purple-100 text-purple-800 hover:bg-purple-100"
                          : order.status === "cancelled"
                            ? "bg-red-100 text-red-800 hover:bg-red-100"
                            : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                  }
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Placed on {new Date(order.created_at).toLocaleDateString()}
                  </p>
                  <p className="font-medium mt-2">Total: {formatCurrency(order.total)}</p>
                </div>
                <Button asChild variant="outline">
                  <Link href={`/orders/${order.id}`}>View Details</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}


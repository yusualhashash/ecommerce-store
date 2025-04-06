import Link from "next/link"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Order {
  id: string
  status: string
  total: number
  created_at: string
}

interface OrdersListProps {
  orders: Order[]
}

export function OrdersList({ orders }: OrdersListProps) {
  if (orders.length === 0) {
    return (
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
    )
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Order #{order.id.substring(0, 8)}</CardTitle>
                <CardDescription>Placed on {new Date(order.created_at).toLocaleDateString()}</CardDescription>
              </div>
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
                <p className="font-medium">Total</p>
                <p className="text-2xl font-bold">{formatCurrency(order.total)}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href={`/orders/${order.id}`}>View Order Details</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}


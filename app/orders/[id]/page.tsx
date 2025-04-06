import { notFound, redirect } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { createClient } from "@/utils/supabase/server"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft } from "lucide-react"
import { OrderActions } from "@/components/store/order-actions"

interface OrderPageProps {
  params: {
    id: string
  }
  searchParams: {
    success?: string
  }
}

export default async function OrderPage({ params, searchParams }: OrderPageProps) {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Fetch order
  const { data: order } = await supabase.from("orders").select("*").eq("id", params.id).single()

  if (!order) {
    notFound()
  }

  // Check if order belongs to user
  const isOwner = order.user_id === session.user.id

  if (!isOwner) {
    // Check if user is admin
    const { data: userData } = await supabase.from("users").select("role").eq("id", session.user.id).single()

    const isAdmin = userData?.role === "admin"

    if (!isAdmin) {
      redirect("/orders")
    }
  }

  // Fetch order items with product details
  const { data: orderItems } = await supabase
    .from("order_items")
    .select(`
      *,
      product:product_id (*)
    `)
    .eq("order_id", order.id)

  return (
    <div className="container py-12">
      <div className="flex justify-between items-center mb-6">
        <Button asChild variant="ghost" className="pl-0">
          <Link href="/orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Link>
        </Button>

        <OrderActions orderId={order.id} currentStatus={order.status} isAdmin={false} />
      </div>

      {searchParams.success && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-md">
          <p className="font-medium">Order placed successfully!</p>
          <p>Thank you for your purchase. We'll process your order shortly.</p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Order #{order.id.substring(0, 8)}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Placed on {new Date(order.created_at).toLocaleDateString()}
                  </p>
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
              <h3 className="font-semibold mb-4">Items</h3>
              <div className="space-y-4">
                {orderItems?.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-md">
                      <Image
                        src={item.product?.image_url || "/placeholder.svg?height=64&width=64"}
                        alt={item.product?.name || "Product"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.product?.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity} × {formatCurrency(item.price)}
                      </p>
                    </div>
                    <div className="font-medium">{formatCurrency(item.quantity * item.price)}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>

                <Separator />

                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">This is a demo store. No actual shipping information is stored.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


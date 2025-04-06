"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { createClient } from "@/utils/supabase/client"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price: number
  product?: {
    id: string
    name: string
    image_url: string
  }
}

interface Order {
  id: string
  user_id: string
  status: string
  total: number
  created_at: string
  user_email?: string
}

export default function AdminOrderPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [order, setOrder] = useState<Order | null>(null)
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<string>("")
  const [updating, setUpdating] = useState(false)
  const [userEmail, setUserEmail] = useState<string>("Unknown")

  useEffect(() => {
    async function fetchOrderDetails() {
      if (!params.id) return

      const supabase = createClient()

      // Fetch order details
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select("*")
        .eq("id", params.id)
        .single()

      if (orderError) {
        console.error("Error fetching order:", orderError)
        toast({
          title: "Error",
          description: "Failed to load order details",
          variant: "destructive",
        })
        router.push("/admin/orders")
        return
      }

      setOrder(orderData)
      setStatus(orderData.status)

      // Try to fetch user email separately
      try {
        // This might need adjustment based on your actual schema
        const { data: userData } = await supabase.from("users").select("email").eq("id", orderData.user_id).single()

        if (userData) {
          setUserEmail(userData.email)
        }
      } catch (error) {
        console.error("Error fetching user email:", error)
        // Continue without email if there's an error
      }

      // Fetch order items with product details
      const { data: itemsData, error: itemsError } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", params.id)

      if (itemsError) {
        console.error("Error fetching order items:", itemsError)
      } else {
        // For each order item, fetch the product details
        const itemsWithProducts = await Promise.all(
          (itemsData || []).map(async (item) => {
            const { data: productData } = await supabase
              .from("products")
              .select("id, name, image_url")
              .eq("id", item.product_id)
              .single()

            return {
              ...item,
              product: productData || undefined,
            }
          }),
        )

        setOrderItems(itemsWithProducts)
      }

      setLoading(false)
    }

    fetchOrderDetails()
  }, [params.id, router, toast])

  const updateOrderStatus = async () => {
    if (!order || status === order.status) return

    setUpdating(true)
    const supabase = createClient()

    const { error } = await supabase.from("orders").update({ status }).eq("id", order.id)

    if (error) {
      console.error("Error updating order status:", error)
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: `Order status updated to ${status}`,
        variant: "default",
      })
      setOrder({ ...order, status })
    }

    setUpdating(false)
  }

  if (loading) {
    return <div>Loading order details...</div>
  }

  if (!order) {
    return <div>Order not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Button asChild variant="ghost" className="pl-0">
            <Link href="/admin/orders">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Orders
            </Link>
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={updateOrderStatus} disabled={updating || status === order.status}>
              {updating ? "Updating..." : "Update Status"}
            </Button>
          </div>
        </div>
      </div>

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
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Customer</h3>
                <p>User ID: {order.user_id}</p>
                {userEmail !== "Unknown" && <p>Email: {userEmail}</p>}
              </div>

              <h3 className="font-semibold mb-4">Items</h3>
              <div className="space-y-4">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-md">
                      <Image
                        src={item.product?.image_url || "/placeholder.svg?height=64&width=64"}
                        alt={item.product?.name || "Product"}
                        width={64}
                        height={64}
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.product?.name || `Product ID: ${item.product_id}`}</h4>
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
        </div>
      </div>
    </div>
  )
}


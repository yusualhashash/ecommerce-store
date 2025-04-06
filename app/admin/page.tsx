import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@/utils/supabase/server"
import { formatCurrency } from "@/lib/utils"
import { generateFallbackMonthlySales, getMonthlySales } from "@/utils/dashboard-helpers"

export default async function AdminDashboard() {
  const supabase = createClient()

  // Get stats with error handling
  const { data: orderStats, error: orderStatsError } = await supabase
    .from("orders")
    .select("id, total, created_at, status")
    .order("created_at", { ascending: false })
    .limit(5)

  // Handle potential errors
  if (orderStatsError) {
    console.error("Error fetching order stats:", orderStatsError)
  }

  // Get counts with error handling - use count() directly for more accurate results
  const { count: totalOrders, error: totalOrdersError } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })

  if (totalOrdersError) {
    console.error("Error fetching total orders:", totalOrdersError)
  }

  const { count: totalProducts, error: totalProductsError } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })

  if (totalProductsError) {
    console.error("Error fetching total products:", totalProductsError)
  }

  const { count: totalCustomers, error: totalCustomersError } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("role", "user")

  if (totalCustomersError) {
    console.error("Error fetching total customers:", totalCustomersError)
  }

  // Calculate total revenue with error handling
  const { data: revenueData, error: revenueError } = await supabase
    .from("orders")
    .select("total")
    .eq("status", "delivered")

  if (revenueError) {
    console.error("Error fetching revenue data:", revenueError)
  }

  const totalRevenue = revenueData?.reduce((sum, order) => sum + order.total, 0) || 0

  // Get monthly sales data using our direct query function
  const { data: monthlySales, error: monthlySalesError } = await getMonthlySales(supabase)

  if (monthlySalesError) {
    console.error("Error fetching monthly sales:", monthlySalesError)
  }

  // Use actual data or fallback
  const salesData = monthlySales || generateFallbackMonthlySales()

  // Format the chart data
  const chartData = salesData.map((item) => ({
    name: new Date(item.month).toLocaleDateString("en-US", { month: "short" }),
    total: item.total,
  }))

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders || 0}</div>
            <p className="text-xs text-muted-foreground">+12.5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts || 0}</div>
            <p className="text-xs text-muted-foreground">+5 new this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers || 0}</div>
            <p className="text-xs text-muted-foreground">+18.2% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          {/* Uncomment this if you want to add the chart back */}
          {/* <DashboardChartSection chartData={chartData} /> */}

          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest {orderStats?.length || 0} orders placed on your store</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orderStats?.map((order) => (
                  <div key={order.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Order #{order.id.substring(0, 8)}</p>
                      <p className="text-sm text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="font-medium">{formatCurrency(order.total)}</div>
                      <div
                        className={`rounded-full px-2 py-1 text-xs ${
                          order.status === "delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "processing"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </div>
                    </div>
                  </div>
                ))}

                {(!orderStats || orderStats.length === 0) && (
                  <div className="text-center py-4 text-muted-foreground">No recent orders found</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Analytics</CardTitle>
              <CardDescription>Detailed analytics will be displayed here</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border rounded-md">
                <p className="text-muted-foreground">Advanced analytics coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}


// Helper functions for the dashboard

/**
 * Safely attempts to call an RPC function and handles the case when it doesn't exist
 */
export async function safelyCallRPC(supabase: any, functionName: string, params?: any) {
  try {
    const { data, error } = await supabase.rpc(functionName, params || {})

    if (error) {
      // Check if the error is because the function doesn't exist
      if (error.message.includes("function") && error.message.includes("does not exist")) {
        console.warn(`RPC function "${functionName}" does not exist. Using fallback data.`)
        return { data: null, error: { message: `Function ${functionName} does not exist` } }
      }

      // Check for ambiguous column reference
      if (error.message.includes("column reference") && error.message.includes("is ambiguous")) {
        console.warn(`Ambiguous column reference in "${functionName}". Using fallback data.`)
        return { data: null, error: { message: `Ambiguous column reference in ${functionName}` } }
      }

      console.error(`Error calling RPC function "${functionName}":`, error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (err) {
    console.error(`Exception when calling RPC function "${functionName}":`, err)
    return { data: null, error: err }
  }
}

/**
 * Generates fallback monthly sales data when the RPC function is not available
 */
export function generateFallbackMonthlySales() {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const months = []

  // Generate data for the last 6 months
  for (let i = 5; i >= 0; i--) {
    const month = new Date(currentYear, currentDate.getMonth() - i, 1)
    months.push({
      month: month.toISOString(),
      total: Math.floor(Math.random() * 5000) + 1000, // Random value between 1000 and 6000
    })
  }

  return months
}

/**
 * Alternative to get_monthly_sales RPC function using direct SQL
 */
export async function getMonthlySales(supabase: any) {
  try {
    // Use a direct SQL query with table aliases to avoid ambiguous column references
    const { data, error } = await supabase.from("orders").select("created_at, total").neq("status", "cancelled")

    if (error) {
      console.error("Error fetching monthly sales data:", error)
      return { data: null, error }
    }

    // Process the data to group by month
    const monthlyData = data.reduce((acc: any, order: any) => {
      const date = new Date(order.created_at)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`

      if (!acc[monthKey]) {
        acc[monthKey] = {
          month: new Date(date.getFullYear(), date.getMonth(), 1).toISOString(),
          total: 0,
        }
      }

      acc[monthKey].total += Number(order.total)
      return acc
    }, {})

    // Convert to array and sort by month
    const monthlyArray = Object.values(monthlyData)
    monthlyArray.sort((a: any, b: any) => new Date(a.month).getTime() - new Date(b.month).getTime())

    return { data: monthlyArray, error: null }
  } catch (err) {
    console.error("Exception when getting monthly sales:", err)
    return { data: null, error: err }
  }
}


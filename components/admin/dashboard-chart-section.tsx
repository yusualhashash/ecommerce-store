"use client"

import dynamic from "next/dynamic"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Suspense } from "react"
import { ErrorBoundary } from "@/components/error-boundary"

// Create a separate client component for the chart to avoid SSR issues
const SalesChart = dynamic(() => import("@/components/admin/sales-chart"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] w-full flex items-center justify-center bg-muted/20 rounded-md">
      <div className="animate-pulse">Loading chart...</div>
    </div>
  ),
})

interface DashboardChartSectionProps {
  chartData: Array<{
    name: string
    total: number
  }>
}

export default function DashboardChartSection({ chartData }: DashboardChartSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Overview</CardTitle>
        <CardDescription>Monthly sales for the current year</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ErrorBoundary
          fallback={
            <div className="h-[300px] w-full flex items-center justify-center bg-muted/20 rounded-md">
              <div>Error loading chart. Please try refreshing the page.</div>
            </div>
          }
        >
          <Suspense
            fallback={
              <div className="h-[300px] w-full flex items-center justify-center bg-muted/20 rounded-md">
                <div className="animate-pulse">Loading chart...</div>
              </div>
            }
          >
            <SalesChart data={chartData} />
          </Suspense>
        </ErrorBoundary>
      </CardContent>
    </Card>
  )
}


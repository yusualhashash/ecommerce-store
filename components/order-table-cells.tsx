"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { Eye, Edit } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface OrderStatusCellProps {
  status: string
}

export function OrderStatusCell({ status }: OrderStatusCellProps) {
  return (
    <Badge
      className={
        status === "delivered"
          ? "bg-green-100 text-green-800 hover:bg-green-100"
          : status === "processing"
            ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
            : status === "shipped"
              ? "bg-purple-100 text-purple-800 hover:bg-purple-100"
              : status === "cancelled"
                ? "bg-red-100 text-red-800 hover:bg-red-100"
                : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      }
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}

interface OrderPriceCellProps {
  total: number
}

export function OrderPriceCell({ total }: OrderPriceCellProps) {
  return <span className="font-medium">{formatCurrency(total)}</span>
}

interface OrderDateCellProps {
  date: string
}

export function OrderDateCell({ date }: OrderDateCellProps) {
  return <span>{new Date(date).toLocaleDateString()}</span>
}

interface OrderActionsCellProps {
  orderId: string
}

export function OrderActionsCell({ orderId }: OrderActionsCellProps) {
  return (
    <div className="flex gap-2">
      <Button asChild variant="ghost" size="sm">
        <Link href={`/admin/orders/${orderId}`}>
          <Eye className="h-4 w-4 mr-1" />
          View
        </Link>
      </Button>
      <Button asChild variant="outline" size="sm">
        <Link href={`/admin/orders/${orderId}`}>
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Link>
      </Button>
    </div>
  )
}


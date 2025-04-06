"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"

interface ProductImageCellProps {
  imageUrl: string
  productName: string
}

export function ProductImageCell({ imageUrl, productName }: ProductImageCellProps) {
  return (
    <div className="relative h-10 w-10">
      <Image
        src={imageUrl || "/placeholder.svg?height=40&width=40"}
        alt={productName}
        fill
        className="rounded-md object-cover"
      />
    </div>
  )
}

interface ProductPriceCellProps {
  price: number
}

export function ProductPriceCell({ price }: ProductPriceCellProps) {
  return formatCurrency(price)
}

interface ProductStockCellProps {
  stock: number
}

export function ProductStockCell({ stock }: ProductStockCellProps) {
  return <div className={`font-medium ${stock <= 5 ? "text-red-500" : ""}`}>{stock}</div>
}

interface ProductActionsCellProps {
  productId: string
}

export function ProductActionsCell({ productId }: ProductActionsCellProps) {
  return (
    <div className="flex items-center gap-2">
      <Button asChild variant="ghost" size="sm">
        <Link href={`/admin/products/${productId}`}>Edit</Link>
      </Button>
    </div>
  )
}


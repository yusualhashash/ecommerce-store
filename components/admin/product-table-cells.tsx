"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import type { Product } from "@/types/database"

export function ProductImageCell({ product }: { product: Product }) {
  return (
    <div className="relative h-10 w-10">
      <Image
        src={product.image_url || "/placeholder.svg?height=40&width=40"}
        alt={product.name}
        width={40}
        height={40}
        className="rounded-md object-cover"
      />
    </div>
  )
}

export function ProductPriceCell({ price }: { price: number }) {
  return <span>{formatCurrency(price)}</span>
}

export function ProductStockCell({ stock }: { stock: number }) {
  return <div className={`font-medium ${stock <= 5 ? "text-red-500" : ""}`}>{stock}</div>
}

export function ProductActionsCell({ productId }: { productId: string }) {
  return (
    <div className="flex items-center gap-2">
      <Button asChild variant="ghost" size="sm">
        <Link href={`/admin/products/${productId}`}>Edit</Link>
      </Button>
    </div>
  )
}


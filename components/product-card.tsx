"use client"

import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/types/database"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"

interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <div className="aspect-square relative">
        <Image
          src={product.image_url || "/placeholder.svg?height=300&width=300"}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>
      <CardContent className="p-4 flex-grow flex flex-col">
        <div className="flex justify-between mb-2">
          <Link href={`/products/${product.id}`} className="font-medium hover:underline">
            {product.name}
          </Link>
          <div className="font-bold">{formatCurrency(product.price)}</div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 flex-grow">{product.description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 mt-auto">
        <Button onClick={() => onAddToCart?.(product)} className="w-full" disabled={product.stock <= 0}>
          {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
        </Button>
      </CardFooter>
    </Card>
  )
}


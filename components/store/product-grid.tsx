"use client"

import { useState, useEffect } from "react"
import type { Product } from "@/types/database"
import { ProductCard } from "./product-card"
import { useCart } from "@/hooks/use-cart"
import { createClient } from "@/utils/supabase/client"

interface ProductGridProps {
  category?: string
}

export function ProductGrid({ category }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()
  const supabase = createClient()

  useEffect(() => {
    async function fetchProducts() {
      let query = supabase.from("products").select("*")

      // Filter by category if provided
      if (category) {
        // Convert slug format (e.g., "home-kitchen") to database format (e.g., "Home & Kitchen")
        const formattedCategory = category
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
          .replace("And", "&")

        query = query.eq("category", formattedCategory)
      }

      const { data, error } = await query.order("created_at", { ascending: false })

      if (!error && data) {
        setProducts(data)
      } else {
        console.error("Error fetching products:", error)
      }
      setLoading(false)
    }

    fetchProducts()
  }, [supabase, category])

  if (loading) {
    return (
      <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-lg bg-muted animate-pulse h-[300px]"></div>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return <div className="text-center py-12">No products found</div>
  }

  return (
    <div className="grid grid-cols-1 px-2 4 md:px-4  lg:px-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAddToCart={addItem} />
      ))}
    </div>
  )
}


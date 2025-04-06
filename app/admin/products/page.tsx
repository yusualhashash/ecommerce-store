"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { DataTable } from "@/components/admin/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import type { Product } from "@/types/database"
import {
  ProductImageCell,
  ProductPriceCell,
  ProductStockCell,
  ProductActionsCell,
} from "@/components/admin/product-table-cells"

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      const supabase = createClient()
      const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false })
      setProducts(data || [])
      setLoading(false)
    }

    fetchProducts()
  }, [])

  // Define columns with pre-rendered cells
  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => <ProductImageCell product={row.original} />,
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => <ProductPriceCell price={Number(row.original.price)} />,
    },
    {
      accessorKey: "stock",
      header: "Stock",
      cell: ({ row }) => <ProductStockCell stock={Number(row.original.stock)} />,
    },
    {
      id: "actions",
      cell: ({ row }) => <ProductActionsCell productId={row.original.id} />,
    },
  ]

  if (loading) {
    return <div>Loading products...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button asChild>
          <Link href="/admin/products/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      <DataTable columns={columns} data={products} />
    </div>
  )
}


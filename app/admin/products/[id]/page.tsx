import { notFound } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { ProductForm } from "@/components/admin/product-form"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default async function AdminProductPage({ params }: ProductPageProps) {
  const supabase = await createClient()

  if (params.id === "new") {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Add New Product</h1>
        <ProductForm />
      </div>
    )
  }

  const { data: product } = await supabase.from("products").select("*").eq("id", params.id).single()

  if (!product) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Edit Product</h1>
      <ProductForm product={product} />
    </div>
  )
}


import { createClient } from "@/utils/supabase/server"
import { ProductGrid } from "@/components/store/product-grid"

interface ProductsPageProps {
  searchParams: {
    category?: string
  }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { category } = searchParams
  const supabase = createClient()

  let title = "All Products"
  let description = "Browse our complete collection of products"

  if (category) {
    // Format category name for display
    const formattedCategory = category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")

    title = formattedCategory
    description = `Browse our collection of ${formattedCategory.toLowerCase()} products`
  }

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <ProductGrid category={category} />
    </div>
  )
}


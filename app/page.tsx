import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ProductGrid } from "@/components/store/product-grid"
import { createClient } from "@/utils/supabase/server"
import { EnvCheck } from "@/components/env-check"
import { FeaturedCategories } from "@/components/store/featured-categories"

export default async function HomePage() {
  const supabase = createClient()

  // Get featured categories with correct images
  const categories = [
    {
      name: "Electronics",
      description: "Latest gadgets and tech",
      image:
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      slug: "electronics",
      icon: "cpu",
    },
    {
      name: "Clothing",
      description: "Stylish apparel for everyone",
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      slug: "clothing",
      icon: "shirt",
    },
    {
      name: "Kitchen",
      description: "Everything for your kitchen",
      image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      slug: "kitchen",
      icon: "chefHat",
    },
  ]

  return (
    <div className="flex flex-col">
      <EnvCheck />
      <section className="bg-muted py-12 md:py-24">
        <div className="container flex flex-col items-center text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">Quality Products for Everyone</h1>
          <p className="mt-6 max-w-prose text-muted-foreground md:text-xl">
            Discover our wide range of products at competitive prices. From electronics to kitchen goods, we have
            everything you need.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/products">Shop Now</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      <FeaturedCategories categories={categories} />

      <section className="py-12 md:py-24 bg-muted/30">
        <div className="container">
          <div className="flex items-center justify-between mb-12  px-2 4 md:px-4  lg:px-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Button asChild variant="outline">
              <Link href="/products">View All</Link>
            </Button>
          </div>
          <ProductGrid />
        </div>
      </section>

      <section className="bg-muted py-12 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold">Subscribe to Our Newsletter</h2>
            <p className="mt-4 text-muted-foreground">Stay updated with our latest products and offers.</p>
            <form className="mt-6 flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-md border bg-background px-4 py-2"
                required
              />
              <Button type="submit">Subscribe</Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}


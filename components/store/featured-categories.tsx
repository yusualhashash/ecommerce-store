"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Cpu, Shirt, ChefHat, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface Category {
  name: string
  description: string
  image: string
  slug: string
  icon: string
}

interface FeaturedCategoriesProps {
  categories: Category[]
}

export function FeaturedCategories({ categories }: FeaturedCategoriesProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "cpu":
        return <Cpu className="h-5 w-5" />
      case "shirt":
        return <Shirt className="h-5 w-5" />
      case "home":
      case "chefHat":
        return <ChefHat className="h-5 w-5" />
      default:
        return <Cpu className="h-5 w-5" />
    }
  }

  // Fallback images for each category
  const fallbackImages = {
    Electronics:
      "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    Clothing:
      "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    Kitchen: "https://images.unsplash.com/photo-1556910638-8c1698aa3e1a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  }

  const handleImageError = (categoryName: string) => {
    console.log(`Image error for category: ${categoryName}`)
    setImageErrors((prev) => ({
      ...prev,
      [categoryName]: true,
    }))
  }

  return (
    <section className="py-16 bg-black text-white ">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-2">Featured Categories</h2>
        <p className="text-center text-gray-400 mb-10">
          Browse our most popular categories and find exactly what you're looking for
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6  px-2 md:px-4  lg:px-8 ">
          {categories.map((category, index) => (
            <Link
              key={category.slug}
              href={`/products?category=${category.slug}`}
              className="group"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                className={cn(
                  "relative overflow-hidden rounded-xl border border-gray-800 bg-gray-900 transition-all duration-300",
                  "h-[300px] flex flex-col",
                  hoveredIndex === index ? "border-gray-700" : "",
                )}
              >
                <div className="relative h-[200px] w-full overflow-hidden">
                  <Image
                    src={
                      imageErrors[category.name]
                        ? fallbackImages[category.name as keyof typeof fallbackImages]
                        : category.image
                    }
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority
                    onError={() => handleImageError(category.name)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                </div>

                <div className="flex-1 p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 rounded-full bg-gray-800 text-white">{getIcon(category.icon)}</div>
                      <h3 className="font-bold text-xl">{category.name}</h3>
                    </div>
                    <p className="text-gray-400 text-sm">{category.description}</p>
                  </div>

                  <div
                    className={cn(
                      "flex items-center text-white text-sm font-medium mt-2 transition-all duration-300",
                      hoveredIndex === index ? "translate-x-1" : "",
                    )}
                  >
                    Browse products <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}


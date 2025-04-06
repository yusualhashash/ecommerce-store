"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/utils/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SetupProductsPage() {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  const setupAllProducts = async () => {
    setLoading(true)

    try {
      await Promise.all([setupElectronicsProducts(), setupClothingProducts(), setupKitchenProducts()])

      toast({
        title: "Success!",
        description: "All products have been added to the database.",
        variant: "success",
      })
    } catch (error) {
      console.error("Error setting up all products:", error)
      toast({
        title: "Error",
        description: "Failed to add all products. Please check the console for details.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const setupElectronicsProducts = async () => {
    try {
      await supabase.from("products").insert([
        {
          name: "Wireless Noise-Cancelling Headphones",
          description: "Premium over-ear headphones with active noise cancellation and 30-hour battery life.",
          price: 249.99,
          image_url:
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          category: "Electronics",
          stock: 45,
        },
        {
          name: 'Ultra HD Smart TV 55"',
          description: "Crystal clear 4K resolution with smart features and voice control.",
          price: 699.99,
          image_url:
            "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          category: "Electronics",
          stock: 20,
        },
        {
          name: "Smartphone Pro Max",
          description: "Latest flagship smartphone with advanced camera system and all-day battery life.",
          price: 999.99,
          image_url:
            "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          category: "Electronics",
          stock: 35,
        },
        {
          name: "Wireless Earbuds",
          description: "True wireless earbuds with noise isolation and touch controls.",
          price: 129.99,
          image_url:
            "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          category: "Electronics",
          stock: 50,
        },
      ])

      if (!loading) {
        toast({
          title: "Success!",
          description: "Electronics products have been added to the database.",
          variant: "success",
        })
      }
      return true
    } catch (error) {
      console.error("Error setting up electronics products:", error)
      if (!loading) {
        toast({
          title: "Error",
          description: "Failed to add electronics products.",
          variant: "destructive",
        })
      }
      throw error
    }
  }

  const setupClothingProducts = async () => {
    try {
      await supabase.from("products").insert([
        {
          name: "Premium Cotton T-Shirt",
          description: "Ultra-soft 100% organic cotton t-shirt with a relaxed fit.",
          price: 29.99,
          image_url:
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          category: "Clothing",
          stock: 100,
        },
        {
          name: "Slim Fit Jeans",
          description: "Classic blue denim with stretch technology for maximum comfort.",
          price: 59.99,
          image_url:
            "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          category: "Clothing",
          stock: 75,
        },
        {
          name: "Wool Blend Overcoat",
          description: "Elegant winter coat with a tailored silhouette and warm lining.",
          price: 199.99,
          image_url:
            "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          category: "Clothing",
          stock: 25,
        },
        {
          name: "Athletic Performance Hoodie",
          description: "Moisture-wicking fabric with thermal regulation for workouts.",
          price: 79.99,
          image_url:
            "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          category: "Clothing",
          stock: 60,
        },
      ])

      if (!loading) {
        toast({
          title: "Success!",
          description: "Clothing products have been added to the database.",
          variant: "success",
        })
      }
      return true
    } catch (error) {
      console.error("Error setting up clothing products:", error)
      if (!loading) {
        toast({
          title: "Error",
          description: "Failed to add clothing products.",
          variant: "destructive",
        })
      }
      throw error
    }
  }

  const setupKitchenProducts = async () => {
    try {
      await supabase.from("products").insert([
        {
          name: "Professional Chef Knife Set",
          description: "Premium 8-piece stainless steel knife set with wooden block.",
          price: 129.99,
          image_url:
            "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          category: "Kitchen",
          stock: 35,
        },
        {
          name: "Smart Programmable Coffee Maker",
          description: "12-cup capacity with customizable brewing options and timer.",
          price: 89.99,
          image_url:
            "https://images.unsplash.com/photo-1570486876385-42a3c9215d1b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          category: "Kitchen",
          stock: 25,
        },
        {
          name: "Non-Stick Cookware Set",
          description: "10-piece aluminum set with ceramic coating and silicone handles.",
          price: 199.99,
          image_url:
            "https://images.unsplash.com/photo-1585837575652-267cbc187fc3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          category: "Kitchen",
          stock: 20,
        },
        {
          name: "Luxury Egyptian Cotton Kitchen Towel Set",
          description: "Ultra-absorbent 6-piece set with hotel-quality softness.",
          price: 79.99,
          image_url:
            "https://images.unsplash.com/photo-1583845112203-29329902332e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          category: "Kitchen",
          stock: 45,
        },
        // Additional Kitchen products
        {
          name: "Modern Kitchen Island Cart",
          description: "Stylish kitchen cart with storage shelves and butcher block top.",
          price: 249.99,
          image_url:
            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          category: "Kitchen",
          stock: 15,
        },
        {
          name: "Digital Air Fryer",
          description: "Programmable air fryer with multiple cooking modes and large capacity.",
          price: 179.99,
          image_url:
            "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          category: "Kitchen",
          stock: 30,
        },
        {
          name: "Ceramic Dinner Set",
          description: "16-piece elegant dining set with plates, bowls, and mugs for 4 people.",
          price: 89.99,
          image_url:
            "https://images.unsplash.com/photo-1603199506016-b9a594b593c0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          category: "Kitchen",
          stock: 40,
        },
        {
          name: "Stainless Steel Blender",
          description: "Powerful 1000W blender with multiple speed settings and pulse function.",
          price: 129.99,
          image_url:
            "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          category: "Kitchen",
          stock: 30,
        },
      ])

      if (!loading) {
        toast({
          title: "Success!",
          description: "Kitchen products have been added to the database.",
          variant: "success",
        })
      }
      return true
    } catch (error) {
      console.error("Error setting up kitchen products:", error)
      if (!loading) {
        toast({
          title: "Error",
          description: "Failed to add kitchen products.",
          variant: "destructive",
        })
      }
      throw error
    }
  }

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-6">Setup Products</h1>

      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Categories</TabsTrigger>
          <TabsTrigger value="electronics">Electronics</TabsTrigger>
          <TabsTrigger value="clothing">Clothing</TabsTrigger>
          <TabsTrigger value="kitchen">Kitchen</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Add All Products</CardTitle>
              <CardDescription>
                Add sample products for all categories (Electronics, Clothing, and Kitchen)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-6">
                This will add sample products for all categories to your database. These products will appear when
                browsing the store.
              </p>

              <Button onClick={setupAllProducts} disabled={loading}>
                {loading ? "Adding Products..." : "Add All Sample Products"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="electronics">
          <Card>
            <CardHeader>
              <CardTitle>Add Electronics Products</CardTitle>
              <CardDescription>Add sample products for the Electronics category</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-6">This will add 4 sample electronics products to your database.</p>

              <Button onClick={setupElectronicsProducts} disabled={loading}>
                {loading ? "Adding Products..." : "Add Electronics Products"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clothing">
          <Card>
            <CardHeader>
              <CardTitle>Add Clothing Products</CardTitle>
              <CardDescription>Add sample products for the Clothing category</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-6">This will add 4 sample clothing products to your database.</p>

              <Button onClick={setupClothingProducts} disabled={loading}>
                {loading ? "Adding Products..." : "Add Clothing Products"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kitchen">
          <Card>
            <CardHeader>
              <CardTitle>Add Kitchen Products</CardTitle>
              <CardDescription>Add sample products for the Kitchen category</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-6">
                This will add 8 sample kitchen products to your database, including kitchen appliances, cookware, and
                dining essentials.
              </p>

              <Button onClick={setupKitchenProducts} disabled={loading}>
                {loading ? "Adding Products..." : "Add Kitchen Products"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}


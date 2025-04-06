"use client"

import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/hooks/use-cart"
import { formatCurrency } from "@/lib/utils"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function CartDrawer() {
  const { items, removeItem, updateQuantity, total, itemCount, clearCart } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { createClient } = await import("@/utils/supabase/client")
        const supabase = createClient()
        const { data } = await supabase.auth.getSession()
        setIsAuthenticated(!!data.session)
      } catch (error) {
        console.error("Error checking authentication:", error)
        setIsAuthenticated(false)
      }
    }

    checkAuth()
  }, [])

  const handleCheckout = () => {
    if (!isAuthenticated) {
      setIsOpen(false)
      router.push("/login?redirect=checkout")
      return
    }

    router.push("/checkout")
    setIsOpen(false)
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {itemCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Your Cart ({itemCount})</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center space-y-4">
            <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            <div className="text-xl font-medium">Your cart is empty</div>
            <Button onClick={() => setIsOpen(false)}>Continue Shopping</Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto py-4">
              <ul className="space-y-4">
                {items.map((item) => (
                  <li key={item.product.id} className="flex items-center space-x-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-md">
                      <Image
                        src={item.product.image_url || "/placeholder.svg?height=64&width=64"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="font-medium">{item.product.name}</h4>
                      <p className="text-sm text-muted-foreground">{formatCurrency(item.product.price)}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-4 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeItem(item.product.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4 pt-4">
              <Separator />
              <div className="flex items-center justify-between">
                <span className="font-medium">Total</span>
                <span className="font-bold">{formatCurrency(total)}</span>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => clearCart()} className="flex-1">
                  Clear Cart
                </Button>
                <Button onClick={handleCheckout} className="flex-1">
                  Checkout
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}


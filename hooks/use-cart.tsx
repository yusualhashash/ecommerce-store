"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useRef } from "react"
import type { Product, CartItem } from "@/types/database"
import { useToast } from "@/hooks/use-toast"

interface CartContextType {
  items: CartItem[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  itemCount: number
  total: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const { toast } = useToast()

  // Ref to track toast locks per product id to prevent duplicate notifications
  const toastLockRef = useRef<Record<string, boolean>>({})

  // Load cart from localStorage on client side
  useEffect(() => {
    const storedCart = localStorage.getItem("cart")
    if (storedCart) {
      try {
        setItems(JSON.parse(storedCart))
      } catch (error) {
        console.error("Failed to parse cart from localStorage", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem("cart", JSON.stringify(items))
    }
  }, [items])

  const addItem = (product: Product) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product.id === product.id)
      let updatedItems: CartItem[]

      if (existingItem) {
        updatedItems = prevItems.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
        if (!toastLockRef.current[product.id]) {
          toast({
            title: "Cart updated",
            description: `${product.name} quantity increased to ${existingItem.quantity + 1}`,
            variant: "success",
          })
          toastLockRef.current[product.id] = true
          setTimeout(() => {
            toastLockRef.current[product.id] = false
          }, 2000)
        }
      } else {
        updatedItems = [...prevItems, { product, quantity: 1 }]
        if (!toastLockRef.current[product.id]) {
          toast({
            title: "Added to cart",
            description: `${product.name} has been added to your cart`,
            variant: "success",
          })
          toastLockRef.current[product.id] = true
          setTimeout(() => {
            toastLockRef.current[product.id] = false
          }, 2000)
        }
      }
      return updatedItems
    })
  }

  const removeItem = (productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.product.id !== productId))

    // If cart is empty after removal, clear localStorage
    if (items.length === 1) {
      localStorage.removeItem("cart")
    }
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }
    setItems((prevItems) => prevItems.map((item) => (item.product.id === productId ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
      variant: "default",
    })
    setItems([])
    localStorage.removeItem("cart")
  }

  const itemCount = items.reduce((total, item) => total + item.quantity, 0)
  const total = items.reduce((total, item) => total + item.product.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}


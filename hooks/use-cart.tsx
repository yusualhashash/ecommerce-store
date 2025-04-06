"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
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

      if (existingItem) {
        // Only show toast for quantity increase
        toast({
          title: "Cart updated",
          description: `${product.name} quantity increased to ${existingItem.quantity + 1}`,
          variant: "success",
        })

        return prevItems.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }

      // Show toast for new item
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart`,
        variant: "success",
      })

      return [...prevItems, { product, quantity: 1 }]
    })
  }

  const removeItem = (productId: string) => {
    const itemToRemove = items.find((item) => item.product.id === productId)

    if (itemToRemove) {
      toast({
        title: "Removed from cart",
        description: `${itemToRemove.product.name} has been removed from your cart`,
        variant: "default",
      })
    }

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


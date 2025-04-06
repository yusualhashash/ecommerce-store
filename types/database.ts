export type Product = {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  category: string
  stock: number
  created_at: string
}

export type User = {
  id: string
  email: string
  role: "user" | "admin"
}

export type Order = {
  id: string
  user_id: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  total: number
  created_at: string
}

export type OrderItem = {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price: number
}

export type CartItem = {
  product: Product
  quantity: number
}


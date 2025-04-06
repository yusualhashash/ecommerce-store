import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { CheckoutForm } from "@/components/store/checkout-form"

export default async function CheckoutPage() {
  const supabase = await createClient()

  // Use getUser instead of getSession for more secure authentication
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  // If not logged in or error, redirect
  if (error || !user) {
    redirect("/login?redirect=checkout")
  }

  return (
    <div className="container max-w-4xl py-12 mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>
      <CheckoutForm userId={user.id} />
    </div>
  )
}


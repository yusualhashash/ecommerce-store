import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { CheckoutForm } from "@/components/store/checkout-form"

export default async function CheckoutPage() {
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If not logged in, redirect
  if (!session) {
    redirect("/login?redirect=checkout")
  }

  return (
    <div className="container max-w-4xl py-12 mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>
      <CheckoutForm userId={session.user.id} />
    </div>
  )
}

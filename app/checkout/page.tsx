import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { CheckoutForm } from "@/components/store/checkout-form"

export default async function CheckoutPage() {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login?redirect=checkout")
  }

  return (
    <div className="container max-w-4xl py-12">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <CheckoutForm userId={session.user.id} />
    </div>
  )
}


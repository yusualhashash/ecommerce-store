import { SignupForm } from "@/components/auth/signup-form"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export default async function SignupPage() {
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    redirect("/")
  }

  return (
    <div className="container flex items-center justify-center py-12 md:py-24">
      <SignupForm />
    </div>
  )
}


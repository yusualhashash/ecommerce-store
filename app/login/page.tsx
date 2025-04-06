import { LoginForm } from "@/components/auth/login-form"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { redirect?: string }
}) {
  // Ensure searchParams is awaited before using its properties.
  const sp = await Promise.resolve(searchParams)
  const redirectParam = sp.redirect

  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    if (redirectParam) {
      redirect(`/${redirectParam}`)
    } else {
      redirect("/")
    }
  }

  return (
    <div className="container flex items-center justify-center py-12 md:py-24">
      <LoginForm redirectPath={redirectParam} />
    </div>
  )
}

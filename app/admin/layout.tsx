import type React from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // For demo purposes, we'll skip the authentication check
  // This allows anyone to access the admin area in the demo

  // In a production environment, you would uncomment this code:
  /*
  const supabase = createClient()
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      redirect("/login?redirect=/admin")
    }

    // Check if user has admin role
    const { data } = await supabase.from("users").select("role").eq("id", session.user.id).single()
    if (data?.role !== "admin") {
      redirect("/")
    }
  } catch (error) {
    console.error("Error in admin layout:", error)
    // Handle the error gracefully
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>
        <p className="text-muted-foreground mb-4">There was an error checking your credentials.</p>
        <a href="/login?redirect=/admin" className="text-blue-500 hover:underline">
          Please try logging in again
        </a>
      </div>
    )
  }
  */

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <AdminSidebar />
        <div className="flex flex-1 flex-col">
          <AdminHeader />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}


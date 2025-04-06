"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Package2, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CartDrawer } from "./cart-drawer"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { signOut } from "@/app/actions/auth"
import { clearAuthData } from "@/utils/auth-helpers"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const checkUser = async () => {
      try {
        // Import the createClient function dynamically to avoid issues during SSR
        const { createClient } = await import("@/utils/supabase/client")
        const supabase = createClient()

        const {
          data: { session },
        } = await supabase.auth.getSession()
        setUser(session?.user || null)

        if (session?.user) {
          const { data } = await supabase.from("users").select("role").eq("id", session.user.id).single()

          setIsAdmin(data?.role === "admin")
        }

        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
          setUser(session?.user || null)

          if (session?.user) {
            const { data } = await supabase.from("users").select("role").eq("id", session.user.id).single()

            setIsAdmin(data?.role === "admin")
          } else {
            setIsAdmin(false)
          }
        })

        return () => {
          authListener.subscription.unsubscribe()
        }
      } catch (error) {
        console.error("Error checking user:", error)
      }
    }

    checkUser()
  }, [])

  const handleSignOut = async () => {
    if (isSigningOut) return

    setIsSigningOut(true)

    try {
      toast({
        title: "Signing out...",
        description: "Please wait while we log you out",
      })

      // Clear client-side auth data first to ensure UI updates
      clearAuthData()

      const result = await signOut()

      if (!result.success) {
        console.warn("Sign out warning:", result.error)
        // Continue with sign out process even if there was a server error
      }

      toast({
        title: "Signed out successfully",
        description: "You have been logged out",
        variant: "success",
      })

      // Force a hard refresh to clear any cached state
      window.location.href = "/"
    } catch (error) {
      console.error("Error signing out:", error)
      toast({
        title: "Error signing out",
        description: "An unexpected error occurred, but we've cleared your local session",
        variant: "destructive",
      })

      // Force a refresh anyway to ensure the user is logged out client-side
      window.location.href = "/"
    } finally {
      setIsSigningOut(false)
    }
  }

  // For demo purposes, make all users admin
  useEffect(() => {
    if (user) {
      setIsAdmin(true)
    }
  }, [user])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Package2 className="h-6 w-6" />
          <span className="hidden sm:inline-block">E-commerce Store</span>
        </Link>

        <nav className="hidden md:flex ml-10 gap-6">
          <Link href="/" className="text-sm font-medium hover:underline">
            Home
          </Link>
          <Link href="/products" className="text-sm font-medium hover:underline">
            Products
          </Link>
          <Link href="/about" className="text-sm font-medium hover:underline">
            About
          </Link>
          <Link href="/contact" className="text-sm font-medium hover:underline">
            Contact
          </Link>
        </nav>

        <div className="flex items-center ml-auto gap-4">
          <CartDrawer />

          {user ? (
            <div className="flex items-center gap-2">
              {/* Show Admin button for all users in this demo */}
              <Button asChild variant="outline" size="sm">
                <Link href="/admin">Admin</Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="/orders">My Orders</Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut} disabled={isSigningOut}>
                {isSigningOut ? "Signing Out..." : "Sign Out"}
              </Button>
            </div>
          ) : (
            <Button asChild variant="outline" size="sm">
              <Link href="/login">Sign In</Link>
            </Button>
          )}

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <nav className="flex flex-col p-4 space-y-4">
            <Link href="/" className="text-sm font-medium" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link href="/products" className="text-sm font-medium" onClick={() => setIsMenuOpen(false)}>
              Products
            </Link>
            <Link href="/about" className="text-sm font-medium" onClick={() => setIsMenuOpen(false)}>
              About
            </Link>
            <Link href="/contact" className="text-sm font-medium" onClick={() => setIsMenuOpen(false)}>
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}


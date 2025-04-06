"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, LayoutDashboard, Users, ShoppingBag, CircleDollarSign, Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { clearAuthData } from "@/utils/auth-helpers"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { signOut } from "@/app/actions/auth"

const sidebarItems = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: Home,
  },
  {
    href: "/admin/products",
    label: "Products",
    icon: ShoppingBag,
  },
  {
    href: "/admin/orders",
    label: "Orders",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/customers",
    label: "Customers",
    icon: Users,
  },
  {
    href: "/admin/setup-products",
    label: "Setup Products",
    icon: Database,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const { toast } = useToast()

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

      try {
        // Try to call the server action, but don't fail if it doesn't work
        await signOut().catch((err) => {
          console.warn("Sign out warning:", err)
          // Continue with sign out process even if there was a server error
        })
      } catch (error) {
        console.warn("Sign out warning:", error)
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

  return (
    <div className="hidden border-r bg-muted/40 flex-col p-6 lg:flex w-64">
      <Link href="/" className="flex items-center gap-2 font-semibold pb-4">
        <CircleDollarSign className="h-6 w-6" />
        <span>E-commerce Store</span>
      </Link>
      <div className="flex flex-col space-y-1">
        {sidebarItems.map((item) => (
          <Button
            key={item.href}
            asChild
            variant="ghost"
            className={`justify-start px-2 ${
              pathname === item.href || pathname?.startsWith(`${item.href}/`) ? "bg-muted font-medium" : ""
            }`}
          >
            <Link href={item.href} className="flex items-center space-x-2">
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          </Button>
        ))}
      </div>
      <div className="mt-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start px-2">
              <Avatar className="mr-2 h-5 w-5">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <span>My Account</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} disabled={isSigningOut}>
              {isSigningOut ? "Signing Out..." : "Sign out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}


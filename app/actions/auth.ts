"use server"

import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

// Update the signOut function to handle missing sessions gracefully
export async function signOut() {
  try {
    const supabase = createClient()

    // Get the current session first
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Only attempt to sign out if there's an active session
    if (session) {
      const { error } = await supabase.auth.signOut()
      if (error) {
        throw new Error(`Supabase sign out failed: ${error.message}`)
      }
    }

    // Clear auth cookies regardless of session status
    const cookieStore = cookies()
    cookieStore.getAll().forEach((cookie) => {
      if (cookie.name.includes("supabase") || cookie.name.includes("auth")) {
        cookieStore.delete(cookie.name)
      }
    })

    // Revalidate all paths to ensure fresh data
    revalidatePath("/", "layout")

    return { success: true }
  } catch (error) {
    console.error("Sign out error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred during sign out",
    }
  }
}


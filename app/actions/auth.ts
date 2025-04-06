"use server"

import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

export async function signOut() {
  try {
    const supabase = await createClient()

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (session) {
      const { error } = await supabase.auth.signOut()
      if (error) {
        throw new Error(`Supabase sign out failed: ${error.message}`)
      }
    }

    const cookieStore = await cookies()
    cookieStore.getAll().forEach((cookie) => {
      if (cookie.name.includes("supabase") || cookie.name.includes("auth")) {
        cookieStore.delete(cookie.name)
      }
    })

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


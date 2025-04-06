import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/utils/env"

export async function createClient() {
  const cookieStore = await cookies()

  // Use our environment utility to get values with fallbacks
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch (error) {
          // Handle potential errors when setting cookies
          console.error("Error setting cookie:", error)
        }
      },
      remove(name: string, options: any) {
        try {
          cookieStore.set({ name, value: "", ...options })
        } catch (error) {
          // Handle potential errors when removing cookies
          console.error("Error removing cookie:", error)
        }
      },
    },
  })
}


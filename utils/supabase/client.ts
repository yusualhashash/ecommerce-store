import { createBrowserClient } from "@supabase/ssr"
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/utils/env"

export function createClient() {
  // Use our environment utility to get values with fallbacks
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}


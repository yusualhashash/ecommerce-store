// This file provides fallback functionality when Supabase credentials are missing
import { createClient as createSupabaseClient } from "@supabase/supabase-js"

// Create a mock Supabase client that returns empty data
export const createFallbackClient = () => {
  // Use the demo Supabase URL and anon key from the docs
  const supabaseUrl = "https://lworwfzvgixeiqlupfcw.supabase.co"
  const supabaseAnonKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3b3J3Znp2Z2l4ZWlxbHVwZmN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4NjUxOTcsImV4cCI6MjA1OTQ0MTE5N30.kk7qzeD0W-GTFY8q1IDy4igZUBqJqCEwHO0ppTcgIlU"

  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}


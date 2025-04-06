// Utility to safely access environment variables with fallbacks
export const getEnv = (key: string, fallback = ""): string => {
  // For client-side code, we need to use the NEXT_PUBLIC_ prefixed variables
  const value = typeof window !== "undefined" ? (window as any).__ENV__?.[key] || process.env[key] : process.env[key]

  if (!value) {
    // Log in development but not in production to avoid leaking sensitive info
    if (process.env.NODE_ENV !== "production") {
      console.warn(`Environment variable ${key} is not set, using fallback value`)
    }
    return fallback
  }

  return value
}

// Export commonly used environment variables with hardcoded fallbacks for development
export const SUPABASE_URL = getEnv("NEXT_PUBLIC_SUPABASE_URL", "https://lworwfzvgixeiqlupfcw.supabase.co")

export const SUPABASE_ANON_KEY = getEnv(
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3b3J3Znp2Z2l4ZWlxbHVwZmN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4NjUxOTcsImV4cCI6MjA1OTQ0MTE5N30.kk7qzeD0W-GTFY8q1IDy4igZUBqJqCEwHO0ppTcgIlU",
)

export const SUPABASE_SERVICE_ROLE_KEY = getEnv(
  "SUPABASE_SERVICE_ROLE_KEY",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3b3J3Znp2Z2l4ZWlxbHVwZmN3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Mzg2NTE5NywiZXhwIjoyMDU5NDQxMTk3fQ.c9fuar9gFRaG0zRVZ4Rw5Mz5v2S68vBDwQJMIUabq6k",
)


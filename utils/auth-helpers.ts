/**
 * Helper functions for authentication
 */

// Clear all auth-related data from the client
export function clearAuthData() {
  // Clear any auth tokens from localStorage
  if (typeof window !== "undefined") {
    // Clear Supabase specific items
    localStorage.removeItem("supabase.auth.token")
    localStorage.removeItem("supabase.auth.expires_at")
    localStorage.removeItem("supabase.auth.refresh_token")

    // Clear any sb-* cookies which Supabase uses
    document.cookie.split(";").forEach((cookie) => {
      const [name] = cookie.trim().split("=")
      if (name.includes("sb-")) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`
      }
    })

    // Clear any other auth-related items
    const authKeys = Object.keys(localStorage).filter(
      (key) => key.includes("auth") || key.includes("token") || key.includes("session") || key.includes("supabase"),
    )

    authKeys.forEach((key) => {
      localStorage.removeItem(key)
    })

    // Clear session storage as well
    try {
      sessionStorage.clear()
    } catch (e) {
      console.warn("Could not clear sessionStorage:", e)
    }
  }
}


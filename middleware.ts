import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  // For demo purposes, we'll allow all access
  // In a production environment, you would uncomment this code

  /*
  // Check if the request is for the admin area
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    
    // If no session, redirect to login
    if (!session) {
      const url = new URL(`/login`, request.url)
      url.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
  }
  */

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/admin/:path*"],
}


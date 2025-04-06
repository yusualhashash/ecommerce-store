import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get("email")

  if (!email) {
    return NextResponse.json({ error: "Email parameter is required" }, { status: 400 })
  }

  try {
    const cookieStore = await cookies()

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: "Supabase credentials are missing" }, { status: 500 })
    }

    // Create a Supabase client with the service role key
    const supabase = createServerClient(supabaseUrl, supabaseServiceKey, {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value
        },
        set(name, value, options) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name, options) {
          cookieStore.set({ name, value: "", ...options })
        },
      },
    })

    // Find the user by email
    const {
      data: { users },
      error: userError,
    } = await supabase.auth.admin.listUsers({ query: `email eq '${email}'` } as any)

    if (userError || !users || users.length === 0) {
      return NextResponse.json({ error: userError?.message || "User not found" }, { status: 404 })
    }

    const user = users[0]

    // Update user metadata to set role as admin
    const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
      user_metadata: {
        ...user.user_metadata,
        role: "admin",
      },
    })

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: `User ${email} has been made an admin`,
    })
  } catch (error) {
    console.error("Error creating admin:", error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}


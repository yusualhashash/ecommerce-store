"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AdminSetupPage() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [result, setResult] = useState<{ success?: boolean; message?: string } | null>(null)

  const makeAdmin = async () => {
    if (!email) {
      setResult({ success: false, message: "Please enter an email address" })
      return
    }

    setLoading(true)
    setResult(null)

    try {
      // Call the API endpoint to make the user an admin
      const response = await fetch(`/api/create-admin?email=${encodeURIComponent(email)}`)
      const data = await response.json()

      if (data.success) {
        setResult({
          success: true,
          message: "User has been made an admin! Please log out and log back in for changes to take effect.",
        })
      } else {
        setResult({
          success: false,
          message: data.error || "Failed to make user admin",
        })
      }
    } catch (error) {
      console.error("Error:", error)
      setResult({
        success: false,
        message: "An error occurred while trying to update the user role",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container flex items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Setup</CardTitle>
          <CardDescription>Make a user account an admin to access the dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          {result && (
            <Alert variant={result.success ? "default" : "destructive"} className="mb-4">
              <AlertDescription>{result.message}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                required
              />
            </div>

            <Button onClick={makeAdmin} disabled={loading} className="w-full">
              {loading ? "Processing..." : "Make Admin"}
            </Button>
          </div>

          {result?.success && (
            <div className="mt-4 text-center text-sm text-muted-foreground">
              <p>The user now has admin privileges.</p>
              <p>They should log out and log back in to access the admin dashboard.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


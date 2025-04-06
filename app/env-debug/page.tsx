"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export default function EnvDebugPage() {
  const [envVars, setEnvVars] = useState<Record<string, string>>({})

  useEffect(() => {
    // Only collect NEXT_PUBLIC_ variables for security
    const publicVars: Record<string, string> = {}

    // Get all environment variables that start with NEXT_PUBLIC_
    Object.keys(process.env).forEach((key) => {
      if (key.startsWith("NEXT_PUBLIC_")) {
        publicVars[key] = process.env[key] || ""
      }
    })

    setEnvVars(publicVars)
  }, [])

  const restartApp = () => {
    window.location.href = "/"
  }

  return (
    <div className="container py-12">
      <Card>
        <CardHeader>
          <CardTitle>Environment Variables Debug</CardTitle>
          <CardDescription>This page shows the current state of your public environment variables.</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <AlertDescription>
              <p>If your environment variables are not showing up correctly, try the following:</p>
              <ul className="list-disc pl-5 mt-2">
                <li>Make sure your .env.local file is in the root directory of your project</li>
                <li>Restart your Next.js development server</li>
                <li>Clear your browser cache and reload the page</li>
                <li>Make sure your variables start with NEXT_PUBLIC_ if they need to be accessed on the client</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Available Public Environment Variables:</h3>
            {Object.keys(envVars).length > 0 ? (
              <pre className="bg-muted p-4 rounded-md overflow-auto">{JSON.stringify(envVars, null, 2)}</pre>
            ) : (
              <p className="text-muted-foreground">No public environment variables found.</p>
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <Button onClick={restartApp}>Restart Application</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


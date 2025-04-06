"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/utils/env"

export function EnvCheck() {
  const [missingVars, setMissingVars] = useState<string[]>([])
  const [showDebug, setShowDebug] = useState(false)
  const [envValues, setEnvValues] = useState<Record<string, string>>({})
  const [usingFallbacks, setUsingFallbacks] = useState(false)

  useEffect(() => {
    // Check if we're using the actual env vars or fallbacks
    const actualSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const actualSupabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    const missing = []
    if (!actualSupabaseUrl) missing.push("NEXT_PUBLIC_SUPABASE_URL")
    if (!actualSupabaseKey) missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY")

    setMissingVars(missing)
    setUsingFallbacks(missing.length > 0)

    // For debugging, store the current values
    setEnvValues({
      NEXT_PUBLIC_SUPABASE_URL: SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: SUPABASE_ANON_KEY,
      "Using Fallbacks": missing.length > 0 ? "Yes" : "No",
    })
  }, [])

  // If no missing vars and not using fallbacks, don't show anything
  if (missingVars.length === 0 && !usingFallbacks) return null

  return (
    <Alert variant={usingFallbacks ? "default" : "destructive"} className="mb-4">
      <AlertTitle>
        {usingFallbacks ? "Using Fallback Environment Variables" : "Missing Environment Variables"}
      </AlertTitle>
      <AlertDescription>
        {usingFallbacks ? (
          <p>
            The application is running with fallback values for environment variables. This is fine for development, but
            you should set up proper environment variables for production.
          </p>
        ) : (
          <>
            <p>The following environment variables are missing:</p>
            <ul className="list-disc pl-5 mt-2">
              {missingVars.map((varName) => (
                <li key={varName}>{varName}</li>
              ))}
            </ul>
          </>
        )}

        <div className="mt-4">
          <Button variant="outline" size="sm" onClick={() => setShowDebug(!showDebug)}>
            {showDebug ? "Hide Debug Info" : "Show Debug Info"}
          </Button>

          {showDebug && (
            <div className="mt-2 p-2 bg-black/10 rounded text-xs">
              <p>Environment variable debugging:</p>
              <pre className="mt-1 overflow-auto">{JSON.stringify(envValues, null, 2)}</pre>
              <p className="mt-2">
                Note: The application is using {usingFallbacks ? "fallback" : "actual"} environment values.
              </p>
            </div>
          )}
        </div>

        <div className="mt-4">
          <p className="text-sm font-medium">Quick Fix:</p>
          <ol className="list-decimal pl-5 mt-1 text-sm">
            <li>
              Run <code className="bg-black/10 px-1 rounded">node scripts/env-setup.js</code> to set up environment
              variables
            </li>
            <li>
              Delete the <code className="bg-black/10 px-1 rounded">.next</code> folder to clear the build cache
            </li>
            <li>Restart your Next.js development server</li>
          </ol>
        </div>
      </AlertDescription>
    </Alert>
  )
}


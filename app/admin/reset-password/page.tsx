"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { createClient } from "@/lib/supabase/client"

export default function AdminResetPasswordPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    let mounted = true

    const prepareRecoverySession = async () => {
      const hash = window.location.hash
      if (!hash.includes("access_token=") || !hash.includes("type=recovery")) {
        if (mounted) setError("Invalid or expired recovery link.")
        return
      }

      const params = new URLSearchParams(hash.replace(/^#/, ""))
      const accessToken = params.get("access_token")
      const refreshToken = params.get("refresh_token")

      if (!accessToken || !refreshToken) {
        if (mounted) setError("Invalid recovery session.")
        return
      }

      const { error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      })

      if (sessionError) {
        if (mounted) setError(sessionError.message)
        return
      }

      if (mounted) setIsReady(true)
    }

    prepareRecoverySession()

    return () => {
      mounted = false
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (password.length < 8) {
      setError("Password must be at least 8 characters.")
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      setIsLoading(false)
      return
    }

    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })

    if (updateError) {
      setError(updateError.message)
      setIsLoading(false)
      return
    }

    await supabase.auth.signOut()
    router.replace("/admin/login")
    router.refresh()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="font-serif text-3xl font-bold">
            Eyeglam
          </Link>
          <p className="mt-2 text-muted-foreground">Admin Password Reset</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h1 className="text-xl font-semibold">Set New Password</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose a new password for your admin account.
          </p>

          {!isReady && !error && (
            <p className="mt-4 text-sm text-muted-foreground">Validating reset link...</p>
          )}

          {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

          {isReady && (
            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="new-password"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  autoComplete="new-password"
                />
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading && <Spinner className="mr-2" />}
                Update Password
              </Button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link
              href="/admin/login"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Back to admin login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

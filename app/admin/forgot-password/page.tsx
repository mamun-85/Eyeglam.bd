"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { createClient } from "@/lib/supabase/client"

export default function AdminForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string

    const supabase = createClient()
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/reset-password`,
    })

    if (resetError) {
      setError(resetError.message)
      setIsLoading(false)
      return
    }

    setSuccess(true)
    setIsLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="font-serif text-3xl font-bold">
            Eyeglam
          </Link>
          <p className="mt-2 text-muted-foreground">Admin Password Recovery</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h1 className="text-xl font-semibold">Forgot Password</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter your admin email to receive a password reset link.
          </p>

          {success ? (
            <p className="mt-4 text-sm text-foreground">
              If an account exists for that email, a reset link has been sent.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@example.com"
                  required
                  autoComplete="email"
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading && <Spinner className="mr-2" />}
                Send Reset Link
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

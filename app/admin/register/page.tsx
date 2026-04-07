"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { createClient } from "@/lib/supabase/client"

export default function AdminRegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string
    const registrationKey = formData.get("registrationKey") as string

    // Guard: require a registration key set via env variable
    const expectedKey = process.env.NEXT_PUBLIC_ADMIN_REGISTER_KEY
    if (!expectedKey || registrationKey !== expectedKey) {
      setError("Invalid registration key. Contact your system administrator.")
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      setIsLoading(false)
      return
    }

    const supabase = createClient()

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          is_admin: true,
        },
        emailRedirectTo: `${window.location.origin}/admin`,
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setIsLoading(false)
      return
    }

    setSuccess(true)
    setIsLoading(false)
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="font-serif text-3xl font-bold">
              Eyeglam
            </Link>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm text-center">
            <h1 className="text-xl font-semibold">Check Your Email</h1>
            <p className="mt-4 text-muted-foreground">
              We&apos;ve sent you a confirmation link. Please check your email and
              click the link to activate your admin account.
            </p>
            <Button
              className="mt-6"
              onClick={() => router.push("/admin/login")}
            >
              Back to Login
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="font-serif text-3xl font-bold">
            Eyeglam
          </Link>
          <p className="mt-2 text-muted-foreground">Create Admin Account</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h1 className="text-xl font-semibold">Register</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create your admin account to manage the store
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="registrationKey">Registration Key</Label>
              <Input
                id="registrationKey"
                name="registrationKey"
                type="password"
                placeholder="Enter the admin registration key"
                required
                autoComplete="off"
              />
              <p className="text-xs text-muted-foreground">
                Contact your system administrator for this key.
              </p>
            </div>

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

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="new-password"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                autoComplete="new-password"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading && <Spinner className="mr-2" />}
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/admin/login"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Back to store
          </Link>
        </div>
      </div>
    </div>
  )
}

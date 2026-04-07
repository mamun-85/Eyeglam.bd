import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Order Confirmed | Eyeglam",
  description: "Thank you for your order at Eyeglam",
}

export default function CheckoutSuccessPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6 lg:px-8">
      <div className="flex justify-center">
        <CheckCircle className="h-16 w-16 text-accent" />
      </div>
      <h1 className="mt-6 font-serif text-3xl font-bold tracking-tight text-foreground">
        Order Confirmed!
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Thank you for your order. We&apos;ll send you an email confirmation with
        tracking details once your order ships.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button asChild>
          <Link href="/products">Continue Shopping</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  )
}

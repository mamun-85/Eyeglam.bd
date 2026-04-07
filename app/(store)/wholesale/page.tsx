import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Wholesale | Eyeglam",
  description: "Bulk eyewear purchasing for shops and resellers.",
}

const tiers = [
  {
    minQty: "20+ pieces",
    discount: "5% off",
    note: "Best for trial orders from small shops.",
  },
  {
    minQty: "50+ pieces",
    discount: "10% off",
    note: "Popular tier for regular monthly stock refills.",
  },
  {
    minQty: "100+ pieces",
    discount: "15% off",
    note: "For high-volume partners and multi-branch stores.",
  },
]

export default function WholesalePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Wholesale Program
      </h1>
      <p className="mt-3 max-w-3xl text-muted-foreground">
        We supply eyewear in bulk for retailers and other shops. If you need large
        quantities, join our wholesale program for better pricing and dedicated support.
      </p>

      <div className="mt-8 rounded-xl border border-border bg-card p-6">
        <h2 className="text-xl font-semibold">Bulk Order Conditions</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          <li>Minimum wholesale order quantity: 20 pieces.</li>
          <li>Products can be mixed across available models and colors.</li>
          <li>Lead time depends on quantity and stock availability.</li>
          <li>Delivery charge applies based on your shipping location.</li>
        </ul>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {tiers.map((tier) => (
          <div key={tier.minQty} className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">Minimum Order</p>
            <p className="mt-1 text-lg font-semibold">{tier.minQty}</p>
            <p className="mt-4 text-sm text-muted-foreground">Discount</p>
            <p className="mt-1 text-lg font-semibold text-accent">{tier.discount}</p>
            <p className="mt-3 text-sm text-muted-foreground">{tier.note}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-border bg-card p-6">
        <h2 className="text-xl font-semibold">How to Place a Wholesale Order</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
          <li>Share your required product list and quantities with us.</li>
          <li>We confirm stock, discount slab, and delivery timeline.</li>
          <li>Once approved, we process and ship your order.</li>
        </ol>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/checkout">Start Standard Checkout</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

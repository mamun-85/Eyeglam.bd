import Link from "next/link"
import { ShieldCheck, Sparkles, Truck, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

const points = [
  {
    icon: ShieldCheck,
    title: "Premium Lens Quality",
    description: "UV-protected lenses and durable frame finishes built for daily wear.",
  },
  {
    icon: Sparkles,
    title: "Style Curated for BD",
    description: "Trending silhouettes picked for local tastes, weather, and comfort.",
  },
  {
    icon: Truck,
    title: "Fast Nationwide Delivery",
    description: "Reliable shipping with clear delivery options inside and outside Dhaka.",
  },
  {
    icon: MessageCircle,
    title: "Order on WhatsApp",
    description: "Quick assistance and order confirmation through direct chat support.",
  },
]

export function MarketingShowcase() {
  return (
    <section className="py-16 sm:py-20 border-y border-border/60 bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
            Why Customers Choose EyeGlam
          </h2>
          <p className="mt-3 text-muted-foreground">
            Built for fast browsing, confident style decisions, and easy chat-based ordering.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {points.map((point) => (
            <article key={point.title} className="rounded-xl border border-border bg-background p-5">
              <point.icon className="h-5 w-5 text-accent" />
              <h3 className="mt-3 font-semibold">{point.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{point.description}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
          <Button asChild className="w-full sm:w-auto">
            <Link href="/products">Shop Collection</Link>
          </Button>
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href="/custom-frames">Build Custom Frame</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

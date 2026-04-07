import { Truck, Shield, RefreshCw, Headphones } from "lucide-react"

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders over $100",
  },
  {
    icon: Shield,
    title: "UV400 Protection",
    description: "100% UV protection",
  },
  {
    icon: RefreshCw,
    title: "30-Day Returns",
    description: "Hassle-free returns",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Always here to help",
  },
]

export function Features() {
  return (
    <section className="border-y border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title} className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                <feature.icon className="h-6 w-6 text-accent" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

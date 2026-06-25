import { Truck, Shield, RefreshCw, Headphones } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { DEFAULT_SHIPPING_INFO } from "@/lib/site-settings"

interface FeaturesProps {
  freeShippingThreshold?: number
}

export function Features({
  freeShippingThreshold = DEFAULT_SHIPPING_INFO.free_shipping_threshold,
}: FeaturesProps) {
  const features = [
    {
      icon: Truck,
      title: "Free Shipping",
      description: `On orders over ${formatPrice(freeShippingThreshold)}`,
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

  return (
    <section className="border-y border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex items-start gap-4 sm:flex-col sm:items-center sm:text-center"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/10 sm:h-12 sm:w-12">
                <feature.icon className="h-5 w-5 text-accent sm:h-6 sm:w-6" />
              </div>
              <div className="min-w-0 flex-1 sm:flex-none">
                <h3 className="text-sm font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

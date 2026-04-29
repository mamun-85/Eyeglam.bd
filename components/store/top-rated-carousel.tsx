import Link from "next/link"
import { ProductCard } from "@/components/store/product-card"
import type { Product } from "@/lib/types"

interface TopRatedCarouselProps {
  products: Product[]
}

export function TopRatedCarousel({ products }: TopRatedCarouselProps) {
  if (products.length === 0) return null

  return (
    <section className="py-12 sm:py-16 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
          Top Rated Picks
        </h2>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground">
          Loved by customers, refreshed dynamically from your catalog.
        </p>

        <div className="mt-6 flex gap-4 overflow-x-auto pb-2">
          {products.map((product) => (
            <div key={product.id} className="min-w-[220px] max-w-[220px] sm:min-w-[260px] sm:max-w-[260px]">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Link href="/products" className="text-sm font-medium text-accent hover:underline">
            View all products
          </Link>
        </div>
      </div>
    </section>
  )
}

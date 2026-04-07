import Image from "next/image"
import Link from "next/link"
import type { Category } from "@/lib/types"

interface CategoryGridProps {
  categories: Category[]
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  if (categories.length === 0) return null

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Shop by Style
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Find the perfect frames for your unique look
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="group relative aspect-square overflow-hidden rounded-lg bg-muted"
            >
              {category.image_url && (
                <Image
                  src={category.image_url}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
              <div className="absolute inset-0 flex items-end p-4">
                <h3 className="text-sm font-medium text-background sm:text-base">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

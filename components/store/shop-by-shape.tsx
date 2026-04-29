import Link from "next/link"

const SHAPES = [
  { slug: "round", label: "Round" },
  { slug: "aviator", label: "Aviator" },
  { slug: "wayfarer", label: "Wayfarer" },
  { slug: "cat-eye", label: "Cat-Eye" },
  { slug: "rectangle", label: "Rectangle" },
]

export function ShopByShape() {
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
              Shop by Shape
            </h2>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">
              Tap a frame profile to explore matching styles.
            </p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {SHAPES.map((shape) => (
            <Link
              key={shape.slug}
              href={`/products?shape=${shape.slug}`}
              className="rounded-xl border border-border bg-card px-4 py-6 text-center transition-colors hover:bg-muted"
            >
              <div className="text-lg font-semibold">{shape.label}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

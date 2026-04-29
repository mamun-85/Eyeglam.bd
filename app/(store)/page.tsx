import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { HeroCarousel } from "@/components/store/hero-carousel"
import { BentoGrid } from "@/components/store/bento-grid"
import { CategoryGrid } from "@/components/store/category-grid"
import { Testimonials } from "@/components/store/testimonials"
import { Features } from "@/components/store/features"
import { BentoSkeleton } from "@/components/store/product-skeleton"
import { MarketingShowcase } from "@/components/store/marketing-showcase"
import { ShopByShape } from "@/components/store/shop-by-shape"
import { TopRatedCarousel } from "@/components/store/top-rated-carousel"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const supabase = await createClient()

  const [
    { data: heroSlides },
    { data: categories },
    { data: featuredProducts },
    { data: testimonials },
    { data: topRatedProducts },
  ] = await Promise.all([
    supabase
      .from("hero_slides")
      .select("*")
      .eq("is_active", true)
      .order("sort_order"),
    supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order"),
    supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(7),
    supabase
      .from("testimonials")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(4),
    supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(10),
  ])

  // Pick hero product: first with video_url, or first featured
  const heroProduct = featuredProducts?.find((p) => p.video_url) || featuredProducts?.[0] || null

  return (
    <>
      <HeroCarousel slides={heroSlides || []} />

      {/* Bento New Arrivals */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              New Arrivals
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Fresh frames just landed. Discover the latest drops first.
            </p>
          </div>
          <Suspense fallback={<BentoSkeleton />}>
            <BentoGrid
              products={featuredProducts || []}
              heroProduct={heroProduct}
            />
          </Suspense>
        </div>
      </section>

      <Features />
      <MarketingShowcase />
      <ShopByShape />
      <TopRatedCarousel products={topRatedProducts || []} />
      <CategoryGrid categories={categories || []} />
      <Testimonials testimonials={testimonials || []} />
    </>
  )
}

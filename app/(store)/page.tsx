import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { HeroCarousel } from "@/components/store/hero-carousel"
import { BentoGrid } from "@/components/store/bento-grid"
import { CategoryGrid } from "@/components/store/category-grid"
import { Testimonials } from "@/components/store/testimonials"
import { Features } from "@/components/store/features"
import { BentoSkeleton } from "@/components/store/product-skeleton"
import { MarketingGallery } from "@/components/store/marketing-gallery"
import { TopRatedCarousel } from "@/components/store/top-rated-carousel"
import { BrandPromise } from "@/components/store/brand-promise"
import { StyleGuideCTA } from "@/components/store/style-guide-cta"
import { NewsletterSection } from "@/components/store/newsletter-section"
import {
  resolveMarketingContent,
  resolveShippingInfo,
  resolveMarketingGallery,
  type GalleryItem,
} from "@/lib/site-settings"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const supabase = await createClient()

  const [
    { data: heroSlides },
    { data: categories },
    { data: featuredProducts },
    { data: testimonials },
    { data: topRatedProducts },
    { data: siteSettings },
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
    supabase
      .from("site_settings")
      .select("key, value")
      .in("key", ["marketing_content", "shipping_info", "marketing_gallery"]),
  ])

  const settingsMap = (siteSettings || []).reduce((acc, row) => {
    acc[row.key] = row.value
    return acc
  }, {} as Record<string, unknown>)
  const marketing = resolveMarketingContent(settingsMap.marketing_content)
  const shipping = resolveShippingInfo(settingsMap.shipping_info)
  const gallery = resolveMarketingGallery(settingsMap.marketing_gallery)

  // Pick hero product: first with video_url, or first featured
  const heroProduct = featuredProducts?.find((p) => p.video_url) || featuredProducts?.[0] || null

  // Fallback gallery from real products (used until admin uploads lookbook images)
  const galleryFallback: GalleryItem[] = (topRatedProducts || [])
    .map((p) => ({
      image: p.thumbnail_url || p.images?.[0] || "",
      link: `/products/${p.slug}`,
      caption: p.name,
    }))
    .filter((item) => item.image)
    .slice(0, 6)

  return (
    <>
      <HeroCarousel slides={heroSlides || []} />

      {/* Brand Promise — animated stats & brand story */}
      {marketing.brand_promise.enabled && <BrandPromise content={marketing.brand_promise} />}

      {/* Bento New Arrivals */}
      <section className="py-12 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-7 sm:mb-12">
            <h2 className="font-serif text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
              New Arrivals
            </h2>
            <p className="mt-2 text-sm sm:mt-4 sm:text-lg text-muted-foreground">
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

      <Features freeShippingThreshold={shipping.free_shipping_threshold} />

      {/* Style Guide — face shape recommendations */}
      {marketing.style_guide.enabled && <StyleGuideCTA content={marketing.style_guide} />}

      {/* Lookbook — image-based product/customer showcase */}
      {gallery.enabled && (
        <MarketingGallery content={gallery} fallbackItems={galleryFallback} />
      )}

      <TopRatedCarousel products={topRatedProducts || []} />
      <CategoryGrid categories={categories || []} />

      {/* Newsletter — engagement CTA */}
      {marketing.newsletter.enabled && <NewsletterSection content={marketing.newsletter} />}

      <Testimonials testimonials={testimonials || []} />
    </>
  )
}


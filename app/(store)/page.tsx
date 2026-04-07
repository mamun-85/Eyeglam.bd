import { createClient } from "@/lib/supabase/server"
import { HeroCarousel } from "@/components/store/hero-carousel"
import { CategoryGrid } from "@/components/store/category-grid"
import { FeaturedProducts } from "@/components/store/featured-products"
import { Testimonials } from "@/components/store/testimonials"
import { Features } from "@/components/store/features"

export default async function HomePage() {
  const supabase = await createClient()

  const [
    { data: heroSlides },
    { data: categories },
    { data: featuredProducts },
    { data: testimonials },
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
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(8),
    supabase
      .from("testimonials")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(4),
  ])

  return (
    <>
      <HeroCarousel slides={heroSlides || []} />
      <Features />
      <CategoryGrid categories={categories || []} />
      <FeaturedProducts products={featuredProducts || []} />
      <Testimonials testimonials={testimonials || []} />
    </>
  )
}

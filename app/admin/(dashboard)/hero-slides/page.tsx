import { createClient } from "@/lib/supabase/server"
import { HeroSlidesManager } from "@/components/admin/hero-slides-manager"

export default async function AdminHeroSlidesPage() {
  const supabase = await createClient()

  const { data: slides } = await supabase
    .from("hero_slides")
    .select("*")
    .order("sort_order")

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold tracking-tight">Hero Slides</h1>
      <p className="mt-2 text-muted-foreground">
        Manage homepage carousel slides
      </p>
      <div className="mt-8">
        <HeroSlidesManager initialSlides={slides || []} />
      </div>
    </div>
  )
}

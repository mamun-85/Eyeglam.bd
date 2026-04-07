import { createClient } from "@/lib/supabase/server"
import { TestimonialsManager } from "@/components/admin/testimonials-manager"

export default async function AdminTestimonialsPage() {
  const supabase = await createClient()

  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold tracking-tight">Testimonials</h1>
      <p className="mt-2 text-muted-foreground">
        Manage customer testimonials
      </p>
      <div className="mt-8">
        <TestimonialsManager initialTestimonials={testimonials || []} />
      </div>
    </div>
  )
}

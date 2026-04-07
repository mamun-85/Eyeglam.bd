import Image from "next/image"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Testimonial } from "@/lib/types"

interface TestimonialsProps {
  testimonials: Testimonial[]
}

export function Testimonials({ testimonials }: TestimonialsProps) {
  if (testimonials.length === 0) return null

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            What Our Customers Say
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join thousands of satisfied customers worldwide
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="flex flex-col rounded-xl bg-card p-6 shadow-sm border border-border"
            >
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      i < testimonial.rating
                        ? "fill-accent text-accent"
                        : "fill-muted text-muted"
                    )}
                  />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-sm text-muted-foreground">
                &ldquo;{testimonial.content}&rdquo;
              </blockquote>
              <div className="mt-6 flex items-center gap-3">
                {testimonial.avatar_url && (
                  <div className="relative h-10 w-10 overflow-hidden rounded-full bg-muted">
                    <Image
                      src={testimonial.avatar_url}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {testimonial.name}
                  </p>
                  {testimonial.role && (
                    <p className="text-xs text-muted-foreground">
                      {testimonial.role}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

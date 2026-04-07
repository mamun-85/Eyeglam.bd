"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { HeroSlide } from "@/lib/types"

interface HeroCarouselProps {
  slides: HeroSlide[]
}

export function HeroCarousel({ slides }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length)
  }, [slides.length])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)
  }, [slides.length])

  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [nextSlide, isPaused])

  if (slides.length === 0) return null

  return (
    <section
      className="relative h-[60vh] min-h-[400px] max-h-[700px] overflow-hidden bg-muted"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-700",
            index === currentIndex ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        >
          <Image
            src={slide.image_url}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/60 via-foreground/30 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-xl">
                <h1 className="font-serif text-4xl font-bold tracking-tight text-background sm:text-5xl lg:text-6xl text-balance">
                  {slide.title}
                </h1>
                {slide.subtitle && (
                  <p className="mt-4 text-lg text-background/90 sm:text-xl">
                    {slide.subtitle}
                  </p>
                )}
                {slide.button_text && slide.button_link && (
                  <div className="mt-8">
                    <Button asChild size="lg" className="bg-background text-foreground hover:bg-background/90">
                      <Link href={slide.button_link}>{slide.button_text}</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation arrows */}
      {slides.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/20 hover:bg-background/40 text-background"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-6 w-6" />
            <span className="sr-only">Previous slide</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/20 hover:bg-background/40 text-background"
            onClick={nextSlide}
          >
            <ChevronRight className="h-6 w-6" />
            <span className="sr-only">Next slide</span>
          </Button>

          {/* Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "h-2 w-2 rounded-full transition-all",
                  index === currentIndex
                    ? "bg-background w-6"
                    : "bg-background/50 hover:bg-background/70"
                )}
                onClick={() => setCurrentIndex(index)}
              >
                <span className="sr-only">Go to slide {index + 1}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  )
}

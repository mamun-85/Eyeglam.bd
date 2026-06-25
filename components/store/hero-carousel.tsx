"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { HeroSlide } from "@/lib/types"

interface HeroCarouselProps {
  slides: HeroSlide[]
}

const textRevealVariants = {
  hidden: { opacity: 0, y: 30, filter: "blur(4px)" },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      delay,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
}

export function HeroCarousel({ slides }: HeroCarouselProps) {
  const [[currentIndex, direction], setSlide] = useState([0, 0])
  const [isPaused, setIsPaused] = useState(false)

  const paginate = useCallback(
    (newDirection: number) => {
      setSlide(([prev]) => [
        (prev + newDirection + slides.length) % slides.length,
        newDirection,
      ])
    },
    [slides.length]
  )

  const nextSlide = useCallback(() => paginate(1), [paginate])
  const prevSlide = useCallback(() => paginate(-1), [paginate])

  useEffect(() => {
    if (isPaused || slides.length <= 1) return
    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [nextSlide, isPaused, slides.length])

  if (slides.length === 0) return null

  const slide = slides[currentIndex]
  const videoUrl = (slide as any).video_url
  // Support for portrait/landscape art direction
  const mobileImageUrl = (slide as any).mobile_image_url || slide.image_url

  return (
    <section
      className="relative h-[85vh] sm:h-[60vh] min-h-[500px] sm:min-h-[400px] max-h-[900px] sm:max-h-[700px] overflow-hidden bg-muted"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={{
            enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
            center: {
              x: 0,
              opacity: 1,
              transition: {
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.4 },
              },
            },
            exit: (d: number) => ({
              x: d < 0 ? "100%" : "-100%",
              opacity: 0,
              transition: {
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.3 },
              },
            }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0"
        >
          {/* Video or Art-directed <picture> background */}
          {videoUrl ? (
            <div className="hero-video-container">
              <video
                src={videoUrl}
                autoPlay
                loop
                muted
                playsInline
                poster={slide.image_url}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-3 py-1.5 z-10">
                <Play className="h-3 w-3 text-white fill-white" />
                <span className="text-xs text-white font-medium">Video</span>
              </div>
            </div>
          ) : (
            /* Art Direction: Portrait 9:16 for mobile, Landscape 16:9 for desktop */
            <picture className="absolute inset-0">
              {/* Mobile: portrait crop */}
              <source
                media="(max-width: 639px)"
                srcSet={mobileImageUrl}
                type="image/webp"
              />
              {/* Desktop: landscape crop */}
              <source
                media="(min-width: 640px)"
                srcSet={slide.image_url}
                type="image/webp"
              />
              <img
                src={slide.image_url}
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-cover"
                fetchPriority={currentIndex === 0 ? "high" : "auto"}
                decoding="async"
              />
            </picture>
          )}

          {/* Gradient overlay — mobile: bottom-heavy to keep eyewear visible at top */}
          <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/70 via-black/40 sm:via-foreground/30 to-transparent" />

          {/* Text content: positioned in lower third on mobile */}
          <div
            className={cn(
              "absolute inset-0 flex items-end sm:items-center sm:pb-0",
              slides.length > 1 ? "pb-28" : "pb-16"
            )}
          >
            <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8">
              <div className="max-w-xl text-left">
                <motion.h1
                  custom={0.1}
                  variants={textRevealVariants}
                  initial="hidden"
                  animate="visible"
                  className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl text-balance"
                >
                  {slide.title}
                </motion.h1>
                {slide.subtitle && (
                  <motion.p
                    custom={0.25}
                    variants={textRevealVariants}
                    initial="hidden"
                    animate="visible"
                    className="mt-3 sm:mt-4 text-base sm:text-lg text-white/90 sm:text-xl"
                  >
                    {slide.subtitle}
                  </motion.p>
                )}
                {slide.button_text && slide.button_link && (
                  <motion.div
                    custom={0.4}
                    variants={textRevealVariants}
                    initial="hidden"
                    animate="visible"
                    className="mt-6 sm:mt-8"
                  >
                    <Button asChild size="lg" className="bg-white text-black hover:bg-white/90">
                      <Link href={slide.button_link}>{slide.button_text}</Link>
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation arrows */}
      {slides.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white z-20"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-6 w-6" />
            <span className="sr-only">Previous slide</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white z-20"
            onClick={nextSlide}
          >
            <ChevronRight className="h-6 w-6" />
            <span className="sr-only">Next slide</span>
          </Button>

          {/* Dots */}
          <div className="absolute bottom-6 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {slides.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  index === currentIndex
                    ? "bg-white w-6"
                    : "bg-white/50 hover:bg-white/70 w-2"
                )}
                onClick={() => setSlide([index, index > currentIndex ? 1 : -1])}
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

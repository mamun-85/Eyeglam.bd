"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { DEFAULT_MARKETING_GALLERY, type GalleryItem, type MarketingGallerySettings } from "@/lib/site-settings"

interface MarketingGalleryProps {
  content?: MarketingGallerySettings
  /** Used when the admin hasn't configured any gallery images yet. */
  fallbackItems?: GalleryItem[]
}

// Editorial size pattern — first tile is large, rest fill around it.
const SPANS = [
  "col-span-2 row-span-2",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-2 row-span-1 sm:col-span-1",
]

export function MarketingGallery({
  content = DEFAULT_MARKETING_GALLERY,
  fallbackItems = [],
}: MarketingGalleryProps) {
  const items = (content.items.length > 0 ? content.items : fallbackItems).slice(0, 6)

  if (items.length === 0) return null

  return (
    <section className="py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          {content.eyebrow && (
            <span className="inline-block rounded-full border border-border bg-muted px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {content.eyebrow}
            </span>
          )}
          <h2 className="mt-4 font-serif text-2xl font-bold tracking-tight sm:text-4xl">
            {content.heading}
          </h2>
          {content.subheading && (
            <p className="mt-3 text-muted-foreground">{content.subheading}</p>
          )}
        </div>

        <div className="mt-8 grid auto-rows-[140px] grid-cols-2 gap-3 sm:auto-rows-[180px] sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.3) }}
              className={`group relative overflow-hidden rounded-2xl bg-muted ${SPANS[i % SPANS.length]}`}
            >
              <Image
                src={item.image}
                alt={item.caption || "EyeGlam look"}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              {item.caption && (
                <div className="absolute inset-x-0 bottom-0 z-10 translate-y-2 p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <span className="text-sm font-medium text-white drop-shadow">{item.caption}</span>
                </div>
              )}
              {item.link && (
                <Link
                  href={item.link}
                  className="absolute inset-0 z-20"
                  aria-label={item.caption || "Shop this look"}
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

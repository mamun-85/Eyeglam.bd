"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Play, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useQuickView } from "@/components/store/quick-view-context"
import { formatPrice, cn } from "@/lib/utils"
import { fadeInUp, staggerContainer } from "@/lib/motion-variants"
import { BentoSkeleton } from "@/components/store/product-skeleton"
import type { Product } from "@/lib/types"

interface BentoGridProps {
  products: Product[]
  heroProduct?: Product | null
}

function HeroTile({ product }: { product: Product }) {
  const { openQuickView } = useQuickView()
  const hasVideo = !!product.video_url
  const heroImage = product.thumbnail_url || product.images[0] || "/placeholder.svg"

  return (
    <motion.div
      variants={fadeInUp}
      className="relative col-span-2 row-span-2 aspect-[4/5] sm:aspect-auto sm:min-h-[420px] overflow-hidden rounded-2xl bg-muted group cursor-pointer"
    >
      <Link href={`/products/${product.slug}`} className="block absolute inset-0">
        {/* Video Background */}
        {hasVideo ? (
          <div className="hero-video-container">
            <video
              src={product.video_url!}
              autoPlay
              loop
              muted
              playsInline
              poster={heroImage}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <Image
            src={heroImage}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-8">
          {hasVideo && (
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-2.5 py-1 sm:px-3 sm:py-1.5">
              <Play className="h-3 w-3 text-white fill-white" />
              <span className="text-xs text-white font-medium">Video</span>
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <span className="inline-block rounded-full bg-white/15 backdrop-blur-sm px-3 py-1 text-xs font-medium text-white mb-3">
              Featured
            </span>
            <h2 className="font-serif text-lg sm:text-3xl lg:text-4xl font-bold text-white tracking-tight line-clamp-2">
              {product.name}
            </h2>
            {product.description && (
              <p className="mt-2 hidden sm:block text-sm text-white/80 line-clamp-2 max-w-md">
                {product.description}
              </p>
            )}
            <div className="mt-4 flex items-center gap-4">
              <span className="text-xl font-bold text-white">
                {product.sale_price
                  ? formatPrice(product.sale_price)
                  : formatPrice(product.price)}
              </span>
              {product.sale_price && product.sale_price < product.price && (
                <span className="text-sm text-white/60 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
          </motion.div>

          <div className="mt-4 hidden sm:flex gap-3">
            <Button
              size="lg"
              className="bg-white text-black hover:bg-white/90"
            >
              Shop Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
              onClick={(e) => {
                e.preventDefault()
                openQuickView(product)
              }}
            >
              <Eye className="mr-2 h-4 w-4" />
              Quick View
            </Button>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

function BentoCard({ product }: { product: Product }) {
  const { openQuickView } = useQuickView()
  const [isHovered, setIsHovered] = useState(false)
  const mainImage = product.thumbnail_url || product.images[0] || "/placeholder.svg"
  const secondaryImage = product.gallery_urls?.[0] || product.images[1]
  const isOnSale = product.sale_price !== null && product.sale_price < product.price

  return (
    <motion.div variants={fadeInUp} className="group flex flex-col">
      {/* Image */}
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-square overflow-hidden rounded-xl bg-muted"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Primary Image */}
        <Image
          src={mainImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={cn(
            "object-cover transition-all duration-500 group-hover:scale-105",
            isHovered && secondaryImage ? "opacity-0" : "opacity-100"
          )}
          loading="lazy"
        />

        {/* Secondary Image (revealed on hover) */}
        {secondaryImage && (
          <Image
            src={secondaryImage}
            alt={`${product.name} lifestyle`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={cn(
              "object-cover transition-all duration-500 absolute inset-0 group-hover:scale-105",
              isHovered ? "opacity-100" : "opacity-0"
            )}
            loading="lazy"
          />
        )}

        {/* Sale badge */}
        {isOnSale && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-destructive px-2.5 py-1 text-[11px] font-semibold text-destructive-foreground z-10">
            Sale
          </span>
        )}

        {/* Quick View button — desktop hover only */}
        <div className="absolute inset-x-0 bottom-0 hidden p-2.5 opacity-0 translate-y-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0 z-10 sm:block">
          <Button
            size="sm"
            variant="secondary"
            className="w-full backdrop-blur-sm bg-background/85"
            onClick={(e) => {
              e.preventDefault()
              openQuickView(product)
            }}
          >
            <Eye className="mr-2 h-4 w-4" />
            Quick View
          </Button>
        </div>
      </Link>

      {/* Caption below image — clean, no overlap */}
      <div className="mt-2.5 px-0.5">
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-sm font-medium text-foreground line-clamp-1 transition-colors group-hover:text-accent">
            {product.name}
          </h3>
        </Link>
        <div className="mt-1 flex items-center gap-2">
          {isOnSale ? (
            <>
              <span className="text-sm font-bold text-accent">
                {formatPrice(product.sale_price!)}
              </span>
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.price)}
              </span>
            </>
          ) : (
            <span className="text-sm font-bold text-foreground">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export function BentoGrid({ products, heroProduct }: BentoGridProps) {
  if (products.length === 0) return <BentoSkeleton />

  const hero = heroProduct || products[0]
  const gridProducts = heroProduct
    ? products.filter((p) => p.id !== heroProduct.id).slice(0, 5)
    : products.slice(1, 6)

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-4 sm:gap-y-8 sm:grid-cols-3 lg:grid-cols-4"
    >
      <HeroTile product={hero} />
      {gridProducts.map((product) => (
        <BentoCard key={product.id} product={product} />
      ))}
    </motion.div>
  )
}

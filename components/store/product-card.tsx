"use client"

import { useState, useRef, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Eye, ShoppingBag, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import { useQuickView } from "@/components/store/quick-view-context"
import { useWishlist } from "@/components/store/wishlist-context"
import { formatPrice, cn } from "@/lib/utils"
import { fadeInUp } from "@/lib/motion-variants"
import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const { openQuickView } = useQuickView()
  const { toggleItem, isInWishlist } = useWishlist()
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  // Swipe state
  const allImages = [
    product.thumbnail_url || product.images[0],
    ...(product.gallery_urls?.length ? product.gallery_urls : product.images.slice(1)),
  ].filter(Boolean) as string[]
  const [swipeIndex, setSwipeIndex] = useState(0)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  // Double-tap state
  const lastTap = useRef(0)
  const [showHeart, setShowHeart] = useState(false)
  const heartTimeout = useRef<NodeJS.Timeout | null>(null)

  const mainImage = allImages[swipeIndex] || product.images[0] || "/placeholder.svg"
  const secondaryImage = allImages[1]
  const isOnSale = product.sale_price !== null && product.sale_price < product.price
  const wishlisted = isInWishlist(product.id)
  const mainImageSrc = mainImage.includes("supabase.co")
    ? `${mainImage}?format=webp&quality=75`
    : mainImage
  const secondaryImageSrc = secondaryImage?.includes("supabase.co")
    ? `${secondaryImage}?format=webp&quality=75`
    : secondaryImage

  // Color variant support
  const activeVariant = product.variants?.[0]

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      sale_price: product.sale_price,
      image: mainImage,
      selected_color: activeVariant?.color_name,
      selected_color_image: activeVariant?.image_url,
    })
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    openQuickView(product)
  }

  // Touch swipe handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }, [])

  const handleTouchEnd = useCallback(() => {
    const diff = touchStartX.current - touchEndX.current
    const threshold = 50

    if (Math.abs(diff) > threshold && allImages.length > 1) {
      if (diff > 0) {
        // Swipe left → next image
        setSwipeIndex((prev) => (prev + 1) % allImages.length)
      } else {
        // Swipe right → previous image
        setSwipeIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
      }
    }
  }, [allImages.length])

  // Double-tap wishlist handler
  const handleDoubleTap = useCallback(
    (e: React.TouchEvent) => {
      const now = Date.now()
      const DOUBLE_TAP_DELAY = 300

      if (now - lastTap.current < DOUBLE_TAP_DELAY) {
        // Double tap detected
        e.preventDefault()
        const added = toggleItem({
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          sale_price: product.sale_price,
          image: mainImage,
        })

        if (added) {
          // Show heart animation
          setShowHeart(true)
          if (heartTimeout.current) clearTimeout(heartTimeout.current)
          heartTimeout.current = setTimeout(() => setShowHeart(false), 1000)
        }
      }
      lastTap.current = now
    },
    [product, mainImage, toggleItem]
  )

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={`/products/${product.slug}`}
        className="group relative flex flex-col"
      >
        <div
          className="relative aspect-square overflow-hidden rounded-lg bg-muted"
          onTouchStart={(e) => {
            handleTouchStart(e)
            handleDoubleTap(e)
          }}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Skeleton placeholder */}
          {!imageLoaded && (
            <div className="absolute inset-0 skeleton-shimmer" />
          )}

          {/* Progressive image with blur-up on mobile */}
          {mainImage.includes("supabase.co") && !imageLoaded && (
            <img
              src={`${mainImage}?width=10&quality=10&format=webp`}
              alt=""
              aria-hidden="true"
              className="progressive-img-placeholder object-cover w-full h-full"
            />
          )}

          {/* Primary Image */}
          <Image
            src={mainImageSrc}
            alt={product.name}
            fill
            className={cn(
              "object-cover transition-opacity duration-500",
              isHovered && secondaryImage && allImages.length > 1
                ? "opacity-0"
                : "opacity-100",
              imageLoaded ? "visible" : "invisible"
            )}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
          />

          {/* Secondary Image (hover reveal on desktop) */}
          {secondaryImage && (
            <Image
              src={secondaryImageSrc!}
              alt={`${product.name} alternate view`}
              fill
              className={cn(
                "object-cover transition-opacity duration-500 absolute inset-0 hidden sm:block",
                isHovered ? "opacity-100" : "opacity-0"
              )}
              loading="lazy"
            />
          )}

          {/* Heart pop animation (double-tap) */}
          {showHeart && (
            <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.3, 0.95, 1.1, 1], opacity: [0, 1, 1, 1, 0] }}
                transition={{ duration: 0.9, ease: "easeOut" }}
              >
                <Heart className="h-16 w-16 text-red-500 fill-red-500" />
              </motion.div>
            </div>
          )}

          {/* Sale badge */}
          {isOnSale && (
            <span className="absolute left-3 top-3 rounded-full bg-destructive px-2.5 py-1 text-xs font-medium text-destructive-foreground z-10">
              Sale
            </span>
          )}

          {/* Wishlist indicator */}
          {wishlisted && (
            <span className="absolute right-3 top-3 z-10">
              <Heart className="h-4 w-4 text-red-500 fill-red-500" />
            </span>
          )}

          {/* Frame shape badge */}
          {product.frame_shape && !wishlisted && (
            <span className="absolute right-3 top-3 rounded-full bg-background/80 backdrop-blur-sm px-2.5 py-1 text-xs font-medium text-foreground capitalize z-10">
              {product.frame_shape}
            </span>
          )}

          {/* Swipe dots (mobile only) */}
          {allImages.length > 1 && (
            <div className="absolute bottom-12 sm:hidden inset-x-0 swipe-dots z-10">
              {allImages.map((_, i) => (
                <span
                  key={i}
                  className={cn("swipe-dot", i === swipeIndex && "active")}
                />
              ))}
            </div>
          )}

          {/* Hover actions (desktop) */}
          <div className="absolute inset-x-0 bottom-0 flex gap-2 justify-center p-3 opacity-0 translate-y-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0 z-10">
            <Button
              size="sm"
              onClick={handleAddToCart}
              className="flex-1 max-w-[140px]"
            >
              <ShoppingBag className="mr-1.5 h-3.5 w-3.5" />
              Add
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={handleQuickView}
              className="backdrop-blur-sm bg-background/80"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Product info */}
        <div className="mt-4 flex flex-col">
          <h3 className="text-sm font-medium text-foreground group-hover:text-accent transition-colors truncate">
            {product.name}
          </h3>
          <div className="mt-1 flex items-center gap-2">
            {isOnSale ? (
              <>
                <span className="text-sm font-semibold text-accent">
                  {formatPrice(product.sale_price!)}
                </span>
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="text-sm font-semibold text-foreground">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { X, Eye, ShoppingBag, ExternalLink, Heart, MessageCircle, Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { useQuickView } from "@/components/store/quick-view-context"
import { useCart } from "@/components/cart-provider"
import { useWishlist } from "@/components/store/wishlist-context"
import { VirtualTryOnModal } from "@/components/store/virtual-tryon-modal"
import { formatPrice, cn } from "@/lib/utils"
import type { ColorVariant } from "@/lib/types"

const WHATSAPP_NUMBER = "8801317910996"

export function QuickViewPanel() {
  const { isOpen, product, closeQuickView } = useQuickView()
  const { addItem } = useCart()
  const { toggleItem, isInWishlist } = useWishlist()
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState<ColorVariant | null>(null)
  const [vtoOpen, setVtoOpen] = useState(false)

  // Reset state when product changes
  useEffect(() => {
    if (product) {
      setSelectedImage(0)
      setSelectedVariant(product.variants?.[0] || null)
    }
  }, [product])

  if (!product) return null

  const wishlisted = isInWishlist(product.id)

  const allImages = [
    selectedVariant?.image_url || product.thumbnail_url || product.images[0],
    ...(product.gallery_urls?.length ? product.gallery_urls : product.images.slice(1)),
  ].filter(Boolean) as string[]

  const mainImage = allImages[selectedImage] || product.images[0] || "/placeholder.svg"
  const isOnSale = product.sale_price !== null && product.sale_price < product.price

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      sale_price: product.sale_price,
      image: selectedVariant?.image_url || product.images[0] || "/placeholder.svg",
      selected_color: selectedVariant?.color_name,
      selected_color_image: selectedVariant?.image_url,
    })
  }

  const handleColorSelect = (variant: ColorVariant) => {
    setSelectedVariant(variant)
    setSelectedImage(0)
  }

  const handleWhatsApp = () => {
    const colorInfo = selectedVariant ? ` (Color: ${selectedVariant.color_name})` : ""
    const productUrl = typeof window !== "undefined"
      ? `${window.location.origin}/products/${product.slug}`
      : ""
    const message = `Hi EyeGlam! I'm interested in ${product.name}${colorInfo} - ${productUrl}`
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    )
  }

  const handleWishlist = () => {
    toggleItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      sale_price: product.sale_price,
      image: mainImage,
    })
  }

  return (
    <>
      <Sheet open={isOpen} onOpenChange={(open) => !open && closeQuickView()}>
        <SheetContent
          side="right"
          showCloseButton={false}
          className="w-full sm:max-w-lg p-0 overflow-y-auto border-l border-border bg-background"
        >
          <div className="flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <SheetTitle className="font-serif text-lg font-semibold text-foreground">
                Quick View
              </SheetTitle>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleWishlist}
                  className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <Heart
                    className={cn(
                      "h-5 w-5",
                      wishlisted ? "text-red-500 fill-red-500" : "text-muted-foreground"
                    )}
                  />
                </button>
                <Button variant="ghost" size="icon" onClick={closeQuickView}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Main Image with fade transition */}
            <div className="relative aspect-square bg-muted shrink-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${selectedImage}-${selectedVariant?.color_name}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={mainImage}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>
              {isOnSale && (
                <span className="absolute left-4 top-4 rounded-full bg-destructive px-3 py-1 text-xs font-medium text-destructive-foreground z-10">
                  Sale
                </span>
              )}
            </div>

            {/* Gallery Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-3 px-6 py-4 overflow-x-auto gallery-scroll shrink-0 border-y border-border/60 bg-background">
                {allImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      "relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-muted transition-all",
                      selectedImage === index
                        ? "ring-2 ring-foreground ring-offset-2"
                        : "opacity-60 hover:opacity-100"
                    )}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} view ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Product Info */}
            <div className="px-6 py-4 flex flex-col gap-4">
              <div>
                <h3 className="font-serif text-2xl font-bold text-foreground">
                  {product.name}
                </h3>
                <div className="mt-2 flex items-center gap-2">
                  {isOnSale ? (
                    <>
                      <span className="text-xl font-bold text-accent">
                        {formatPrice(product.sale_price!)}
                      </span>
                      <span className="text-sm text-muted-foreground line-through">
                        {formatPrice(product.price)}
                      </span>
                    </>
                  ) : (
                    <span className="text-xl font-bold text-foreground">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>
              </div>

              {product.description && (
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {product.description}
                </p>
              )}

              {/* Color Swatches — real variants if available */}
              {product.variants && product.variants.length > 0 ? (
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">
                    Color: <span className="font-normal text-muted-foreground">{selectedVariant?.color_name}</span>
                  </h4>
                  <div className="flex gap-2">
                    {product.variants.map((variant) => {
                      const isActive = selectedVariant?.color_name === variant.color_name
                      return (
                        <button
                          key={variant.color_name}
                          onClick={() => handleColorSelect(variant)}
                          className={cn(
                            "relative h-9 w-9 rounded-full transition-all duration-200",
                            isActive
                              ? "ring-2 ring-foreground ring-offset-2 scale-110"
                              : "hover:scale-105 ring-1 ring-border"
                          )}
                          style={{ backgroundColor: variant.color_hex }}
                          title={variant.color_name}
                        >
                          {isActive && (
                            <span className="absolute inset-0 flex items-center justify-center">
                              <Check className={cn(
                                "h-3.5 w-3.5",
                                parseInt(variant.color_hex.replace('#', ''), 16) < 0x808080
                                  ? "text-white"
                                  : "text-black"
                              )} />
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ) : null}

              {/* Frame shape badge */}
              {product.frame_shape && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Frame:</span>
                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground capitalize">
                    {product.frame_shape}
                  </span>
                </div>
              )}

              {/* Actions */}
              <div className="mt-auto flex flex-col gap-2 pt-4 border-t border-border">
                <Button onClick={handleAddToCart} className="w-full" size="lg">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>

                {/* WhatsApp Order */}
                <Button
                  variant="outline"
                  className="w-full border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366]/10"
                  onClick={handleWhatsApp}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Order via WhatsApp
                </Button>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setVtoOpen(true)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Try On
                  </Button>
                  <Button variant="outline" className="flex-1" asChild>
                    <Link href={`/products/${product.slug}`} onClick={closeQuickView}>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Details
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* VTO Modal */}
      <VirtualTryOnModal
        isOpen={vtoOpen}
        onClose={() => setVtoOpen(false)}
        productName={product.name}
        productImage={mainImage}
      />
    </>
  )
}

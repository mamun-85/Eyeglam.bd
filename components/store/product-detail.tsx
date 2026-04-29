"use client"

import { useState, useMemo, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Minus, Plus, Check, ShoppingBag, Heart, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import { useWishlist } from "@/components/store/wishlist-context"
import { formatPrice, cn } from "@/lib/utils"
import type { Product } from "@/lib/types"

const WHATSAPP_NUMBER = "8801317910996"

interface ProductDetailProps {
  product: Product
  whatsappNumber?: string
  whatsappMessageTemplate?: string
  variantOptions?: Array<{
    id: string
    stock: number
    color_name: string
    color_hex: string
    images: string[]
  }>
}

export function ProductDetail({
  product,
  whatsappNumber,
  whatsappMessageTemplate,
  variantOptions = [],
}: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedVariantId, setSelectedVariantId] = useState(variantOptions[0]?.id || "")
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  const { addItem } = useCart()
  const { toggleItem, isInWishlist } = useWishlist()
  const wishlisted = isInWishlist(product.id)

  const selectedVariant = useMemo(() => {
    return variantOptions.find((variant) => variant.id === selectedVariantId) || null
  }, [selectedVariantId, variantOptions])

  const fallbackVariantFromProduct = product.variants?.[0] || null

  // Build image list from selected relational variant first, fallback to legacy fields.
  const allImages = useMemo(() => {
    if (selectedVariant?.images?.length) return selectedVariant.images
    return [
      fallbackVariantFromProduct?.image_url || product.thumbnail_url || product.images[0],
      ...(product.gallery_urls?.length ? product.gallery_urls : product.images.slice(1)),
    ].filter(Boolean) as string[]
  }, [selectedVariant, fallbackVariantFromProduct, product])

  const mainImage = allImages[selectedImage] || product.images[0] || "/placeholder.svg"
  const isOnSale = product.sale_price !== null && product.sale_price < product.price

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      sale_price: product.sale_price,
      image: selectedVariant?.images?.[0] || product.images[0] || "/placeholder.svg",
      quantity,
      selected_color: selectedVariant?.color_name || fallbackVariantFromProduct?.color_name,
      selected_color_image: selectedVariant?.images?.[0] || fallbackVariantFromProduct?.image_url,
    })
    setQuantity(1)
  }

  const handleColorSelect = (variantId: string) => {
    setSelectedVariantId(variantId)
    // Reset to first image (the variant image)
    setSelectedImage(0)
  }

  const handleWhatsAppOrder = () => {
    const productUrl = typeof window !== "undefined"
      ? `${window.location.origin}/products/${product.slug}`
      : ""
    const selectedColorName = selectedVariant?.color_name || fallbackVariantFromProduct?.color_name
    const colorInfo = selectedColorName ? ` (Color: ${selectedColorName})` : ""
    const template =
      whatsappMessageTemplate?.trim() || "Hi EyeGlam! I'm interested in {product} - {link}."
    const message = template
      .replaceAll("{product}", `${product.name}${colorInfo}`)
      .replaceAll("{link}", productUrl)
    const finalNumber = whatsappNumber?.trim() || WHATSAPP_NUMBER
    const url = `https://wa.me/${finalNumber}?text=${encodeURIComponent(message)}`
    window.open(url, "_blank", "noopener,noreferrer")
  }

  const handleWishlistToggle = () => {
    toggleItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      sale_price: product.sale_price,
      image: mainImage,
    })
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current
    const threshold = 45
    if (Math.abs(diff) < threshold || allImages.length <= 1) return
    if (diff > 0) {
      setSelectedImage((prev) => (prev + 1) % allImages.length)
    } else {
      setSelectedImage((prev) => (prev - 1 + allImages.length) % allImages.length)
    }
  }

  const currentStock = selectedVariant?.stock ?? product.stock_quantity

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/products" className="hover:text-foreground transition-colors">
          Products
        </Link>
        {product.category && (
          <>
            <ChevronRight className="h-4 w-4" />
            <Link
              href={`/products?category=${product.category.slug}`}
              className="hover:text-foreground transition-colors"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
        {/* Images */}
        <div className="flex flex-col gap-4">
          <div
            className="relative aspect-square overflow-hidden rounded-xl bg-muted"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Fade transition for image swap */}
            <div className="absolute inset-0 transition-opacity duration-400">
              <Image
                src={mainImage}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            {isOnSale && (
              <span className="absolute left-4 top-4 rounded-full bg-destructive px-3 py-1 text-sm font-medium text-destructive-foreground z-10">
                Sale
              </span>
            )}
            {/* Wishlist button overlay */}
            <button
              onClick={handleWishlistToggle}
              className="absolute right-4 top-4 z-10 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
            >
              <Heart
                className={cn(
                  "h-5 w-5 transition-colors",
                  wishlisted ? "text-red-500 fill-red-500" : "text-foreground"
                )}
              />
            </button>
          </div>

          {/* Swipe dots on mobile */}
          {allImages.length > 1 && (
            <div className="sm:hidden swipe-dots">
              {allImages.map((_, i) => (
                <span key={i} className={cn("swipe-dot", selectedImage === i && "active")} />
              ))}
            </div>
          )}

          {/* Gallery thumbnails */}
          {allImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2 gallery-scroll">
              {allImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={cn(
                    "relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-muted transition-all",
                    selectedImage === index
                      ? "ring-2 ring-foreground ring-offset-2"
                      : "opacity-70 hover:opacity-100"
                  )}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col space-y-5">
          <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {product.name}
          </h1>

          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-4">
            {isOnSale ? (
              <>
                <span className="text-2xl font-bold text-accent">
                  {formatPrice(product.sale_price!)}
                </span>
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.price)}
                </span>
                <span className="rounded-full bg-destructive/10 px-2 py-1 text-sm font-medium text-destructive">
                  Save {Math.round(((product.price - product.sale_price!) / product.price) * 100)}%
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold text-foreground">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {product.description && (
            <p className="rounded-xl border border-border bg-card p-4 text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Color Swatches */}
          {variantOptions.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Color: <span className="font-normal text-muted-foreground">{selectedVariant?.color_name || "Select"}</span>
              </h3>
              <div className="flex flex-wrap gap-3">
                {variantOptions.map((variant) => {
                  const isActive = selectedVariant?.id === variant.id
                  return (
                    <button
                      key={variant.id}
                      onClick={() => handleColorSelect(variant.id)}
                      className={cn(
                        "relative h-12 w-12 rounded-full transition-all duration-200",
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
                            "h-4 w-4",
                            // Use white check on dark colors, dark on light
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
          )}

          {/* Frame shape badge */}
          {product.frame_shape && (
            <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-4">
              <span className="text-sm text-muted-foreground">Frame Shape:</span>
              <span className="rounded-full bg-muted px-3 py-1 text-sm font-medium text-foreground capitalize">
                {product.frame_shape}
              </span>
            </div>
          )}

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="text-sm font-semibold text-foreground">Features</h3>
              <ul className="mt-3 flex flex-col gap-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-accent" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Specifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="text-sm font-semibold text-foreground">Specifications</h3>
              <dl className="mt-3 grid grid-cols-2 gap-3">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key}>
                    <dt className="text-xs text-muted-foreground capitalize">
                      {key.replace(/_/g, " ")}
                    </dt>
                    <dd className="text-sm font-medium text-foreground">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* Add to cart + WhatsApp order */}
          <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button
                size="lg"
                className="flex-1 sm:max-w-xs"
                onClick={handleAddToCart}
                disabled={currentStock === 0}
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                {currentStock === 0 ? "Out of Stock" : "Add to Cart"}
              </Button>
            </div>

            {/* WhatsApp Order Button */}
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:max-w-xs border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366]/10 hover:text-[#25D366]"
              onClick={handleWhatsAppOrder}
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Order via WhatsApp
            </Button>
          </div>

          {currentStock > 0 && currentStock <= 10 && (
            <p className="text-sm text-destructive">
              Only {currentStock} left!
            </p>
          )}
        </div>
      </div>

    </div>
  )
}

"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Minus, Plus, Check, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import { formatPrice, cn } from "@/lib/utils"
import type { Product } from "@/lib/types"

interface ProductDetailProps {
  product: Product
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()

  const mainImage = product.images[selectedImage] || product.images[0] || "/placeholder.svg"
  const isOnSale = product.sale_price !== null && product.sale_price < product.price

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      sale_price: product.sale_price,
      image: product.images[0] || "/placeholder.svg",
      quantity,
    })
    setQuantity(1)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
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
          <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
            <Image
              src={mainImage}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {isOnSale && (
              <span className="absolute left-4 top-4 rounded-full bg-destructive px-3 py-1 text-sm font-medium text-destructive-foreground">
                Sale
              </span>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
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
        <div className="flex flex-col">
          <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {product.name}
          </h1>

          <div className="mt-4 flex items-center gap-3">
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
            <p className="mt-6 text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div className="mt-8">
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
            <div className="mt-8">
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

          {/* Add to cart */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
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
              disabled={product.stock_quantity === 0}
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              {product.stock_quantity === 0 ? "Out of Stock" : "Add to Cart"}
            </Button>
          </div>

          {product.stock_quantity > 0 && product.stock_quantity <= 10 && (
            <p className="mt-4 text-sm text-destructive">
              Only {product.stock_quantity} left in stock!
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

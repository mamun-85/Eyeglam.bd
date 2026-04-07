"use client"

import Image from "next/image"
import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import { formatPrice } from "@/lib/utils"
import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const mainImage = product.images[0] || "/placeholder.svg"
  const isOnSale = product.sale_price !== null && product.sale_price < product.price

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      sale_price: product.sale_price,
      image: mainImage,
    })
  }

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative flex flex-col"
    >
      <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
        <Image
          src={mainImage}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {isOnSale && (
          <span className="absolute left-3 top-3 rounded-full bg-destructive px-2.5 py-1 text-xs font-medium text-destructive-foreground">
            Sale
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 flex justify-center p-3 opacity-0 translate-y-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0">
          <Button
            size="sm"
            onClick={handleAddToCart}
            className="w-full max-w-[200px]"
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </div>
      <div className="mt-4 flex flex-col">
        <h3 className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">
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
  )
}

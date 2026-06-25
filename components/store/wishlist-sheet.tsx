"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart, Trash2, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useWishlist } from "@/components/store/wishlist-context"
import { useCart } from "@/components/cart-provider"
import { formatPrice } from "@/lib/utils"

export function WishlistSheet() {
  const { items, removeItem, isOpen, setIsOpen } = useWishlist()
  const { addItem: addToCart } = useCart()

  const handleMoveToCart = (item: (typeof items)[0]) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      sale_price: item.sale_price,
      image: item.image,
    })
    removeItem(item.id)
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="flex w-full flex-col p-0 sm:max-w-lg">
        <SheetHeader className="border-b border-border p-4 pr-12">
          <SheetTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            My Wishlist
            {items.length > 0 && (
              <span className="ml-1 rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                {items.length}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center px-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <Heart className="h-10 w-10 text-muted-foreground/40" />
            </div>
            <div>
              <p className="text-lg font-medium">Your wishlist is empty</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Double-tap any product or click the heart icon to save items you love.
              </p>
            </div>
            <Button onClick={() => setIsOpen(false)} asChild>
              <Link href="/products">Explore Collection</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4">
              <ul className="divide-y divide-border">
                {items.map((item) => {
                  const isOnSale =
                    item.sale_price !== null && item.sale_price < item.price
                  const imageSrc = item.image?.includes("supabase.co")
                    ? `${item.image}?format=webp&quality=75`
                    : item.image || "/placeholder.svg"

                  return (
                    <li key={item.id} className="flex gap-3 py-4 sm:gap-4">
                      <Link
                        href={`/products/${item.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-muted sm:h-24 sm:w-24"
                      >
                        <Image
                          src={imageSrc}
                          alt={item.name}
                          fill
                          className="object-cover transition-transform hover:scale-105"
                        />
                      </Link>
                      <div className="min-w-0 flex flex-1 flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <Link
                              href={`/products/${item.slug}`}
                              onClick={() => setIsOpen(false)}
                              className="line-clamp-2 pr-1 text-sm font-medium hover:text-accent transition-colors"
                            >
                              {item.name}
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 flex-shrink-0 text-muted-foreground hover:text-destructive sm:h-8 sm:w-8"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="mt-1 flex items-center gap-2">
                            {isOnSale ? (
                              <>
                                <span className="text-sm font-semibold text-accent">
                                  {formatPrice(item.sale_price!)}
                                </span>
                                <span className="text-xs text-muted-foreground line-through">
                                  {formatPrice(item.price)}
                                </span>
                              </>
                            ) : (
                              <span className="text-sm font-semibold text-foreground">
                                {formatPrice(item.price)}
                              </span>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2 w-full sm:w-auto"
                          onClick={() => handleMoveToCart(item)}
                        >
                          <ShoppingBag className="mr-1.5 h-3.5 w-3.5" />
                          Move to Cart
                        </Button>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>

            <div
              className="border-t border-border bg-background px-4 pt-4 pb-4"
              style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom, 0px))" }}
            >
              <p className="text-sm text-muted-foreground text-center">
                {items.length} {items.length === 1 ? "item" : "items"} saved
              </p>
              <div className="mt-3 flex flex-col gap-2">
                <Button asChild size="lg" className="w-full">
                  <Link href="/products" onClick={() => setIsOpen(false)}>
                    Continue Shopping
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={() => setIsOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

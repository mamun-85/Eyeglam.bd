"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useCart } from "@/components/cart-provider"
import { formatPrice } from "@/lib/utils"

export function CartSheet() {
  const { items, removeItem, updateQuantity, subtotal, isOpen, setIsOpen } =
    useCart()

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="flex w-full flex-col p-0 sm:max-w-lg">
        <SheetHeader className="border-b border-border p-4 pr-12">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Shopping Cart
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground/50" />
            <div>
              <p className="text-lg font-medium">Your cart is empty</p>
              <p className="text-sm text-muted-foreground">
                Add some items to get started
              </p>
            </div>
            <Button onClick={() => setIsOpen(false)} asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4">
              <ul className="divide-y divide-border">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-3 py-4 sm:gap-4">
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-muted sm:h-20 sm:w-20">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="line-clamp-2 pr-1 text-sm font-medium">
                          {item.name}
                        </h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 flex-shrink-0 text-muted-foreground hover:text-destructive sm:h-8 sm:w-8"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="mt-1 text-sm font-medium text-accent">
                        {formatPrice(item.sale_price || item.price)}
                      </p>
                      {item.custom_details && (
                        <div className="mt-1 text-xs text-muted-foreground">
                          <p>Lens: {item.custom_details.lens_type}</p>
                          {item.custom_details.add_ons.length > 0 && (
                            <p>Add-ons: {item.custom_details.add_ons.join(", ")}</p>
                          )}
                        </div>
                      )}
                      <div className="mt-2 flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 sm:h-8 sm:w-8"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-7 text-center text-sm sm:w-8">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 sm:h-8 sm:w-8"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-border bg-background px-4 pt-4 pb-4">
              <div className="flex justify-between text-base font-medium">
                <p>Subtotal</p>
                <p>{formatPrice(subtotal)}</p>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Shipping calculated at checkout
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <Button asChild size="lg" className="w-full">
                  <Link href="/checkout" onClick={() => setIsOpen(false)}>
                    Checkout
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={() => setIsOpen(false)}
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

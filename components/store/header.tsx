"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, ShoppingBag, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useCart } from "@/components/cart-provider"
import { CartSheet } from "@/components/store/cart-sheet"
import type { Category } from "@/lib/types"

interface HeaderProps {
  categories: Category[]
}

export function Header({ categories }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { totalItems, setIsOpen } = useCart()

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="-ml-2">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[88vw] max-w-[340px] p-0">
                <div className="flex h-full flex-col">
                  <Link
                    href="/"
                    className="border-b border-border px-4 py-4 pr-12 font-serif text-2xl font-bold tracking-tight"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Eyeglam
                  </Link>
                  <nav className="flex-1 overflow-y-auto px-2 py-3">
                    <Link
                      href="/products"
                      className="block rounded-md px-3 py-2.5 text-base font-medium text-foreground transition-colors hover:bg-muted hover:text-accent"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      All Products
                    </Link>
                    <Link
                      href="/wholesale"
                      className="block rounded-md px-3 py-2.5 text-base font-medium text-foreground transition-colors hover:bg-muted hover:text-accent"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Wholesale
                    </Link>
                    <Link
                      href="/custom-frames"
                      className="block rounded-md px-3 py-2.5 text-base font-medium text-foreground transition-colors hover:bg-muted hover:text-accent"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Custom Frames
                    </Link>
                    <p className="px-3 pt-4 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Categories
                    </p>
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/products?category=${category.slug}`}
                        className="block rounded-md px-3 py-2.5 text-base text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo */}
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="font-serif text-2xl font-bold tracking-tight text-foreground">
                Eyeglam
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden lg:flex lg:gap-x-8">
            <Link
              href="/products"
              className="text-sm font-medium text-foreground hover:text-accent transition-colors"
            >
              All Products
            </Link>
            <Link
              href="/wholesale"
              className="text-sm font-medium text-foreground hover:text-accent transition-colors"
            >
              Wholesale
            </Link>
            <Link
              href="/custom-frames"
              className="text-sm font-medium text-foreground hover:text-accent transition-colors"
            >
              Custom Frames
            </Link>
            {categories.slice(0, 5).map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </div>

          {/* Right side icons */}
          <div className="flex flex-1 items-center justify-end gap-2">
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setIsOpen(true)}
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-medium text-accent-foreground">
                  {totalItems}
                </span>
              )}
              <span className="sr-only">Cart</span>
            </Button>
          </div>
        </div>
      </nav>
      <CartSheet />
    </header>
  )
}

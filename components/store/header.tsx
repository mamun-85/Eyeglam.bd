"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Menu, ShoppingBag, Search, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useCart } from "@/components/cart-provider"
import { CartSheet } from "@/components/store/cart-sheet"
import { useWishlist } from "@/components/store/wishlist-context"
import type { Category } from "@/lib/types"

interface HeaderProps {
  categories: Category[]
}

export function Header({ categories }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const pathname = usePathname()
  const router = useRouter()
  const { totalItems, setIsOpen } = useCart()
  const { totalItems: wishlistCount, setIsOpen: setWishlistOpen } = useWishlist()

  const navItems = [
    { href: "/products", label: "All Products" },
    { href: "/wholesale", label: "Wholesale" },
    { href: "/custom-frames", label: "Custom Frames" },
  ]

  const submitSearch = () => {
    const query = searchTerm.trim()
    router.push(query ? `/products?q=${encodeURIComponent(query)}` : "/products?focus_search=1")
  }

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
          <div className="hidden lg:flex lg:gap-x-3">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-foreground text-background"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
            {categories.slice(0, 5).map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </div>

          {/* Right side icons */}
          <div className="flex flex-1 items-center justify-end gap-2">
            <div className="hidden md:flex items-center gap-2 rounded-full border border-border bg-background px-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submitSearch()
                }}
                placeholder="Search eyewear..."
                className="h-9 w-40 bg-transparent text-sm outline-none"
              />
              <Button variant="ghost" size="sm" onClick={submitSearch}>
                Go
              </Button>
            </div>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={submitSearch}>
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative hidden sm:inline-flex"
              onClick={() => setWishlistOpen(true)}
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs font-medium text-destructive-foreground">
                  {wishlistCount}
                </span>
              )}
              <span className="sr-only">Wishlist</span>
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

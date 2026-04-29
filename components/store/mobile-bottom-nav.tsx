"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Home, Grid3X3, Heart, Search } from "lucide-react"
import { useWishlist } from "@/components/store/wishlist-context"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/products", icon: Grid3X3, label: "Categories" },
  { href: "#wishlist", icon: Heart, label: "Wishlist", isBadge: true },
  { href: "#search", icon: Search, label: "Search" },
]

export function MobileBottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { totalItems } = useWishlist()

  const handleSpecialAction = (e: React.MouseEvent, href: string) => {
    if (href === "#search") {
      e.preventDefault()
      // Focus the search input if visible, or open a search modal
      const searchInput = document.querySelector<HTMLInputElement>('[data-search-input]')
      if (searchInput) {
        searchInput.focus()
      } else {
        router.push("/products?focus_search=1")
      }
    }
    if (href === "#wishlist") {
      e.preventDefault()
      // Could open a wishlist sheet here
      // For now, navigate to products with wishlist overlay
    }
  }

  return (
    <nav className="mobile-bottom-nav">
      {NAV_ITEMS.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : item.href.startsWith("#")
            ? false
            : pathname.startsWith(item.href)

        const Icon = item.icon
        const isSpecial = item.href.startsWith("#")

        return isSpecial ? (
          <button
            key={item.label}
            onClick={(e) => handleSpecialAction(e as any, item.href)}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 w-16 h-full relative",
              "text-muted-foreground transition-colors active:scale-95"
            )}
          >
            <span className="relative">
              <Icon className="h-5 w-5" />
              {item.isBadge && totalItems > 0 && (
                <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </span>
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ) : (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 w-16 h-full relative",
              "transition-colors active:scale-95",
              isActive
                ? "text-foreground"
                : "text-muted-foreground"
            )}
          >
            <Icon className={cn("h-5 w-5", isActive && "fill-foreground/10")} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

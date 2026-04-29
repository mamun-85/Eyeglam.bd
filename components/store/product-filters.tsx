"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { SlidersHorizontal, Search } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { FaceShapeFilter } from "@/components/store/face-shape-filter"
import { cn } from "@/lib/utils"
import type { Category } from "@/lib/types"

interface ProductFiltersProps {
  categories: Category[]
  currentCategory?: string
  currentSort?: string
  currentShape?: string
  currentQuery?: string
  enableMobileBottomSheetFilters?: boolean
  focusSearch?: boolean
}

export function ProductFilters({
  categories,
  currentCategory,
  currentSort,
  currentShape,
  currentQuery,
  enableMobileBottomSheetFilters = true,
  focusSearch = false,
}: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)
  const [searchDraft, setSearchDraft] = useState(currentQuery || "")
  const desktopSearchRef = useRef<HTMLInputElement | null>(null)
  const mobileSearchRef = useRef<HTMLInputElement | null>(null)

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== "all") {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/products?${params.toString()}`)
  }

  const applySearch = () => {
    updateFilter("q", searchDraft.trim() || null)
  }

  useEffect(() => {
    if (!focusSearch) return
    const target = window.innerWidth < 640 ? mobileSearchRef.current : desktopSearchRef.current
    target?.focus()
  }, [focusSearch])

  return (
    <div className="mt-8 flex flex-col gap-6">
      {/* Mobile bottom controls */}
      {enableMobileBottomSheetFilters && (
        <div className="fixed inset-x-0 bottom-16 z-30 border-t border-border bg-background/95 p-3 backdrop-blur sm:hidden">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              ref={mobileSearchRef}
              data-search-input
              type="search"
              value={searchDraft}
              onChange={(e) => setSearchDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") applySearch()
              }}
              placeholder="Search products..."
              className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <Button variant="secondary" size="sm" onClick={applySearch}>
            Search
          </Button>
          <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open filters">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto rounded-t-2xl">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-4 flex flex-col gap-6 pb-4">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      updateFilter("category", null)
                      setIsMobileFiltersOpen(false)
                    }}
                    className={cn(
                      "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                      !currentCategory
                        ? "bg-foreground text-background"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    )}
                  >
                    All
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        updateFilter("category", category.slug)
                        setIsMobileFiltersOpen(false)
                      }}
                      className={cn(
                        "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                        currentCategory === category.slug
                          ? "bg-foreground text-background"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      )}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
                <Select
                  value={currentSort || "featured"}
                  onValueChange={(value) => {
                    updateFilter("sort", value)
                    setIsMobileFiltersOpen(false)
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
                <FaceShapeFilter currentShape={currentShape} useUrlParams={true} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
        </div>
      )}

      {/* Desktop search + Category pills + Sort */}
      <div className="hidden sm:flex sm:flex-col gap-4">
        <div className="flex items-center gap-2 max-w-md">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              ref={desktopSearchRef}
              data-search-input
              type="search"
              value={searchDraft}
              onChange={(e) => setSearchDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") applySearch()
              }}
              placeholder="Search products..."
              className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <Button variant="secondary" size="sm" onClick={applySearch}>
            Search
          </Button>
        </div>

        <div className="flex flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
          <button
            onClick={() => updateFilter("category", null)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              !currentCategory
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => updateFilter("category", category.slug)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                currentCategory === category.slug
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {category.name}
            </button>
          ))}
          </div>

          <Select
            value={currentSort || "featured"}
            onValueChange={(value) => updateFilter("sort", value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Frame Shape Filter */}
      <div className="hidden sm:block">
        <FaceShapeFilter currentShape={currentShape} useUrlParams={true} />
      </div>
    </div>
  )
}

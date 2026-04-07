"use client"

import { useRouter, useSearchParams } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import type { Category } from "@/lib/types"

interface ProductFiltersProps {
  categories: Category[]
  currentCategory?: string
  currentSort?: string
}

export function ProductFilters({
  categories,
  currentCategory,
  currentSort,
}: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== "all") {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/products?${params.toString()}`)
  }

  return (
    <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
  )
}

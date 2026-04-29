"use client"

import { cn } from "@/lib/utils"

interface ProductSkeletonProps {
  count?: number
  className?: string
}

function SkeletonCard() {
  return (
    <div className="flex flex-col">
      <div className="relative aspect-square overflow-hidden rounded-lg skeleton-shimmer" />
      <div className="mt-4 flex flex-col gap-2">
        <div className="h-4 w-3/4 rounded skeleton-shimmer" />
        <div className="h-4 w-1/3 rounded skeleton-shimmer" />
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 8, className }: ProductSkeletonProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

export function BentoSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {/* Hero double tile */}
      <div className="col-span-2 row-span-2 aspect-square rounded-2xl skeleton-shimmer" />
      {/* Standard tiles */}
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="aspect-square rounded-xl skeleton-shimmer" />
      ))}
    </div>
  )
}

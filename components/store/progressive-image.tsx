"use client"

import { useState, useCallback } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ProgressiveImageProps {
  src: string
  alt: string
  fill?: boolean
  width?: number
  height?: number
  className?: string
  priority?: boolean
  sizes?: string
}

/**
 * Progressive image with blur-up placeholder.
 * Uses a downscaled Supabase transform (10px width) as the blurred placeholder
 * while the full-res WebP loads. Pure CSS transitions — no heavy JS.
 */
export function ProgressiveImage({
  src,
  alt,
  fill = true,
  width,
  height,
  className,
  priority = false,
  sizes,
}: ProgressiveImageProps) {
  const [loaded, setLoaded] = useState(false)

  // Generate a tiny placeholder URL from Supabase storage
  // If the URL is from Supabase storage, we can use the transform API
  const placeholderSrc = src.includes("supabase.co/storage")
    ? `${src}?width=10&quality=10`
    : src

  const handleLoad = useCallback(() => {
    setLoaded(true)
  }, [])

  if (fill) {
    return (
      <div className="progressive-img-wrapper absolute inset-0">
        {/* Tiny blurred placeholder */}
        {!priority && (
          <img
            src={placeholderSrc}
            alt=""
            aria-hidden="true"
            className={cn(
              "progressive-img-placeholder object-cover w-full h-full",
              loaded && "loaded"
            )}
          />
        )}
        {/* Full resolution image */}
        <Image
          src={src}
          alt={alt}
          fill
          className={cn("object-cover", className)}
          loading={priority ? "eager" : "lazy"}
          priority={priority}
          sizes={sizes}
          onLoad={handleLoad}
        />
      </div>
    )
  }

  return (
    <div className="progressive-img-wrapper relative">
      {!priority && (
        <img
          src={placeholderSrc}
          alt=""
          aria-hidden="true"
          className={cn(
            "progressive-img-placeholder object-cover",
            loaded && "loaded"
          )}
          style={{ width: width || "100%", height: height || "auto" }}
        />
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={cn("object-cover", className)}
        loading={priority ? "eager" : "lazy"}
        priority={priority}
        sizes={sizes}
        onLoad={handleLoad}
      />
    </div>
  )
}

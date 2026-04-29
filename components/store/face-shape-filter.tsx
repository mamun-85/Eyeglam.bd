"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { FrameShape } from "@/lib/types"

interface FrameShapeOption {
  value: FrameShape
  label: string
  icon: string
}

const FRAME_SHAPES: FrameShapeOption[] = [
  { value: "round", label: "Round", icon: "○" },
  { value: "aviator", label: "Aviator", icon: "▽" },
  { value: "wayfarer", label: "Wayfarer", icon: "◇" },
  { value: "cat-eye", label: "Cat-Eye", icon: "◠" },
  { value: "rectangle", label: "Rectangle", icon: "▭" },
  { value: "square", label: "Square", icon: "□" },
  { value: "oval", label: "Oval", icon: "⬮" },
  { value: "browline", label: "Browline", icon: "⌓" },
]

interface FaceShapeFilterProps {
  currentShape?: string
  /** If true, uses URL params. If false, calls onChange for client-side filtering */
  useUrlParams?: boolean
  onChange?: (shape: FrameShape | null) => void
}

export function FaceShapeFilter({
  currentShape,
  useUrlParams = true,
  onChange,
}: FaceShapeFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSelect = (shape: FrameShape) => {
    const newShape = currentShape === shape ? null : shape

    if (useUrlParams) {
      const params = new URLSearchParams(searchParams.toString())
      if (newShape) {
        params.set("shape", newShape)
      } else {
        params.delete("shape")
      }
      router.push(`/products?${params.toString()}`)
    } else {
      onChange?.(newShape)
    }
  }

  return (
    <div className="w-full">
      <h3 className="text-sm font-semibold text-foreground mb-3 tracking-wide uppercase">
        Frame Shape
      </h3>
      <div className="flex flex-wrap gap-2">
        {FRAME_SHAPES.map((shape) => {
          const isActive = currentShape === shape.value
          return (
            <motion.button
              key={shape.value}
              onClick={() => handleSelect(shape.value)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "group relative flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-foreground text-background shadow-lg shadow-foreground/20"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              )}
            >
              <span className={cn(
                "text-base transition-transform duration-200",
                isActive && "scale-110"
              )}>
                {shape.icon}
              </span>
              <span>{shape.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeShape"
                  className="absolute inset-0 rounded-full bg-foreground -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { Product } from "@/lib/types"

interface QuickViewContextType {
  isOpen: boolean
  product: Product | null
  openQuickView: (product: Product) => void
  closeQuickView: () => void
}

const QuickViewContext = createContext<QuickViewContextType | undefined>(undefined)

export function QuickViewProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [product, setProduct] = useState<Product | null>(null)

  const openQuickView = (product: Product) => {
    setProduct(product)
    setIsOpen(true)
  }

  const closeQuickView = () => {
    setIsOpen(false)
    // Delay clearing product to allow exit animation
    setTimeout(() => setProduct(null), 300)
  }

  return (
    <QuickViewContext.Provider value={{ isOpen, product, openQuickView, closeQuickView }}>
      {children}
    </QuickViewContext.Provider>
  )
}

export function useQuickView() {
  const context = useContext(QuickViewContext)
  if (!context) {
    throw new Error("useQuickView must be used within a QuickViewProvider")
  }
  return context
}

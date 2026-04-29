"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { WishlistItem } from "@/lib/types"

interface WishlistContextType {
  items: WishlistItem[]
  addItem: (item: Omit<WishlistItem, "added_at">) => void
  removeItem: (id: string) => void
  toggleItem: (item: Omit<WishlistItem, "added_at">) => boolean
  isInWishlist: (id: string) => boolean
  totalItems: number
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem("eyeglam-wishlist")
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) setItems(parsed)
      }
    } catch {
      localStorage.removeItem("eyeglam-wishlist")
    }
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("eyeglam-wishlist", JSON.stringify(items))
    }
  }, [items, isHydrated])

  const addItem = (newItem: Omit<WishlistItem, "added_at">) => {
    setItems((prev) => {
      if (prev.find((item) => item.id === newItem.id)) return prev
      return [...prev, { ...newItem, added_at: new Date().toISOString() }]
    })
  }

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  /** Toggle: returns true if item was added, false if removed */
  const toggleItem = (item: Omit<WishlistItem, "added_at">): boolean => {
    const exists = items.find((i) => i.id === item.id)
    if (exists) {
      removeItem(item.id)
      return false
    } else {
      addItem(item)
      return true
    }
  }

  const isInWishlist = (id: string) => items.some((item) => item.id === id)
  const totalItems = items.length

  return (
    <WishlistContext.Provider
      value={{ items, addItem, removeItem, toggleItem, isInWishlist, totalItems }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}

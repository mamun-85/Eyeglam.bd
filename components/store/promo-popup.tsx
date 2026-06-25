"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { X } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import type { PromoPopupSettings } from "@/lib/site-settings"

const DISMISS_KEY = "eyeglam-promo-dismissed"

export function PromoPopup({ content }: { content: PromoPopupSettings }) {
  const [open, setOpen] = useState(false)

  const active = content.enabled && !!content.image

  useEffect(() => {
    if (!active) return
    let dismissed = false
    try {
      dismissed = sessionStorage.getItem(DISMISS_KEY) === "1"
    } catch {}
    if (dismissed) return
    const t = setTimeout(() => setOpen(true), 1200)
    return () => clearTimeout(t)
  }, [active])

  const close = () => {
    setOpen(false)
    try {
      sessionStorage.setItem(DISMISS_KEY, "1")
    } catch {}
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  if (!active) return null

  const hasFooter = !!(content.heading || content.subheading || content.link)

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <button
            aria-label="Close promotion"
            onClick={close}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Card */}
          <motion.div
            className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-background shadow-2xl"
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <button
              onClick={close}
              aria-label="Close"
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur transition-colors hover:bg-black/60"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Image (links if provided) */}
            {content.link ? (
              <Link href={content.link} onClick={close} className="block">
                <div className="relative aspect-[4/5] w-full bg-muted">
                  <Image
                    src={content.image}
                    alt={content.heading || "Special offer"}
                    fill
                    sizes="(max-width: 640px) 90vw, 384px"
                    className="object-cover"
                    priority
                  />
                </div>
              </Link>
            ) : (
              <div className="relative aspect-[4/5] w-full bg-muted">
                <Image
                  src={content.image}
                  alt={content.heading || "Special offer"}
                  fill
                  sizes="(max-width: 640px) 90vw, 384px"
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {hasFooter && (
              <div className="flex flex-col items-center gap-2 p-5 text-center">
                {content.heading && (
                  <h3 className="font-serif text-xl font-bold tracking-tight">
                    {content.heading}
                  </h3>
                )}
                {content.subheading && (
                  <p className="text-sm text-muted-foreground">{content.subheading}</p>
                )}
                {content.link && (
                  <Button asChild size="lg" className="mt-2 w-full" onClick={close}>
                    <Link href={content.link}>{content.cta_label}</Link>
                  </Button>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

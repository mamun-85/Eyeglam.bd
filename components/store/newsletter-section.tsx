"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Sparkles, Gift, Tag, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { DEFAULT_MARKETING_CONTENT, type MarketingContentSettings } from "@/lib/site-settings"

const BENEFIT_ICONS = [Gift, Tag, Sparkles, Bell]

interface NewsletterSectionProps {
  content?: MarketingContentSettings["newsletter"]
}

export function NewsletterSection({ content = DEFAULT_MARKETING_CONTENT.newsletter }: NewsletterSectionProps) {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    // Client-side only — show success without hitting any API
    setIsSubmitted(true)
    toast.success("Welcome to the EyeGlam family!", {
      description: "You'll be the first to know about our latest drops.",
    })
    setEmail("")
    setTimeout(() => setIsSubmitted(false), 5000)
  }

  return (
    <section className="relative overflow-hidden py-12 sm:py-24">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-foreground via-foreground/97 to-foreground/92" />
      {/* Decorative orbs */}
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left: Benefits */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-amber-400" />
              <span className="text-sm font-medium uppercase tracking-wider text-background/60">
                {content.eyebrow}
              </span>
            </div>
            <h2 className="mt-4 font-serif text-2xl font-bold tracking-tight text-background sm:text-4xl text-balance">
              {content.heading}{" "}
              <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                {content.heading_highlight}
              </span>
            </h2>
            <p className="mt-4 text-base text-background/60 max-w-md">
              {content.description}
            </p>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {content.benefits.map((benefit, i) => {
                const Icon = BENEFIT_ICONS[i % BENEFIT_ICONS.length]
                return (
                  <div
                    key={benefit}
                    className="flex items-center gap-3 rounded-xl border border-background/10 bg-background/5 px-4 py-3"
                  >
                    <Icon className="h-4 w-4 shrink-0 text-amber-400/80" />
                    <span className="text-sm text-background/80">{benefit}</span>
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-2xl border border-background/10 bg-background/5 p-6 sm:p-8 backdrop-blur-sm"
          >
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-semibold text-background">
                Subscribe to Our Newsletter
              </h3>
              <p className="mt-2 text-sm text-background/60">
                Be the first to know about new collections, exclusive deals, and style inspiration.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-background/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full rounded-xl border border-background/15 bg-background/10 py-3 pl-10 pr-4 text-sm text-background placeholder:text-background/40 outline-none ring-background/30 focus:ring-2 transition-shadow"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-foreground hover:from-amber-600 hover:to-amber-700 shadow-lg shadow-amber-500/20"
                disabled={isSubmitted}
              >
                {isSubmitted ? (
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Subscribed!
                  </span>
                ) : (
                  "Join the EyeGlam Family"
                )}
              </Button>
            </form>

            <p className="mt-4 text-center text-xs text-background/40">
              We respect your privacy. Unsubscribe anytime with one click.
            </p>

            {/* Social proof */}
            <div className="mt-6 flex items-center justify-center gap-3 border-t border-background/10 pt-5">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-8 w-8 rounded-full border-2 border-background/10 bg-gradient-to-br from-amber-400/30 to-amber-600/30 flex items-center justify-center text-[10px] font-semibold text-background/60"
                  >
                    {["S", "R", "A", "M"][i]}
                  </div>
                ))}
              </div>
              <p className="text-xs text-background/50">
                <span className="font-medium text-background/70">{content.subscriber_count}</span> subscribers
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

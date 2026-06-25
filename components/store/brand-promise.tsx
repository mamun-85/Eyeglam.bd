"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Award, Users, Glasses, ShieldCheck } from "lucide-react"
import { DEFAULT_MARKETING_CONTENT, type MarketingContentSettings } from "@/lib/site-settings"

const STAT_ICONS = [Users, Glasses, ShieldCheck, Award]
const BADGE_DOTS = ["bg-emerald-400", "bg-amber-400", "bg-sky-400", "bg-rose-400"]

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const end = value
    const duration = 2000
    const increment = end / (duration / 16)

    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [value])

  return (
    <span className="tabular-nums">
      {count.toLocaleString()}{suffix}
    </span>
  )
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
}

interface BrandPromiseProps {
  content?: MarketingContentSettings["brand_promise"]
}

export function BrandPromise({ content = DEFAULT_MARKETING_CONTENT.brand_promise }: BrandPromiseProps) {
  return (
    <section className="relative overflow-hidden py-12 sm:py-24">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-foreground via-foreground/95 to-foreground/90" />
      {/* Decorative glow accents */}
      <div className="absolute -top-32 right-0 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />
      <div className="absolute bottom-0 -left-20 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
        backgroundSize: '24px 24px',
      }} />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left: Copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <span className="inline-block rounded-full border border-background/20 bg-background/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-background/80">
              {content.eyebrow}
            </span>
            <h2 className="mt-6 font-serif text-2xl font-bold tracking-tight text-background sm:text-4xl lg:text-5xl text-balance">
              {content.heading}{" "}
              <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                {content.heading_highlight}
              </span>
            </h2>
            <p className="mt-5 text-base sm:text-lg leading-relaxed text-background/70 max-w-lg">
              {content.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {content.badges.map((badge, i) => (
                <div key={badge} className="flex items-center gap-2 rounded-full bg-background/10 px-4 py-2">
                  <div className={`h-2 w-2 rounded-full ${BADGE_DOTS[i % BADGE_DOTS.length]}`} />
                  <span className="text-sm text-background/80">{badge}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Animated Stats */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 gap-4"
          >
            {content.stats.map((stat, i) => {
              const Icon = STAT_ICONS[i % STAT_ICONS.length]
              return (
                <motion.div
                  key={stat.label}
                  variants={itemVariants}
                  className="group rounded-2xl border border-background/10 bg-background/5 p-5 sm:p-6 backdrop-blur-sm transition-colors hover:bg-background/10"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background/10 transition-colors group-hover:bg-background/15">
                    <Icon className="h-5 w-5 text-background/80" />
                  </div>
                  <div className="mt-4 font-serif text-2xl sm:text-3xl font-bold text-background">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="mt-1 text-sm font-medium text-background/90">{stat.label}</p>
                  <p className="mt-1 text-xs text-background/50 hidden sm:block">{stat.description}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

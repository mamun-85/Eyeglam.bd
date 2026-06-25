"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CircleDot, Diamond, Hexagon, Pentagon, Square, Triangle } from "lucide-react"
import { DEFAULT_MARKETING_CONTENT, type MarketingContentSettings } from "@/lib/site-settings"

const faceShapes = [
  {
    icon: CircleDot,
    shape: "Round Face",
    recommendation: "Angular frames like Rectangle & Wayfarer add definition",
    tags: ["Rectangle", "Wayfarer", "Square"],
    gradient: "from-rose-500/10 to-pink-500/10",
    borderColor: "border-rose-200/50",
    iconColor: "text-rose-500",
  },
  {
    icon: Square,
    shape: "Square Face",
    recommendation: "Soft round frames balance strong jawlines beautifully",
    tags: ["Round", "Oval", "Browline"],
    gradient: "from-violet-500/10 to-purple-500/10",
    borderColor: "border-violet-200/50",
    iconColor: "text-violet-500",
  },
  {
    icon: Pentagon,
    shape: "Oval Face",
    recommendation: "Lucky you! Most frame shapes complement oval faces",
    tags: ["Aviator", "Cat-Eye", "Wayfarer"],
    gradient: "from-amber-500/10 to-orange-500/10",
    borderColor: "border-amber-200/50",
    iconColor: "text-amber-500",
  },
  {
    icon: Triangle,
    shape: "Heart Face",
    recommendation: "Bottom-heavy frames balance a wider forehead",
    tags: ["Aviator", "Round", "Rectangle"],
    gradient: "from-emerald-500/10 to-teal-500/10",
    borderColor: "border-emerald-200/50",
    iconColor: "text-emerald-500",
  },
  {
    icon: Diamond,
    shape: "Diamond Face",
    recommendation: "Cat-eye and oval frames highlight your cheekbones",
    tags: ["Cat-Eye", "Oval", "Browline"],
    gradient: "from-sky-500/10 to-cyan-500/10",
    borderColor: "border-sky-200/50",
    iconColor: "text-sky-500",
  },
  {
    icon: Hexagon,
    shape: "Oblong Face",
    recommendation: "Wide frames with decorative temples add width",
    tags: ["Round", "Square", "Aviator"],
    gradient: "from-indigo-500/10 to-blue-500/10",
    borderColor: "border-indigo-200/50",
    iconColor: "text-indigo-500",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

interface StyleGuideCTAProps {
  content?: MarketingContentSettings["style_guide"]
}

export function StyleGuideCTA({ content = DEFAULT_MARKETING_CONTENT.style_guide }: StyleGuideCTAProps) {
  return (
    <section className="py-12 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full border border-border bg-muted px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {content.eyebrow}
          </span>
          <h2 className="mt-5 font-serif text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
            {content.heading}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground">
            {content.description}
          </p>
        </div>

        {/* Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {faceShapes.map((item) => (
            <motion.div
              key={item.shape}
              variants={cardVariants}
              className={`group relative rounded-2xl border ${item.borderColor} bg-gradient-to-br ${item.gradient} p-6 transition-all hover:shadow-lg hover:-translate-y-1`}
            >
              <div className="flex items-start gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-background shadow-sm`}>
                  <item.icon className={`h-6 w-6 ${item.iconColor}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-foreground">{item.shape}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {item.recommendation}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {item.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/products?shape=${tag.toLowerCase()}`}
                    className="rounded-full bg-background/80 px-3 py-1 text-xs font-medium text-foreground shadow-sm transition-colors hover:bg-background hover:shadow-md"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <Button asChild size="lg" className="min-w-[200px]">
            <Link href="/products">{content.cta_label}</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

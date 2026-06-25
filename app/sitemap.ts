import type { MetadataRoute } from "next"
import { createClient } from "@/lib/supabase/server"

const SITE_URL = "https://eyeglambd.com"

export const dynamic = "force-dynamic"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/products`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/custom-frames`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/wholesale`, changeFrequency: "monthly", priority: 0.5 },
  ]

  try {
    const supabase = await createClient()
    const [{ data: products }, { data: categories }] = await Promise.all([
      supabase
        .from("products")
        .select("slug, updated_at")
        .eq("is_active", true)
        .order("updated_at", { ascending: false })
        .limit(5000),
      supabase
        .from("categories")
        .select("slug")
        .eq("is_active", true),
    ])

    const productRoutes: MetadataRoute.Sitemap = (products || []).map((p) => ({
      url: `${SITE_URL}/products/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : undefined,
      changeFrequency: "weekly",
      priority: 0.8,
    }))

    const categoryRoutes: MetadataRoute.Sitemap = (categories || []).map((c) => ({
      url: `${SITE_URL}/products?category=${c.slug}`,
      changeFrequency: "weekly",
      priority: 0.7,
    }))

    return [...staticRoutes, ...categoryRoutes, ...productRoutes]
  } catch {
    return staticRoutes
  }
}

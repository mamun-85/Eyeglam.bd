import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { ProductCard } from "@/components/store/product-card"
import { ProductFilters } from "@/components/store/product-filters"
import { ProductGridSkeleton } from "@/components/store/product-skeleton"
import { resolveStorefrontFeaturesSettings } from "@/lib/site-settings"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Products | Eyeglam",
  description: "Browse our collection of premium sunglasses and eyewear.",
}

interface ProductsPageProps {
  searchParams: Promise<{ category?: string; sort?: string; shape?: string; q?: string; focus_search?: string }>
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order")

  let query = supabase.from("products").select("*").eq("is_active", true)

  // Category filter
  if (params.category) {
    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", params.category)
      .single()

    if (category) {
      query = query.eq("category_id", category.id)
    }
  }

  // Frame shape filter
  if (params.shape) {
    query = query.eq("frame_shape", params.shape)
  }

  // Keyword search
  if (params.q) {
    query = query.ilike("name", `%${params.q}%`)
  }

  // Sorting
  switch (params.sort) {
    case "price-asc":
      query = query.order("price", { ascending: true })
      break
    case "price-desc":
      query = query.order("price", { ascending: false })
      break
    case "newest":
      query = query.order("created_at", { ascending: false })
      break
    default:
      query = query.order("is_featured", { ascending: false }).order("created_at", { ascending: false })
  }

  const { data: products } = await query
  const { data: storefrontFeatureSetting } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "storefront_features")
    .maybeSingle()
  const storefrontFeatures = resolveStorefrontFeaturesSettings(
    storefrontFeatureSetting?.value
  )

  const currentCategory = categories?.find((c) => c.slug === params.category)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {currentCategory ? currentCategory.name : "All Products"}
        </h1>
        <p className="text-muted-foreground">
          {currentCategory
            ? currentCategory.description
            : "Discover our complete collection of premium eyewear"}
        </p>
      </div>

      <Suspense fallback={<div className="mt-8 h-12 animate-pulse rounded-lg bg-muted" />}>
        <ProductFilters
          categories={categories || []}
          currentCategory={params.category}
          currentSort={params.sort}
          currentShape={params.shape}
          currentQuery={params.q}
          enableMobileBottomSheetFilters={
            storefrontFeatures.enable_mobile_bottom_sheet_filters
          }
          focusSearch={params.focus_search === "1"}
        />
      </Suspense>

      {products && products.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-16 text-center">
          <div className="mx-auto h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-4">
            <svg className="h-10 w-10 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <p className="text-lg font-medium text-foreground">No products found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your filters or browse all products
          </p>
        </div>
      )}
    </div>
  )
}

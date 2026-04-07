import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { ProductCard } from "@/components/store/product-card"
import { ProductFilters } from "@/components/store/product-filters"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Products | Eyeglam",
  description: "Browse our collection of premium sunglasses and eyewear.",
}

interface ProductsPageProps {
  searchParams: Promise<{ category?: string; sort?: string }>
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
          <p className="text-lg text-muted-foreground">
            No products found in this category.
          </p>
        </div>
      )}
    </div>
  )
}

import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { ProductDetail } from "@/components/store/product-detail"
import { FeaturedProducts } from "@/components/store/featured-products"

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from("products")
    .select("name, description")
    .eq("slug", slug)
    .eq("is_active", true)
    .single()

  if (!product) {
    return {
      title: "Product Not Found | Eyeglam",
    }
  }

  return {
    title: `${product.name} | Eyeglam`,
    description: product.description || `Shop ${product.name} at Eyeglam`,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("slug", slug)
    .eq("is_active", true)
    .single()

  if (!product) {
    notFound()
  }

  const { data: relatedProducts } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .neq("id", product.id)
    .eq("category_id", product.category_id)
    .limit(4)

  return (
    <div className="py-8">
      <ProductDetail product={product} />
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="mt-16">
          <FeaturedProducts products={relatedProducts} />
        </div>
      )}
    </div>
  )
}

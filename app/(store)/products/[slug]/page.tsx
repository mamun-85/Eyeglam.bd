import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { ProductDetail } from "@/components/store/product-detail"
import { FeaturedProducts } from "@/components/store/featured-products"
import { resolveStorefrontFeaturesSettings } from "@/lib/site-settings"

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from("products")
    .select("name, description, thumbnail_url, images")
    .eq("slug", slug)
    .eq("is_active", true)
    .single()

  if (!product) {
    return {
      title: "Product Not Found",
    }
  }

  const image = product.thumbnail_url || product.images?.[0] || "/web-app-manifest-512x512.png"
  const description =
    product.description?.slice(0, 160) ||
    `Shop ${product.name} at EyeGlam — premium eyewear in Bangladesh with fast delivery and cash on delivery.`

  return {
    title: product.name,
    description,
    alternates: { canonical: `/products/${slug}` },
    openGraph: {
      type: "website",
      title: product.name,
      description,
      url: `/products/${slug}`,
      images: [{ url: image, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: [image],
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: relationalProduct, error: relationalError } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(*),
      variant_rows:product_variants(
        id,
        stock,
        color:colors(id, color_name, hex_code),
        images:product_images(id, url, sort_order)
      )
    `)
    .eq("slug", slug)
    .eq("is_active", true)
    .single()

  const { data: legacyProduct } = relationalError
    ? await supabase
        .from("products")
        .select("*, category:categories(*)")
        .eq("slug", slug)
        .eq("is_active", true)
        .single()
    : { data: null as any }

  const product = relationalProduct || legacyProduct

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

  const variantOptions = (((product as any).variant_rows || []) as any[]).map((variant: any) => ({
    id: variant.id,
    stock: variant.stock || 0,
    color_name: variant.color?.color_name || "Unknown",
    color_hex: variant.color?.hex_code || "#111111",
    images: (variant.images || [])
      .sort((a: any, b: any) => a.sort_order - b.sort_order)
      .map((image: any) => image.url),
  }))

  const { data: storefrontFeatureSetting } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "storefront_features")
    .maybeSingle()
  const storefrontFeatures = resolveStorefrontFeaturesSettings(
    storefrontFeatureSetting?.value
  )

  const rawImage = product.thumbnail_url || product.images?.[0] || ""
  const productImage = rawImage
    ? rawImage.startsWith("http")
      ? rawImage
      : `https://eyeglambd.com${rawImage}`
    : undefined
  const inStock = (product.stock_quantity ?? 0) > 0
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || `${product.name} — premium eyewear at EyeGlam.`,
    image: productImage ? [productImage] : undefined,
    brand: { "@type": "Brand", name: "EyeGlam" },
    category: product.category?.name,
    offers: {
      "@type": "Offer",
      url: `https://eyeglambd.com/products/${product.slug}`,
      priceCurrency: "BDT",
      price: (product.sale_price || product.price)?.toString(),
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: "EyeGlam" },
    },
  }

  return (
    <div className="py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <ProductDetail
        product={product}
        whatsappNumber={storefrontFeatures.whatsapp_number}
        whatsappMessageTemplate={storefrontFeatures.whatsapp_message_template}
        variantOptions={variantOptions}
      />
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="mt-16">
          <FeaturedProducts products={relatedProducts} />
        </div>
      )}
    </div>
  )
}

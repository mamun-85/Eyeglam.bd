import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProductForm } from "@/components/admin/product-form"

const FALLBACK_FRAME_SHAPES = [
  { id: "round", slug: "round", label: "Round" },
  { id: "aviator", slug: "aviator", label: "Aviator" },
  { id: "wayfarer", slug: "wayfarer", label: "Wayfarer" },
  { id: "cat-eye", slug: "cat-eye", label: "Cat-Eye" },
  { id: "rectangle", slug: "rectangle", label: "Rectangle" },
  { id: "square", slug: "square", label: "Square" },
  { id: "oval", slug: "oval", label: "Oval" },
  { id: "browline", slug: "browline", label: "Browline" },
]

interface EditProductPageProps {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).single(),
    supabase.from("categories").select("*").order("name"),
  ])

  const [{ data: frameShapes, error: frameShapesError }, { data: variants }] = await Promise.all([
    supabase.from("frame_shapes").select("id, slug, label").order("sort_order"),
    supabase
      .from("product_variants")
      .select("id, stock, color:colors(color_name, hex_code), images:product_images(url, sort_order)")
      .eq("product_id", id)
      .order("created_at", { ascending: true }),
  ])

  if (!product) {
    notFound()
  }

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold tracking-tight">Edit Product</h1>
      <p className="mt-2 text-muted-foreground">
        Update product information
      </p>
      <div className="mt-8">
        <ProductForm
          product={product}
          categories={categories || []}
          frameShapes={
            frameShapesError || !frameShapes || frameShapes.length === 0
              ? FALLBACK_FRAME_SHAPES
              : frameShapes
          }
          initialVariants={
            (variants && variants.length > 0)
              ? (variants || []).map((variant: any) => ({
                  id: variant.id,
                  color_name: variant.color?.color_name || "",
                  color_hex: variant.color?.hex_code || "#111111",
                  stock: variant.stock || 0,
                  images: (variant.images || [])
                    .sort((a: any, b: any) => a.sort_order - b.sort_order)
                    .map((img: any) => img.url),
                }))
              : (product.variants || []).map((variant: any, index: number) => ({
                  id: `legacy-${index}`,
                  color_name: variant.color_name || "",
                  color_hex: variant.color_hex || "#111111",
                  stock: 0,
                  images: variant.image_url ? [variant.image_url] : [],
                }))
          }
        />
      </div>
    </div>
  )
}

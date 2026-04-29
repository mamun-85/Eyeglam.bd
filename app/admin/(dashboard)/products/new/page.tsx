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

export default async function NewProductPage() {
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name")

  const { data: frameShapes, error: frameShapesError } = await supabase
    .from("frame_shapes")
    .select("id, slug, label")
    .order("sort_order")

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold tracking-tight">New Product</h1>
      <p className="mt-2 text-muted-foreground">
        Add a new product to your catalog
      </p>
      <div className="mt-8">
        <ProductForm
          categories={categories || []}
          frameShapes={
            frameShapesError || !frameShapes || frameShapes.length === 0
              ? FALLBACK_FRAME_SHAPES
              : frameShapes
          }
        />
      </div>
    </div>
  )
}

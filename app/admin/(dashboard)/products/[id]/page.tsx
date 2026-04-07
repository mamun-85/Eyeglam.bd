import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProductForm } from "@/components/admin/product-form"

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
        <ProductForm product={product} categories={categories || []} />
      </div>
    </div>
  )
}

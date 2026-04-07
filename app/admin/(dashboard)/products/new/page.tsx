import { createClient } from "@/lib/supabase/server"
import { ProductForm } from "@/components/admin/product-form"

export default async function NewProductPage() {
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name")

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold tracking-tight">New Product</h1>
      <p className="mt-2 text-muted-foreground">
        Add a new product to your catalog
      </p>
      <div className="mt-8">
        <ProductForm categories={categories || []} />
      </div>
    </div>
  )
}

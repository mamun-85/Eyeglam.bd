import { createClient } from "@/lib/supabase/server"
import { CategoriesManager } from "@/components/admin/categories-manager"

export default async function AdminCategoriesPage() {
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order")

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold tracking-tight">Categories</h1>
      <p className="mt-2 text-muted-foreground">
        Manage product categories
      </p>
      <div className="mt-8">
        <CategoriesManager initialCategories={categories || []} />
      </div>
    </div>
  )
}

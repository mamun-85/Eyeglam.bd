import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/store/header"
import { Footer } from "@/components/store/footer"

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order")

  return (
    <div className="flex min-h-screen flex-col">
      <Header categories={categories || []} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

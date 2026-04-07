import { createClient } from "@/lib/supabase/server"
import { OrdersTable } from "@/components/admin/orders-table"

export default async function AdminOrdersPage() {
  const supabase = await createClient()

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold tracking-tight">Orders</h1>
      <p className="mt-2 text-muted-foreground">
        View and manage customer orders
      </p>
      <div className="mt-8">
        <OrdersTable orders={orders || []} />
      </div>
    </div>
  )
}

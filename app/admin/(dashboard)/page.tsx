import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, FolderTree, ShoppingCart, DollarSign } from "lucide-react"
import { formatPrice } from "@/lib/utils"

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [
    { count: productsCount },
    { count: categoriesCount },
    { count: ordersCount },
    { data: orders },
    { data: recentOrders },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("categories").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("total, status").order("created_at", { ascending: false }).limit(100),
    supabase
      .from("orders")
      .select("id, customer_name, total, status, created_at")
      .order("created_at", { ascending: false })
      .limit(6),
  ])

  const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.total), 0) || 0
  const statusCounts = (orders || []).reduce<Record<string, number>>((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1
    return acc
  }, {})
  const statusCards = [
    { label: "Pending", value: statusCounts.pending || 0, color: "bg-yellow-500" },
    { label: "Processing", value: statusCounts.processing || 0, color: "bg-blue-500" },
    { label: "Shipped", value: statusCounts.shipped || 0, color: "bg-purple-500" },
    { label: "Delivered", value: statusCounts.delivered || 0, color: "bg-green-500" },
  ]

  const stats = [
    {
      title: "Total Products",
      value: productsCount || 0,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Categories",
      value: categoriesCount || 0,
      icon: FolderTree,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Orders",
      value: ordersCount || 0,
      icon: ShoppingCart,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Revenue",
      value: formatPrice(totalRevenue),
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ]

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold tracking-tight">Dashboard</h1>
      <p className="mt-2 text-muted-foreground">
        Welcome to your Eyeglam admin dashboard
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`rounded-full p-2 ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Order Status Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {statusCards.map((item) => {
              const totalOrders = ordersCount || 0
              const percentage = totalOrders > 0 ? Math.round((item.value / totalOrders) * 100) : 0
              return (
                <div key={item.label}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span>{item.label}</span>
                    <span className="text-muted-foreground">
                      {item.value} ({percentage}%)
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {(recentOrders || []).map((order) => (
                <li
                  key={order.id}
                  className="flex items-center justify-between rounded-md border border-border p-3"
                >
                  <div>
                    <p className="text-sm font-medium">{order.customer_name}</p>
                    <p className="text-xs text-muted-foreground">
                      #{order.id.slice(0, 8)} • {order.status}
                    </p>
                  </div>
                  <p className="text-sm font-semibold">{formatPrice(order.total)}</p>
                </li>
              ))}
              {(recentOrders || []).length === 0 && (
                <li className="text-sm text-muted-foreground">No recent orders yet.</li>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

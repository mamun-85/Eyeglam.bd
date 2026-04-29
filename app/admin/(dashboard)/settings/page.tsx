import { createClient } from "@/lib/supabase/server"
import { SettingsForm } from "@/components/admin/settings-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function AdminSettingsPage() {
  const supabase = await createClient()

  const { data: settings } = await supabase
    .from("site_settings")
    .select("*")

  const settingsMap = settings?.reduce((acc, setting) => {
    acc[setting.key] = setting.value
    return acc
  }, {} as Record<string, unknown>) || {}

  const [
    { error: frameShapesError },
    { error: colorsError },
    { error: variantsError },
    { error: variantImagesError },
    { data: buckets, error: bucketsError },
  ] = await Promise.all([
    supabase.from("frame_shapes").select("id", { head: true, count: "exact" }),
    supabase.from("colors").select("id", { head: true, count: "exact" }),
    supabase.from("product_variants").select("id", { head: true, count: "exact" }),
    supabase.from("product_images").select("id", { head: true, count: "exact" }),
    supabase.storage.listBuckets(),
  ])

  const checks = [
    { label: "Frame Shapes Table", ok: !frameShapesError },
    { label: "Colors Table", ok: !colorsError },
    { label: "Product Variants Table", ok: !variantsError },
    { label: "Product Images Table", ok: !variantImagesError },
    {
      label: "Storage Bucket",
      ok: !bucketsError && (buckets || []).some((bucket) => ["public", "images", "uploads", "product-images"].includes(bucket.name)),
    },
  ]

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold tracking-tight">Settings</h1>
      <p className="mt-2 text-muted-foreground">
        Configure your store settings
      </p>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>System Health Check</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {checks.map((check) => (
            <div key={check.label} className="flex items-center justify-between text-sm">
              <span>{check.label}</span>
              <Badge variant={check.ok ? "default" : "destructive"}>
                {check.ok ? "OK" : "Needs Fix"}
              </Badge>
            </div>
          ))}
          {checks.some((check) => !check.ok) && (
            <p className="text-xs text-muted-foreground">
              Run `supabase-migration.sql` to create relational tables/bucket and enable full admin configuration.
            </p>
          )}
        </CardContent>
      </Card>
      <div className="mt-8">
        <SettingsForm settings={settingsMap} />
      </div>
    </div>
  )
}

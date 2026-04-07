import { createClient } from "@/lib/supabase/server"
import { SettingsForm } from "@/components/admin/settings-form"

export default async function AdminSettingsPage() {
  const supabase = await createClient()

  const { data: settings } = await supabase
    .from("site_settings")
    .select("*")

  const settingsMap = settings?.reduce((acc, setting) => {
    acc[setting.key] = setting.value
    return acc
  }, {} as Record<string, unknown>) || {}

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold tracking-tight">Settings</h1>
      <p className="mt-2 text-muted-foreground">
        Configure your store settings
      </p>
      <div className="mt-8">
        <SettingsForm settings={settingsMap} />
      </div>
    </div>
  )
}

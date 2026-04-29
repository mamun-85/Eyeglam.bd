import { createClient } from "@/lib/supabase/server"
import { QuickViewProvider } from "@/components/store/quick-view-context"
import { WishlistProvider } from "@/components/store/wishlist-context"
import { QuickViewPanel } from "@/components/store/quick-view-panel"
import { WhatsAppFAB } from "@/components/store/whatsapp-fab"
import { MobileBottomNav } from "@/components/store/mobile-bottom-nav"
import { Header } from "@/components/store/header"
import { Footer } from "@/components/store/footer"
import { resolveStorefrontFeaturesSettings } from "@/lib/site-settings"

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

  const { data: storefrontFeatureSetting } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "storefront_features")
    .maybeSingle()

  const storefrontFeatures = resolveStorefrontFeaturesSettings(
    storefrontFeatureSetting?.value
  )

  return (
    <WishlistProvider>
      <QuickViewProvider>
        <div className="flex min-h-screen flex-col">
          <Header categories={categories || []} />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <QuickViewPanel />
        {storefrontFeatures.enable_whatsapp_fab && (
          <WhatsAppFAB
            whatsappNumber={storefrontFeatures.whatsapp_number}
            messageTemplate={storefrontFeatures.whatsapp_message_template}
          />
        )}
        {storefrontFeatures.enable_mobile_bottom_nav && <MobileBottomNav />}
      </QuickViewProvider>
    </WishlistProvider>
  )
}

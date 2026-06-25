import { createClient } from "@/lib/supabase/server"
import { QuickViewProvider } from "@/components/store/quick-view-context"
import { WishlistProvider } from "@/components/store/wishlist-context"
import { QuickViewPanel } from "@/components/store/quick-view-panel"
import { WishlistSheet } from "@/components/store/wishlist-sheet"
import { WhatsAppFAB } from "@/components/store/whatsapp-fab"
import { MobileBottomNav } from "@/components/store/mobile-bottom-nav"
import { PromoPopup } from "@/components/store/promo-popup"
import { Header } from "@/components/store/header"
import { Footer } from "@/components/store/footer"
import {
  resolveStorefrontFeaturesSettings,
  resolvePromoPopup,
} from "@/lib/site-settings"

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

  const { data: layoutSettings } = await supabase
    .from("site_settings")
    .select("key, value")
    .in("key", ["storefront_features", "promo_popup"])

  const layoutSettingsMap = (layoutSettings || []).reduce((acc, row) => {
    acc[row.key] = row.value
    return acc
  }, {} as Record<string, unknown>)

  const storefrontFeatures = resolveStorefrontFeaturesSettings(
    layoutSettingsMap.storefront_features
  )
  const promoPopup = resolvePromoPopup(layoutSettingsMap.promo_popup)

  return (
    <WishlistProvider>
      <QuickViewProvider>
        <div className="flex min-h-screen flex-col">
          <Header categories={categories || []} />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <QuickViewPanel />
        <WishlistSheet />
        <PromoPopup content={promoPopup} />
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

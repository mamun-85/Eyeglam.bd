import type { Metadata } from "next"
import { CheckoutForm } from "@/components/store/checkout-form"
import { createClient } from "@/lib/supabase/server"
import { DEFAULT_SHIPPING_INFO, resolveShippingInfo } from "@/lib/site-settings"

export const metadata: Metadata = {
  title: "Checkout | Eyeglam",
  description: "Complete your order at Eyeglam",
}

export default async function CheckoutPage() {
  const supabase = await createClient()
  const { data: shippingSetting } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "shipping_info")
    .maybeSingle()

  const shippingInfo = shippingSetting?.value
    ? resolveShippingInfo(shippingSetting.value)
    : DEFAULT_SHIPPING_INFO

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Checkout
      </h1>
      <CheckoutForm shippingInfo={shippingInfo} />
    </div>
  )
}

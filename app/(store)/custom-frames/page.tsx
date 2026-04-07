import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { CustomFrameBuilder } from "@/components/store/custom-frame-builder"
import {
  DEFAULT_CUSTOM_FRAME_BUILDER,
  resolveCustomFrameBuilderSettings,
} from "@/lib/site-settings"

export const metadata: Metadata = {
  title: "Custom Frames & Lenses | Eyeglam",
  description: "Build your own eyewear with custom frame and lens options.",
}

export default async function CustomFramesPage() {
  const supabase = await createClient()

  const [{ data: frames }, { data: customBuilderSetting }] = await Promise.all([
    supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .gt("stock_quantity", 0)
      .order("created_at", { ascending: false }),
    supabase
      .from("site_settings")
      .select("value")
      .eq("key", "custom_frame_builder")
      .maybeSingle(),
  ])

  const customBuilder = customBuilderSetting?.value
    ? resolveCustomFrameBuilderSettings(customBuilderSetting.value)
    : DEFAULT_CUSTOM_FRAME_BUILDER

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Custom Frames & Lenses
      </h1>
      <p className="mt-3 max-w-3xl text-muted-foreground">
        Choose your favorite frame and configure lens type with optional upgrades.
        Total price updates instantly based on your selections.
      </p>

      <div className="mt-8">
        <CustomFrameBuilder
          frames={frames || []}
          lensOptions={customBuilder.lens_options}
          addOnOptions={customBuilder.add_on_options}
        />
      </div>
    </div>
  )
}

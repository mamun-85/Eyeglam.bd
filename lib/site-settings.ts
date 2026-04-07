export interface ShippingInfoSettings {
  free_shipping_threshold: number
  inside_dhaka_shipping: number
  outside_dhaka_shipping: number
}

export interface PricedOption {
  name: string
  price: number
}

export interface CustomFrameBuilderSettings {
  lens_options: PricedOption[]
  add_on_options: PricedOption[]
}

export const DEFAULT_SHIPPING_INFO: ShippingInfoSettings = {
  free_shipping_threshold: 1000,
  inside_dhaka_shipping: 80,
  outside_dhaka_shipping: 150,
}

export const DEFAULT_CUSTOM_FRAME_BUILDER: CustomFrameBuilderSettings = {
  lens_options: [
    { name: "Single Vision", price: 0 },
    { name: "Blue Cut", price: 500 },
    { name: "Photochromic", price: 1200 },
    { name: "Progressive", price: 2000 },
  ],
  add_on_options: [
    { name: "Anti-Glare Coating", price: 350 },
    { name: "Scratch Resistant Coating", price: 250 },
    { name: "UV Protection Upgrade", price: 300 },
  ],
}

export function parseSettingValue<T>(value: unknown): T | null {
  if (value == null) return null

  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T
    } catch {
      return null
    }
  }

  return value as T
}

export function resolveShippingInfo(value: unknown): ShippingInfoSettings {
  const parsed = parseSettingValue<Partial<ShippingInfoSettings> & { standard_shipping?: number }>(value) || {}

  const insideDhakaShipping =
    typeof parsed.inside_dhaka_shipping === "number"
      ? parsed.inside_dhaka_shipping
      : typeof parsed.standard_shipping === "number"
        ? parsed.standard_shipping
        : DEFAULT_SHIPPING_INFO.inside_dhaka_shipping

  const outsideDhakaShipping =
    typeof parsed.outside_dhaka_shipping === "number"
      ? parsed.outside_dhaka_shipping
      : DEFAULT_SHIPPING_INFO.outside_dhaka_shipping

  return {
    free_shipping_threshold:
      typeof parsed.free_shipping_threshold === "number"
        ? parsed.free_shipping_threshold
        : DEFAULT_SHIPPING_INFO.free_shipping_threshold,
    inside_dhaka_shipping: insideDhakaShipping,
    outside_dhaka_shipping: outsideDhakaShipping,
  }
}

export function parsePricedOptionsInput(input: string): PricedOption[] {
  return input
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [namePart, pricePart] = line.split("|")
      const name = (namePart || "").trim()
      const price = Number((pricePart || "0").trim())
      if (!name || Number.isNaN(price) || price < 0) {
        return null
      }
      return { name, price }
    })
    .filter((item): item is PricedOption => item !== null)
}

export function pricedOptionsToInput(options: PricedOption[]): string {
  return options.map((item) => `${item.name}|${item.price}`).join("\n")
}

export function resolveCustomFrameBuilderSettings(value: unknown): CustomFrameBuilderSettings {
  const parsed = parseSettingValue<Partial<CustomFrameBuilderSettings>>(value) || {}

  const lensOptions =
    Array.isArray(parsed.lens_options) && parsed.lens_options.length > 0
      ? parsed.lens_options.filter(
          (item): item is PricedOption =>
            typeof item?.name === "string" && typeof item?.price === "number",
        )
      : DEFAULT_CUSTOM_FRAME_BUILDER.lens_options

  const addOnOptions =
    Array.isArray(parsed.add_on_options) && parsed.add_on_options.length > 0
      ? parsed.add_on_options.filter(
          (item): item is PricedOption =>
            typeof item?.name === "string" && typeof item?.price === "number",
        )
      : DEFAULT_CUSTOM_FRAME_BUILDER.add_on_options

  return {
    lens_options: lensOptions,
    add_on_options: addOnOptions,
  }
}

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

export interface StorefrontFeaturesSettings {
  whatsapp_number: string
  whatsapp_message_template: string
  enable_whatsapp_fab: boolean
  enable_mobile_bottom_nav: boolean
  enable_mobile_bottom_sheet_filters: boolean
}

export interface MarketingStat {
  value: number
  suffix: string
  label: string
  description: string
}

export interface MarketingContentSettings {
  brand_promise: {
    enabled: boolean
    eyebrow: string
    heading: string
    heading_highlight: string
    description: string
    badges: string[]
    stats: MarketingStat[]
  }
  style_guide: {
    enabled: boolean
    eyebrow: string
    heading: string
    description: string
    cta_label: string
  }
  newsletter: {
    enabled: boolean
    eyebrow: string
    heading: string
    heading_highlight: string
    description: string
    benefits: string[]
    subscriber_count: string
  }
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

export const DEFAULT_STOREFRONT_FEATURES: StorefrontFeaturesSettings = {
  whatsapp_number: "8801317910996",
  whatsapp_message_template: "Hi EyeGlam! I'm interested in {product} - {link}.",
  enable_whatsapp_fab: true,
  enable_mobile_bottom_nav: true,
  enable_mobile_bottom_sheet_filters: true,
}

export const DEFAULT_MARKETING_CONTENT: MarketingContentSettings = {
  brand_promise: {
    enabled: true,
    eyebrow: "Why EyeGlam",
    heading: "Premium Eyewear,",
    heading_highlight: "Crafted for You",
    description:
      "At EyeGlam, we believe everyone deserves luxury eyewear without the luxury price tag. Every frame is handpicked for quality, comfort, and style that speaks to the modern Bangladeshi lifestyle.",
    badges: [
      "Free Shipping Inside Dhaka",
      "Premium Quality Guaranteed",
      "WhatsApp Support",
    ],
    stats: [
      { value: 10000, suffix: "+", label: "Happy Customers", description: "Trusted by eyewear lovers across Bangladesh" },
      { value: 500, suffix: "+", label: "Frame Styles", description: "Curated collection for every face shape" },
      { value: 100, suffix: "%", label: "UV Protection", description: "Premium UV400 lenses on every pair" },
      { value: 5, suffix: "★", label: "Customer Rating", description: "Consistently rated excellent quality" },
    ],
  },
  style_guide: {
    enabled: true,
    eyebrow: "Style Guide",
    heading: "Find Your Perfect Frame",
    description:
      "Not sure which frames suit you best? Match your face shape to the ideal frame style for a look that's uniquely yours.",
    cta_label: "Browse All Frames",
  },
  newsletter: {
    enabled: true,
    eyebrow: "Stay in the Loop",
    heading: "Get Exclusive Drops &",
    heading_highlight: "Special Offers",
    description:
      "Join our inner circle of style-conscious eyewear lovers. We promise only the good stuff — no spam, ever.",
    benefits: [
      "Exclusive deals & early access",
      "New arrival alerts",
      "Style tips & trends",
      "Special occasion reminders",
    ],
    subscriber_count: "2,500+",
  },
}

export interface GalleryItem {
  image: string
  link: string
  caption: string
}

export interface MarketingGallerySettings {
  enabled: boolean
  eyebrow: string
  heading: string
  subheading: string
  items: GalleryItem[]
}

export interface PromoPopupSettings {
  enabled: boolean
  image: string
  link: string
  heading: string
  subheading: string
  cta_label: string
}

export const DEFAULT_MARKETING_GALLERY: MarketingGallerySettings = {
  enabled: true,
  eyebrow: "Lookbook",
  heading: "Seen on EyeGlam",
  subheading: "Real frames, real style. Tap any look to shop it.",
  items: [],
}

export const DEFAULT_PROMO_POPUP: PromoPopupSettings = {
  enabled: false,
  image: "",
  link: "/products",
  heading: "",
  subheading: "",
  cta_label: "Shop Now",
}

export function parseGalleryInput(input: string): GalleryItem[] {
  return input
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [image, link, caption] = line.split("|").map((p) => (p || "").trim())
      if (!image) return null
      return { image, link: link || "", caption: caption || "" }
    })
    .filter((item): item is GalleryItem => item !== null)
}

export function galleryToInput(items: GalleryItem[]): string {
  return items.map((i) => `${i.image}|${i.link}|${i.caption}`).join("\n")
}

export function resolveMarketingGallery(value: unknown): MarketingGallerySettings {
  const parsed = parseSettingValue<Partial<MarketingGallerySettings>>(value) || {}
  const d = DEFAULT_MARKETING_GALLERY
  const items =
    Array.isArray(parsed.items)
      ? parsed.items.filter(
          (i): i is GalleryItem => typeof i?.image === "string" && i.image.trim().length > 0,
        )
      : d.items
  return {
    enabled: typeof parsed.enabled === "boolean" ? parsed.enabled : d.enabled,
    eyebrow: typeof parsed.eyebrow === "string" && parsed.eyebrow.trim() ? parsed.eyebrow : d.eyebrow,
    heading: typeof parsed.heading === "string" && parsed.heading.trim() ? parsed.heading : d.heading,
    subheading: typeof parsed.subheading === "string" && parsed.subheading.trim() ? parsed.subheading : d.subheading,
    items,
  }
}

export function resolvePromoPopup(value: unknown): PromoPopupSettings {
  const parsed = parseSettingValue<Partial<PromoPopupSettings>>(value) || {}
  const d = DEFAULT_PROMO_POPUP
  return {
    enabled: typeof parsed.enabled === "boolean" ? parsed.enabled : d.enabled,
    image: typeof parsed.image === "string" ? parsed.image : d.image,
    link: typeof parsed.link === "string" && parsed.link.trim() ? parsed.link : d.link,
    heading: typeof parsed.heading === "string" ? parsed.heading : d.heading,
    subheading: typeof parsed.subheading === "string" ? parsed.subheading : d.subheading,
    cta_label: typeof parsed.cta_label === "string" && parsed.cta_label.trim() ? parsed.cta_label : d.cta_label,
  }
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

export function parseLinesInput(input: string): string[] {
  return input
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
}

export function linesToInput(lines: string[]): string {
  return lines.join("\n")
}

export function parseStatsInput(input: string): MarketingStat[] {
  return input
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [valuePart, suffixPart, labelPart, descPart] = line.split("|")
      const value = Number((valuePart || "0").trim())
      const label = (labelPart || "").trim()
      if (Number.isNaN(value) || !label) return null
      return {
        value,
        suffix: (suffixPart || "").trim(),
        label,
        description: (descPart || "").trim(),
      }
    })
    .filter((item): item is MarketingStat => item !== null)
}

export function statsToInput(stats: MarketingStat[]): string {
  return stats
    .map((s) => `${s.value}|${s.suffix}|${s.label}|${s.description}`)
    .join("\n")
}

function resolveString(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value : fallback
}

function resolveBool(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback
}

function resolveStringList(value: unknown, fallback: string[]): string[] {
  return Array.isArray(value) && value.length > 0
    ? value.filter((v): v is string => typeof v === "string" && v.trim().length > 0)
    : fallback
}

export function resolveMarketingContent(value: unknown): MarketingContentSettings {
  type DeepPartial = {
    brand_promise?: Partial<MarketingContentSettings["brand_promise"]>
    style_guide?: Partial<MarketingContentSettings["style_guide"]>
    newsletter?: Partial<MarketingContentSettings["newsletter"]>
  }
  const parsed = parseSettingValue<DeepPartial>(value) || {}
  const bp = parsed.brand_promise || {}
  const sg = parsed.style_guide || {}
  const nl = parsed.newsletter || {}
  const d = DEFAULT_MARKETING_CONTENT

  const stats =
    Array.isArray(bp.stats) && bp.stats.length > 0
      ? bp.stats.filter(
          (s): s is MarketingStat =>
            typeof s?.value === "number" && typeof s?.label === "string",
        )
      : d.brand_promise.stats

  return {
    brand_promise: {
      enabled: resolveBool(bp.enabled, d.brand_promise.enabled),
      eyebrow: resolveString(bp.eyebrow, d.brand_promise.eyebrow),
      heading: resolveString(bp.heading, d.brand_promise.heading),
      heading_highlight: resolveString(bp.heading_highlight, d.brand_promise.heading_highlight),
      description: resolveString(bp.description, d.brand_promise.description),
      badges: resolveStringList(bp.badges, d.brand_promise.badges),
      stats,
    },
    style_guide: {
      enabled: resolveBool(sg.enabled, d.style_guide.enabled),
      eyebrow: resolveString(sg.eyebrow, d.style_guide.eyebrow),
      heading: resolveString(sg.heading, d.style_guide.heading),
      description: resolveString(sg.description, d.style_guide.description),
      cta_label: resolveString(sg.cta_label, d.style_guide.cta_label),
    },
    newsletter: {
      enabled: resolveBool(nl.enabled, d.newsletter.enabled),
      eyebrow: resolveString(nl.eyebrow, d.newsletter.eyebrow),
      heading: resolveString(nl.heading, d.newsletter.heading),
      heading_highlight: resolveString(nl.heading_highlight, d.newsletter.heading_highlight),
      description: resolveString(nl.description, d.newsletter.description),
      benefits: resolveStringList(nl.benefits, d.newsletter.benefits),
      subscriber_count: resolveString(nl.subscriber_count, d.newsletter.subscriber_count),
    },
  }
}

export function resolveStorefrontFeaturesSettings(value: unknown): StorefrontFeaturesSettings {
  const parsed = parseSettingValue<Partial<StorefrontFeaturesSettings>>(value) || {}

  return {
    whatsapp_number:
      typeof parsed.whatsapp_number === "string" && parsed.whatsapp_number.trim()
        ? parsed.whatsapp_number.trim()
        : DEFAULT_STOREFRONT_FEATURES.whatsapp_number,
    whatsapp_message_template:
      typeof parsed.whatsapp_message_template === "string" && parsed.whatsapp_message_template.trim()
        ? parsed.whatsapp_message_template.trim()
        : DEFAULT_STOREFRONT_FEATURES.whatsapp_message_template,
    enable_whatsapp_fab:
      typeof parsed.enable_whatsapp_fab === "boolean"
        ? parsed.enable_whatsapp_fab
        : DEFAULT_STOREFRONT_FEATURES.enable_whatsapp_fab,
    enable_mobile_bottom_nav:
      typeof parsed.enable_mobile_bottom_nav === "boolean"
        ? parsed.enable_mobile_bottom_nav
        : DEFAULT_STOREFRONT_FEATURES.enable_mobile_bottom_nav,
    enable_mobile_bottom_sheet_filters:
      typeof parsed.enable_mobile_bottom_sheet_filters === "boolean"
        ? parsed.enable_mobile_bottom_sheet_filters
        : DEFAULT_STOREFRONT_FEATURES.enable_mobile_bottom_sheet_filters,
  }
}

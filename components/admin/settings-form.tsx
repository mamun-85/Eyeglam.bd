"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { createClient } from "@/lib/supabase/client"
import {
  resolveShippingInfo,
  parseSettingValue,
  parsePricedOptionsInput,
  pricedOptionsToInput,
  resolveCustomFrameBuilderSettings,
  resolveStorefrontFeaturesSettings,
  resolveMarketingContent,
  parseLinesInput,
  linesToInput,
  parseStatsInput,
  statsToInput,
  resolveMarketingGallery,
  parseGalleryInput,
  galleryToInput,
  resolvePromoPopup,
} from "@/lib/site-settings"

interface SettingsFormProps {
  settings: Record<string, unknown>
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const shippingInfo = resolveShippingInfo(settings.shipping_info)
  const socialLinks = parseSettingValue<{ instagram?: string; facebook?: string; twitter?: string }>(settings.social_links) || {}
  const customFrameBuilder = resolveCustomFrameBuilderSettings(settings.custom_frame_builder)
  const storefrontFeatures = resolveStorefrontFeaturesSettings(settings.storefront_features)
  const marketing = resolveMarketingContent(settings.marketing_content)
  const gallery = resolveMarketingGallery(settings.marketing_gallery)
  const promo = resolvePromoPopup(settings.promo_popup)

  const [formData, setFormData] = useState({
    site_name: (settings.site_name as string) || "Eyeglam",
    site_tagline: (settings.site_tagline as string) || "",
    site_description: (settings.site_description as string) || "",
    contact_email: (settings.contact_email as string) || "",
    contact_phone: (settings.contact_phone as string) || "",
    instagram: socialLinks.instagram || "",
    facebook: socialLinks.facebook || "",
    twitter: socialLinks.twitter || "",
    free_shipping_threshold: shippingInfo.free_shipping_threshold.toString(),
    inside_dhaka_shipping: shippingInfo.inside_dhaka_shipping.toString(),
    outside_dhaka_shipping: shippingInfo.outside_dhaka_shipping.toString(),
    custom_lens_options: pricedOptionsToInput(customFrameBuilder.lens_options),
    custom_add_on_options: pricedOptionsToInput(customFrameBuilder.add_on_options),
    whatsapp_number: storefrontFeatures.whatsapp_number,
    whatsapp_message_template: storefrontFeatures.whatsapp_message_template,
    enable_whatsapp_fab: storefrontFeatures.enable_whatsapp_fab,
    enable_mobile_bottom_nav: storefrontFeatures.enable_mobile_bottom_nav,
    enable_mobile_bottom_sheet_filters: storefrontFeatures.enable_mobile_bottom_sheet_filters,
    // Marketing — Brand Promise
    bp_enabled: marketing.brand_promise.enabled,
    bp_eyebrow: marketing.brand_promise.eyebrow,
    bp_heading: marketing.brand_promise.heading,
    bp_heading_highlight: marketing.brand_promise.heading_highlight,
    bp_description: marketing.brand_promise.description,
    bp_badges: linesToInput(marketing.brand_promise.badges),
    bp_stats: statsToInput(marketing.brand_promise.stats),
    // Marketing — Style Guide
    sg_enabled: marketing.style_guide.enabled,
    sg_eyebrow: marketing.style_guide.eyebrow,
    sg_heading: marketing.style_guide.heading,
    sg_description: marketing.style_guide.description,
    sg_cta_label: marketing.style_guide.cta_label,
    // Marketing — Newsletter
    nl_enabled: marketing.newsletter.enabled,
    nl_eyebrow: marketing.newsletter.eyebrow,
    nl_heading: marketing.newsletter.heading,
    nl_heading_highlight: marketing.newsletter.heading_highlight,
    nl_description: marketing.newsletter.description,
    nl_benefits: linesToInput(marketing.newsletter.benefits),
    nl_subscriber_count: marketing.newsletter.subscriber_count,
    // Marketing — Lookbook Gallery
    gallery_enabled: gallery.enabled,
    gallery_eyebrow: gallery.eyebrow,
    gallery_heading: gallery.heading,
    gallery_subheading: gallery.subheading,
    gallery_items: galleryToInput(gallery.items),
    // Promo Popup
    promo_enabled: promo.enabled,
    promo_image: promo.image,
    promo_link: promo.link,
    promo_heading: promo.heading,
    promo_subheading: promo.subheading,
    promo_cta_label: promo.cta_label,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSuccess(false)

    const supabase = createClient()

    const updates = [
      { key: "site_name", value: JSON.stringify(formData.site_name) },
      { key: "site_tagline", value: JSON.stringify(formData.site_tagline) },
      { key: "site_description", value: JSON.stringify(formData.site_description) },
      { key: "contact_email", value: JSON.stringify(formData.contact_email) },
      { key: "contact_phone", value: JSON.stringify(formData.contact_phone) },
      {
        key: "social_links",
        value: JSON.stringify({
          instagram: formData.instagram,
          facebook: formData.facebook,
          twitter: formData.twitter,
        }),
      },
      {
        key: "shipping_info",
        value: JSON.stringify({
          free_shipping_threshold: parseFloat(formData.free_shipping_threshold),
          inside_dhaka_shipping: parseFloat(formData.inside_dhaka_shipping),
          outside_dhaka_shipping: parseFloat(formData.outside_dhaka_shipping),
        }),
      },
      {
        key: "custom_frame_builder",
        value: JSON.stringify({
          lens_options: parsePricedOptionsInput(formData.custom_lens_options),
          add_on_options: parsePricedOptionsInput(formData.custom_add_on_options),
        }),
      },
      {
        key: "storefront_features",
        value: JSON.stringify({
          whatsapp_number: formData.whatsapp_number,
          whatsapp_message_template: formData.whatsapp_message_template,
          enable_whatsapp_fab: formData.enable_whatsapp_fab,
          enable_mobile_bottom_nav: formData.enable_mobile_bottom_nav,
          enable_mobile_bottom_sheet_filters: formData.enable_mobile_bottom_sheet_filters,
        }),
      },
      {
        key: "marketing_content",
        value: JSON.stringify({
          brand_promise: {
            enabled: formData.bp_enabled,
            eyebrow: formData.bp_eyebrow,
            heading: formData.bp_heading,
            heading_highlight: formData.bp_heading_highlight,
            description: formData.bp_description,
            badges: parseLinesInput(formData.bp_badges),
            stats: parseStatsInput(formData.bp_stats),
          },
          style_guide: {
            enabled: formData.sg_enabled,
            eyebrow: formData.sg_eyebrow,
            heading: formData.sg_heading,
            description: formData.sg_description,
            cta_label: formData.sg_cta_label,
          },
          newsletter: {
            enabled: formData.nl_enabled,
            eyebrow: formData.nl_eyebrow,
            heading: formData.nl_heading,
            heading_highlight: formData.nl_heading_highlight,
            description: formData.nl_description,
            benefits: parseLinesInput(formData.nl_benefits),
            subscriber_count: formData.nl_subscriber_count,
          },
        }),
      },
      {
        key: "marketing_gallery",
        value: JSON.stringify({
          enabled: formData.gallery_enabled,
          eyebrow: formData.gallery_eyebrow,
          heading: formData.gallery_heading,
          subheading: formData.gallery_subheading,
          items: parseGalleryInput(formData.gallery_items),
        }),
      },
      {
        key: "promo_popup",
        value: JSON.stringify({
          enabled: formData.promo_enabled,
          image: formData.promo_image,
          link: formData.promo_link,
          heading: formData.promo_heading,
          subheading: formData.promo_subheading,
          cta_label: formData.promo_cta_label,
        }),
      },
    ]

    try {
      for (const update of updates) {
        await supabase
          .from("site_settings")
          .upsert({ key: update.key, value: update.value }, { onConflict: "key" })
      }

      setSuccess(true)
      router.refresh()
    } catch (err) {
      console.error("Error saving settings:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
          <CardDescription>Basic store information</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="site_name">Store Name</Label>
            <Input
              id="site_name"
              value={formData.site_name}
              onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="site_tagline">Tagline</Label>
            <Input
              id="site_tagline"
              value={formData.site_tagline}
              onChange={(e) => setFormData({ ...formData, site_tagline: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="site_description">Description</Label>
            <Textarea
              id="site_description"
              value={formData.site_description}
              onChange={(e) => setFormData({ ...formData, site_description: e.target.value })}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact</CardTitle>
          <CardDescription>Contact information</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="contact_email">Email</Label>
            <Input
              id="contact_email"
              type="email"
              value={formData.contact_email}
              onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="contact_phone">Phone</Label>
            <Input
              id="contact_phone"
              value={formData.contact_phone}
              onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Social Media</CardTitle>
          <CardDescription>Social media links</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="instagram">Instagram URL</Label>
            <Input
              id="instagram"
              value={formData.instagram}
              onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="facebook">Facebook URL</Label>
            <Input
              id="facebook"
              value={formData.facebook}
              onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="twitter">Twitter URL</Label>
            <Input
              id="twitter"
              value={formData.twitter}
              onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Storefront Features</CardTitle>
          <CardDescription>
            Configure WhatsApp and mobile UX feature toggles.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="whatsapp_number">WhatsApp Number (international format)</Label>
            <Input
              id="whatsapp_number"
              value={formData.whatsapp_number}
              onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
              placeholder="8801317910996"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="whatsapp_message_template">WhatsApp Message Template</Label>
            <Textarea
              id="whatsapp_message_template"
              value={formData.whatsapp_message_template}
              onChange={(e) => setFormData({ ...formData, whatsapp_message_template: e.target.value })}
              rows={3}
              placeholder="Hi EyeGlam! I'm interested in {product} - {link}."
            />
            <p className="text-xs text-muted-foreground">
              Available tokens: {"{product}"}, {"{link}"}
            </p>
          </div>
          <div className="grid gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={formData.enable_whatsapp_fab}
                onChange={(e) => setFormData({ ...formData, enable_whatsapp_fab: e.target.checked })}
              />
              Enable WhatsApp floating action button
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={formData.enable_mobile_bottom_nav}
                onChange={(e) => setFormData({ ...formData, enable_mobile_bottom_nav: e.target.checked })}
              />
              Enable mobile sticky bottom navigation
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={formData.enable_mobile_bottom_sheet_filters}
                onChange={(e) =>
                  setFormData({ ...formData, enable_mobile_bottom_sheet_filters: e.target.checked })
                }
              />
              Enable mobile bottom-sheet filters/search
            </label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Shipping</CardTitle>
          <CardDescription>Shipping configuration</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="free_shipping_threshold">Free Shipping Threshold (BDT)</Label>
              <Input
                id="free_shipping_threshold"
                type="number"
                step="0.01"
                value={formData.free_shipping_threshold}
                onChange={(e) => setFormData({ ...formData, free_shipping_threshold: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="inside_dhaka_shipping">Inside Dhaka Shipping (BDT)</Label>
              <Input
                id="inside_dhaka_shipping"
                type="number"
                step="0.01"
                value={formData.inside_dhaka_shipping}
                onChange={(e) => setFormData({ ...formData, inside_dhaka_shipping: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="outside_dhaka_shipping">Outside Dhaka Shipping (BDT)</Label>
              <Input
                id="outside_dhaka_shipping"
                type="number"
                step="0.01"
                value={formData.outside_dhaka_shipping}
                onChange={(e) => setFormData({ ...formData, outside_dhaka_shipping: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Custom Frames & Lenses</CardTitle>
          <CardDescription>
            Manage selectable lens and add-on options with pricing.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="custom_lens_options">Lens Options (one per line: Name|Price)</Label>
            <Textarea
              id="custom_lens_options"
              value={formData.custom_lens_options}
              onChange={(e) => setFormData({ ...formData, custom_lens_options: e.target.value })}
              rows={6}
              placeholder={"Single Vision|0\nBlue Cut|500\nPhotochromic|1200"}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="custom_add_on_options">Add-on Options (one per line: Name|Price)</Label>
            <Textarea
              id="custom_add_on_options"
              value={formData.custom_add_on_options}
              onChange={(e) => setFormData({ ...formData, custom_add_on_options: e.target.value })}
              rows={6}
              placeholder={"Anti-Glare Coating|350\nScratch Resistant Coating|250"}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Homepage Marketing Sections</CardTitle>
          <CardDescription>
            Edit the copy for the Brand Promise, Style Guide, and Newsletter sections — or hide them entirely.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-8">
          {/* Brand Promise */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Brand Promise</h3>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={formData.bp_enabled}
                  onChange={(e) => setFormData({ ...formData, bp_enabled: e.target.checked })}
                />
                Show section
              </label>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bp_eyebrow">Eyebrow / Label</Label>
              <Input
                id="bp_eyebrow"
                value={formData.bp_eyebrow}
                onChange={(e) => setFormData({ ...formData, bp_eyebrow: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="bp_heading">Heading</Label>
                <Input
                  id="bp_heading"
                  value={formData.bp_heading}
                  onChange={(e) => setFormData({ ...formData, bp_heading: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bp_heading_highlight">Heading Highlight (gold)</Label>
                <Input
                  id="bp_heading_highlight"
                  value={formData.bp_heading_highlight}
                  onChange={(e) => setFormData({ ...formData, bp_heading_highlight: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bp_description">Description</Label>
              <Textarea
                id="bp_description"
                value={formData.bp_description}
                onChange={(e) => setFormData({ ...formData, bp_description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bp_badges">Trust Badges (one per line)</Label>
              <Textarea
                id="bp_badges"
                value={formData.bp_badges}
                onChange={(e) => setFormData({ ...formData, bp_badges: e.target.value })}
                rows={3}
                placeholder={"Free Shipping Inside Dhaka\nPremium Quality Guaranteed"}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bp_stats">Stats (one per line: Value|Suffix|Label|Description)</Label>
              <Textarea
                id="bp_stats"
                value={formData.bp_stats}
                onChange={(e) => setFormData({ ...formData, bp_stats: e.target.value })}
                rows={5}
                placeholder={"10000|+|Happy Customers|Trusted across Bangladesh\n500|+|Frame Styles|For every face shape"}
              />
              <p className="text-xs text-muted-foreground">
                Value must be a number (it animates). Suffix examples: +, %, ★
              </p>
            </div>
          </div>

          {/* Style Guide */}
          <div className="flex flex-col gap-4 border-t border-border pt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Style Guide</h3>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={formData.sg_enabled}
                  onChange={(e) => setFormData({ ...formData, sg_enabled: e.target.checked })}
                />
                Show section
              </label>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sg_eyebrow">Eyebrow / Label</Label>
              <Input
                id="sg_eyebrow"
                value={formData.sg_eyebrow}
                onChange={(e) => setFormData({ ...formData, sg_eyebrow: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sg_heading">Heading</Label>
              <Input
                id="sg_heading"
                value={formData.sg_heading}
                onChange={(e) => setFormData({ ...formData, sg_heading: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sg_description">Description</Label>
              <Textarea
                id="sg_description"
                value={formData.sg_description}
                onChange={(e) => setFormData({ ...formData, sg_description: e.target.value })}
                rows={2}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sg_cta_label">Button Label</Label>
              <Input
                id="sg_cta_label"
                value={formData.sg_cta_label}
                onChange={(e) => setFormData({ ...formData, sg_cta_label: e.target.value })}
              />
            </div>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col gap-4 border-t border-border pt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Newsletter</h3>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={formData.nl_enabled}
                  onChange={(e) => setFormData({ ...formData, nl_enabled: e.target.checked })}
                />
                Show section
              </label>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="nl_eyebrow">Eyebrow / Label</Label>
              <Input
                id="nl_eyebrow"
                value={formData.nl_eyebrow}
                onChange={(e) => setFormData({ ...formData, nl_eyebrow: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="nl_heading">Heading</Label>
                <Input
                  id="nl_heading"
                  value={formData.nl_heading}
                  onChange={(e) => setFormData({ ...formData, nl_heading: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="nl_heading_highlight">Heading Highlight (gold)</Label>
                <Input
                  id="nl_heading_highlight"
                  value={formData.nl_heading_highlight}
                  onChange={(e) => setFormData({ ...formData, nl_heading_highlight: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="nl_description">Description</Label>
              <Textarea
                id="nl_description"
                value={formData.nl_description}
                onChange={(e) => setFormData({ ...formData, nl_description: e.target.value })}
                rows={2}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="nl_benefits">Benefits (one per line)</Label>
              <Textarea
                id="nl_benefits"
                value={formData.nl_benefits}
                onChange={(e) => setFormData({ ...formData, nl_benefits: e.target.value })}
                rows={4}
                placeholder={"Exclusive deals & early access\nNew arrival alerts"}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="nl_subscriber_count">Subscriber Count (social proof)</Label>
              <Input
                id="nl_subscriber_count"
                value={formData.nl_subscriber_count}
                onChange={(e) => setFormData({ ...formData, nl_subscriber_count: e.target.value })}
                placeholder="2,500+"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lookbook Gallery (Image Showcase)</CardTitle>
          <CardDescription>
            An image-based section on the homepage to showcase products and customer looks. Leave images empty to auto-show your top products.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={formData.gallery_enabled}
              onChange={(e) => setFormData({ ...formData, gallery_enabled: e.target.checked })}
            />
            Show section on homepage
          </label>
          <div className="grid gap-2">
            <Label htmlFor="gallery_eyebrow">Eyebrow / Label</Label>
            <Input
              id="gallery_eyebrow"
              value={formData.gallery_eyebrow}
              onChange={(e) => setFormData({ ...formData, gallery_eyebrow: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="gallery_heading">Heading</Label>
            <Input
              id="gallery_heading"
              value={formData.gallery_heading}
              onChange={(e) => setFormData({ ...formData, gallery_heading: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="gallery_subheading">Subheading</Label>
            <Input
              id="gallery_subheading"
              value={formData.gallery_subheading}
              onChange={(e) => setFormData({ ...formData, gallery_subheading: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="gallery_items">
              Images (one per line: ImageURL|Link|Caption)
            </Label>
            <Textarea
              id="gallery_items"
              value={formData.gallery_items}
              onChange={(e) => setFormData({ ...formData, gallery_items: e.target.value })}
              rows={6}
              placeholder={"https://.../look1.jpg|/products/aviator-classic|Summer Vibes\nhttps://.../customer1.jpg||Happy Customer"}
            />
            <p className="text-xs text-muted-foreground">
              Up to 6 images shown. Link and Caption are optional (leave blank but keep the | separators). First image displays larger.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Promotional Popup</CardTitle>
          <CardDescription>
            A lightweight image popup shown once per visit. Great for offers and announcements.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={formData.promo_enabled}
              onChange={(e) => setFormData({ ...formData, promo_enabled: e.target.checked })}
            />
            Enable popup (requires an image URL below)
          </label>
          <div className="grid gap-2">
            <Label htmlFor="promo_image">Image URL</Label>
            <Input
              id="promo_image"
              value={formData.promo_image}
              onChange={(e) => setFormData({ ...formData, promo_image: e.target.value })}
              placeholder="https://.../promo.jpg"
            />
            <p className="text-xs text-muted-foreground">
              Recommended portrait (4:5). Upload to your image host / Supabase storage and paste the public URL.
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="promo_link">Link (where the popup leads)</Label>
            <Input
              id="promo_link"
              value={formData.promo_link}
              onChange={(e) => setFormData({ ...formData, promo_link: e.target.value })}
              placeholder="/products"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="promo_heading">Heading (optional)</Label>
              <Input
                id="promo_heading"
                value={formData.promo_heading}
                onChange={(e) => setFormData({ ...formData, promo_heading: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="promo_cta_label">Button Label</Label>
              <Input
                id="promo_cta_label"
                value={formData.promo_cta_label}
                onChange={(e) => setFormData({ ...formData, promo_cta_label: e.target.value })}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="promo_subheading">Subheading (optional)</Label>
            <Input
              id="promo_subheading"
              value={formData.promo_subheading}
              onChange={(e) => setFormData({ ...formData, promo_subheading: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {success && (
        <p className="text-sm text-green-600">Settings saved successfully!</p>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-fit">
        {isSubmitting && <Spinner className="mr-2" />}
        Save Settings
      </Button>
    </form>
  )
}

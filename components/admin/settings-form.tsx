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

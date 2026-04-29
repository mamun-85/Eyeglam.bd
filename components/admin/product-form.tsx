"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { Upload, Plus, Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { uploadImageAndGetPublicUrl } from "@/lib/supabase/upload"
import type { Category, Product } from "@/lib/types"

interface FrameShapeOption {
  id: string
  slug: string
  label: string
}

interface VariantDraft {
  id: string
  color_name: string
  color_hex: string
  stock: string
  images: string
  uploading: boolean
}

interface ProductFormProps {
  product?: Product
  categories: Category[]
  frameShapes: FrameShapeOption[]
  initialVariants?: Array<{
    id: string
    color_name: string
    color_hex: string
    stock: number
    images: string[]
  }>
}

export function ProductForm({
  product,
  categories,
  frameShapes,
  initialVariants = [],
}: ProductFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    price: product?.price?.toString() || "",
    sale_price: product?.sale_price?.toString() || "",
    category_id: product?.category_id || "",
    shape_id: product?.shape_id || "",
    features: product?.features?.join("\n") || "",
    stock_quantity: product?.stock_quantity?.toString() || "0",
    is_featured: product?.is_featured || false,
    is_active: product?.is_active ?? true,
  })
  const [variants, setVariants] = useState<VariantDraft[]>(
    initialVariants.length > 0
      ? initialVariants.map((v) => ({
          id: v.id,
          color_name: v.color_name,
          color_hex: v.color_hex,
          stock: String(v.stock),
          images: v.images.join("\n"),
          uploading: false,
        }))
      : [
          {
            id: crypto.randomUUID(),
            color_name: "",
            color_hex: "#111111",
            stock: "0",
            images: "",
            uploading: false,
          },
        ]
  )

  const generateSlug = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

  const getErrorMessage = (err: unknown) => {
    if (!err) return "Unknown error"
    if (err instanceof Error) return err.message
    if (typeof err === "string") return err
    if (typeof err === "object") {
      const anyErr = err as Record<string, unknown>
      if (typeof anyErr.message === "string") return anyErr.message
      if (typeof anyErr.error_description === "string") return anyErr.error_description
      if (typeof anyErr.details === "string") return anyErr.details
      try {
        return JSON.stringify(anyErr)
      } catch {
        return "Unknown object error"
      }
    }
    return "Unknown error"
  }

  const updateVariant = (id: string, patch: Partial<VariantDraft>) => {
    setVariants((prev) => prev.map((v) => (v.id === id ? { ...v, ...patch } : v)))
  }

  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        color_name: "",
        color_hex: "#111111",
        stock: "0",
        images: "",
        uploading: false,
      },
    ])
  }

  const removeVariant = (id: string) => {
    setVariants((prev) => (prev.length > 1 ? prev.filter((v) => v.id !== id) : prev))
  }

  const handleVariantImageUpload = async (
    variantId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files
    if (!files?.length) return
    updateVariant(variantId, { uploading: true })
    try {
      const urls: string[] = []
      for (const file of Array.from(files)) {
        const url = await uploadImageAndGetPublicUrl(file, "products/variants")
        urls.push(url)
      }
      const current = variants.find((v) => v.id === variantId)?.images || ""
      updateVariant(variantId, {
        images: [current, ...urls].filter(Boolean).join("\n"),
        uploading: false,
      })
    } catch (err) {
      console.error("Variant image upload failed:", err)
      setError(err instanceof Error ? err.message : "Variant upload failed.")
      updateVariant(variantId, { uploading: false })
    } finally {
      e.target.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    const supabase = createClient()

    const variantImagesFlattened = variants
      .flatMap((variant) =>
        variant.images
          .split("\n")
          .map((url) => url.trim())
          .filter(Boolean)
      )
    const primaryImage = variantImagesFlattened[0] || null
    const normalizedVariants = variants
      .filter((variant) => variant.color_name.trim())
      .map((variant) => {
        const imageList = variant.images
          .split("\n")
          .map((url) => url.trim())
          .filter(Boolean)
        return {
          color_name: variant.color_name.trim(),
          color_hex: variant.color_hex || "#111111",
          image_url: imageList[0] || primaryImage || "/placeholder.svg",
          stock: parseInt(variant.stock) || 0,
          images: imageList,
        }
      })
    const aggregatedStock = normalizedVariants.reduce((sum, variant) => sum + variant.stock, 0)
    const selectedShape = frameShapes.find(
      (shape) => shape.id === formData.shape_id || shape.slug === formData.shape_id
    )
    const isUuidShapeId = !!selectedShape?.id?.match(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    )

    const productData = {
      name: formData.name,
      slug: formData.slug || generateSlug(formData.name),
      description: formData.description || null,
      price: parseFloat(formData.price),
      sale_price: formData.sale_price ? parseFloat(formData.sale_price) : null,
      category_id: formData.category_id || null,
      shape_id: isUuidShapeId ? selectedShape?.id || null : null,
      frame_shape: selectedShape?.slug || null,
      thumbnail_url: primaryImage,
      images:
        variantImagesFlattened.length > 0
          ? variantImagesFlattened
          : (product?.images?.length ? product.images : ["/placeholder.svg"]),
      gallery_urls: variantImagesFlattened.length > 1 ? variantImagesFlattened.slice(1) : [],
      features: formData.features.split("\n").filter(Boolean),
      stock_quantity: aggregatedStock > 0 ? aggregatedStock : parseInt(formData.stock_quantity) || 0,
      is_featured: formData.is_featured,
      is_active: formData.is_active,
    }

    try {
      const saveProductWithFallback = async () => {
        const payloads: Array<Record<string, unknown>> = [
          productData,
          // Fallback for older schema without shape_id
          { ...productData, shape_id: undefined },
          // Fallback for older schema without image helper columns
          {
            ...productData,
            shape_id: undefined,
            thumbnail_url: undefined,
            gallery_urls: undefined,
          },
        ]

        let lastError: unknown = null
        for (const payload of payloads) {
          const cleanedPayload = Object.fromEntries(
            Object.entries(payload).filter(([, value]) => value !== undefined)
          )
          if (product) {
            const { error: updateError } = await supabase
              .from("products")
              .update(cleanedPayload)
              .eq("id", product.id)
            if (!updateError) return { id: product.id }
            lastError = updateError
            continue
          } else {
            const { data, error: createError } = await supabase
              .from("products")
              .insert(cleanedPayload)
              .select("id")
              .single()
            if (!createError && data?.id) return { id: data.id }
            lastError = createError
            continue
          }
        }
        throw lastError || new Error("Unable to save product with available schema")
      }

      let productId = product?.id || ""
      const saved = await saveProductWithFallback()
      if (!productId) productId = saved.id
      productId = productId || product!.id

      // Optional relational sync: if relational tables are not migrated yet,
      // keep working with legacy product fields without blocking product save.
      try {
        const { data: existingVariants } = await supabase
          .from("product_variants")
          .select("id")
          .eq("product_id", productId)
        const existingVariantIds = (existingVariants || []).map((v) => v.id)
        if (existingVariantIds.length > 0) {
          await supabase.from("product_images").delete().in("variant_id", existingVariantIds)
        }
        await supabase.from("product_variants").delete().eq("product_id", productId)

        for (const variant of normalizedVariants) {
          const { data: color, error: colorError } = await supabase
            .from("colors")
            .upsert(
              {
                color_name: variant.color_name,
                hex_code: variant.color_hex,
              },
              { onConflict: "hex_code,color_name" }
            )
            .select("id")
            .single()
          if (colorError || !color) throw colorError || new Error("Failed to save color")

          const { data: savedVariant, error: variantError } = await supabase
            .from("product_variants")
            .insert({
              product_id: productId,
              color_id: color.id,
              stock: variant.stock,
            })
            .select("id")
            .single()
          if (variantError || !savedVariant) throw variantError || new Error("Failed to save variant")

          const imageRows = variant.images.map((url, index) => ({
            variant_id: savedVariant.id,
            url,
            sort_order: index,
          }))

          if (imageRows.length > 0) {
            const { error: imageError } = await supabase.from("product_images").insert(imageRows)
            if (imageError) throw imageError
          }
        }
      } catch (relationalSyncError) {
        console.warn("Relational variant sync skipped; migration may not be applied yet.", relationalSyncError)
      }

      router.push("/admin/products")
      router.refresh()
    } catch (err) {
      const message = getErrorMessage(err)
      console.error("Error saving product:", message, err)
      setError(`Failed to save product. ${message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl">
      <div className="flex flex-col gap-6">
        <div className="grid gap-2">
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value,
                slug: formData.slug || generateSlug(e.target.value),
              })
            }
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="sale_price">Sale Price</Label>
            <Input
              id="sale_price"
              type="number"
              step="0.01"
              min="0"
              value={formData.sale_price}
              onChange={(e) => setFormData({ ...formData, sale_price: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label>Category</Label>
            <Select
              value={formData.category_id}
              onValueChange={(value) => setFormData({ ...formData, category_id: value })}
            >
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Frame Shape</Label>
            <Select
              value={formData.shape_id}
              onValueChange={(value) => setFormData({ ...formData, shape_id: value })}
            >
              <SelectTrigger><SelectValue placeholder="Select shape" /></SelectTrigger>
              <SelectContent>
                {frameShapes.map((shape) => (
                  <SelectItem key={shape.id} value={shape.id}>
                    {shape.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-3">
          <Label>Color Variants (stock + gallery)</Label>
          {variants.map((variant, index) => (
            <div key={variant.id} className="space-y-3 rounded-lg border border-border p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Variant {index + 1}</p>
                <Button type="button" variant="ghost" size="icon" onClick={() => removeVariant(variant.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 grid gap-2">
                  <Label>Color Name</Label>
                  <Input
                    value={variant.color_name}
                    onChange={(e) => updateVariant(variant.id, { color_name: e.target.value })}
                    placeholder="Matte Black"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Hex</Label>
                  <Input
                    type="color"
                    className="h-10 p-1"
                    value={variant.color_hex}
                    onChange={(e) => updateVariant(variant.id, { color_hex: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Stock</Label>
                <Input
                  type="number"
                  min="0"
                  value={variant.stock}
                  onChange={(e) => updateVariant(variant.id, { stock: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Gallery URLs (one per line)</Label>
                <Textarea
                  rows={3}
                  value={variant.images}
                  onChange={(e) => updateVariant(variant.id, { images: e.target.value })}
                />
                <div className="flex items-center gap-3">
                  <Label
                    htmlFor={`variant-upload-${variant.id}`}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-input px-3 py-2 text-sm"
                  >
                    <Upload className="h-4 w-4" />
                    {variant.uploading ? "Uploading..." : "Upload Images"}
                  </Label>
                  <Input
                    id={`variant-upload-${variant.id}`}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => handleVariantImageUpload(variant.id, e)}
                  />
                </div>
              </div>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addVariant} className="w-fit">
            <Plus className="mr-2 h-4 w-4" />
            Add Color Variant
          </Button>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="stock_quantity">Fallback Stock</Label>
          <Input
            id="stock_quantity"
            type="number"
            min="0"
            value={formData.stock_quantity}
            onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="features">Features (one per line)</Label>
          <Textarea
            id="features"
            rows={3}
            value={formData.features}
            onChange={(e) => setFormData({ ...formData, features: e.target.value })}
          />
        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
            <Label htmlFor="is_active">Active</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="is_featured"
              checked={formData.is_featured}
              onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
            />
            <Label htmlFor="is_featured">Featured</Label>
          </div>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Spinner className="mr-2" />}
            {product ? "Update Product" : "Create Product"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
            Cancel
          </Button>
        </div>
      </div>
    </form>
  )
}

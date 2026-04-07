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
import { createClient } from "@/lib/supabase/client"
import type { Product, Category } from "@/lib/types"

interface ProductFormProps {
  product?: Product
  categories: Category[]
}

export function ProductForm({ product, categories }: ProductFormProps) {
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
    images: product?.images?.join("\n") || "",
    features: product?.features?.join("\n") || "",
    stock_quantity: product?.stock_quantity?.toString() || "0",
    is_featured: product?.is_featured || false,
    is_active: product?.is_active ?? true,
  })

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const supabase = createClient()

    const productData = {
      name: formData.name,
      slug: formData.slug || generateSlug(formData.name),
      description: formData.description || null,
      price: parseFloat(formData.price),
      sale_price: formData.sale_price ? parseFloat(formData.sale_price) : null,
      category_id: formData.category_id || null,
      images: formData.images.split("\n").filter(Boolean),
      features: formData.features.split("\n").filter(Boolean),
      stock_quantity: parseInt(formData.stock_quantity) || 0,
      is_featured: formData.is_featured,
      is_active: formData.is_active,
    }

    try {
      if (product) {
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", product.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from("products").insert(productData)
        if (error) throw error
      }

      router.push("/admin/products")
      router.refresh()
    } catch (err) {
      console.error("Error saving product:", err)
      setError("Failed to save product. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <div className="flex flex-col gap-6">
        <div className="grid gap-2">
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => {
              setFormData({
                ...formData,
                name: e.target.value,
                slug: formData.slug || generateSlug(e.target.value),
              })
            }}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="slug">Slug (URL)</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="auto-generated-from-name"
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
            <Label htmlFor="sale_price">Sale Price (optional)</Label>
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
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category_id}
              onValueChange={(value) => setFormData({ ...formData, category_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
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
            <Label htmlFor="stock">Stock Quantity</Label>
            <Input
              id="stock"
              type="number"
              min="0"
              value={formData.stock_quantity}
              onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="images">Image URLs (one per line)</Label>
          <Textarea
            id="images"
            value={formData.images}
            onChange={(e) => setFormData({ ...formData, images: e.target.value })}
            rows={3}
            placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="features">Features (one per line)</Label>
          <Textarea
            id="features"
            value={formData.features}
            onChange={(e) => setFormData({ ...formData, features: e.target.value })}
            rows={3}
            placeholder="UV400 Protection&#10;Polarized Lenses&#10;Scratch Resistant"
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
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </div>
    </form>
  )
}

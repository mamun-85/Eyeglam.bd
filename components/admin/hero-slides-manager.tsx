"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { createClient } from "@/lib/supabase/client"
import type { HeroSlide } from "@/lib/types"

interface HeroSlidesManagerProps {
  initialSlides: HeroSlide[]
}

export function HeroSlidesManager({ initialSlides }: HeroSlidesManagerProps) {
  const router = useRouter()
  const [slides, setSlides] = useState(initialSlides)
  const [isOpen, setIsOpen] = useState(false)
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    image_url: "",
    button_text: "",
    button_link: "",
    is_active: true,
  })

  const resetForm = () => {
    setFormData({
      title: "",
      subtitle: "",
      image_url: "",
      button_text: "",
      button_link: "",
      is_active: true,
    })
    setEditingSlide(null)
  }

  const openEditDialog = (slide: HeroSlide) => {
    setEditingSlide(slide)
    setFormData({
      title: slide.title,
      subtitle: slide.subtitle || "",
      image_url: slide.image_url,
      button_text: slide.button_text || "",
      button_link: slide.button_link || "",
      is_active: slide.is_active,
    })
    setIsOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const supabase = createClient()
    const slideData = {
      title: formData.title,
      subtitle: formData.subtitle || null,
      image_url: formData.image_url,
      button_text: formData.button_text || null,
      button_link: formData.button_link || null,
      is_active: formData.is_active,
    }

    try {
      if (editingSlide) {
        await supabase.from("hero_slides").update(slideData).eq("id", editingSlide.id)
      } else {
        await supabase.from("hero_slides").insert(slideData)
      }

      setIsOpen(false)
      resetForm()
      router.refresh()
    } catch (err) {
      console.error("Error saving slide:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this slide?")) return

    const supabase = createClient()
    await supabase.from("hero_slides").delete().eq("id", id)
    setSlides(slides.filter((s) => s.id !== id))
    router.refresh()
  }

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm() }}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Slide
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingSlide ? "Edit Slide" : "New Slide"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="button_text">Button Text</Label>
                <Input
                  id="button_text"
                  value={formData.button_text}
                  onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="button_link">Button Link</Label>
                <Input
                  id="button_link"
                  value={formData.button_link}
                  onChange={(e) => setFormData({ ...formData, button_link: e.target.value })}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Spinner className="mr-2" />}
              {editingSlide ? "Update" : "Create"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="mt-6 grid gap-4">
        {slides.map((slide) => (
          <Card key={slide.id}>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="relative h-20 w-32 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={slide.image_url}
                    alt={slide.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{slide.title}</h3>
                  {slide.subtitle && (
                    <p className="text-sm text-muted-foreground">{slide.subtitle}</p>
                  )}
                  {!slide.is_active && (
                    <span className="text-xs text-destructive">Inactive</span>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openEditDialog(slide)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(slide.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Plus, Pencil, Trash2, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import type { Testimonial } from "@/lib/types"

interface TestimonialsManagerProps {
  initialTestimonials: Testimonial[]
}

export function TestimonialsManager({ initialTestimonials }: TestimonialsManagerProps) {
  const router = useRouter()
  const [testimonials, setTestimonials] = useState(initialTestimonials)
  const [isOpen, setIsOpen] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    content: "",
    rating: "5",
    avatar_url: "",
    is_active: true,
  })

  const resetForm = () => {
    setFormData({
      name: "",
      role: "",
      content: "",
      rating: "5",
      avatar_url: "",
      is_active: true,
    })
    setEditingTestimonial(null)
  }

  const openEditDialog = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial)
    setFormData({
      name: testimonial.name,
      role: testimonial.role || "",
      content: testimonial.content,
      rating: testimonial.rating.toString(),
      avatar_url: testimonial.avatar_url || "",
      is_active: testimonial.is_active,
    })
    setIsOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const supabase = createClient()
    const testimonialData = {
      name: formData.name,
      role: formData.role || null,
      content: formData.content,
      rating: parseInt(formData.rating),
      avatar_url: formData.avatar_url || null,
      is_active: formData.is_active,
    }

    try {
      if (editingTestimonial) {
        await supabase.from("testimonials").update(testimonialData).eq("id", editingTestimonial.id)
      } else {
        await supabase.from("testimonials").insert(testimonialData)
      }

      setIsOpen(false)
      resetForm()
      router.refresh()
    } catch (err) {
      console.error("Error saving testimonial:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return

    const supabase = createClient()
    await supabase.from("testimonials").delete().eq("id", id)
    setTestimonials(testimonials.filter((t) => t.id !== id))
    router.refresh()
  }

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm() }}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Testimonial
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTestimonial ? "Edit Testimonial" : "New Testimonial"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role/Title</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="content">Testimonial</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={3}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="rating">Rating (1-5)</Label>
                <Input
                  id="rating"
                  type="number"
                  min="1"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="avatar_url">Avatar URL</Label>
                <Input
                  id="avatar_url"
                  value={formData.avatar_url}
                  onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
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
              {editingTestimonial ? "Update" : "Create"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id}>
            <CardContent className="p-4">
              <div className="flex gap-4">
                {testimonial.avatar_url && (
                  <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-muted">
                    <Image
                      src={testimonial.avatar_url}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{testimonial.name}</h3>
                    <div className="flex">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-accent text-accent" />
                      ))}
                    </div>
                  </div>
                  {testimonial.role && (
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  )}
                  <p className="mt-1 text-sm line-clamp-2">{testimonial.content}</p>
                  {!testimonial.is_active && (
                    <span className="text-xs text-destructive">Inactive</span>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openEditDialog(testimonial)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(testimonial.id)}
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

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export type FrameShape = 'round' | 'aviator' | 'wayfarer' | 'cat-eye' | 'rectangle' | 'square' | 'oval' | 'browline'

export interface FrameShapeItem {
  id: string
  slug: FrameShape
  label: string
  sort_order: number
}

export interface ColorVariant {
  color_name: string
  color_hex: string
  image_url: string
}

export interface WishlistItem {
  id: string
  name: string
  slug: string
  price: number
  sale_price: number | null
  image: string
  added_at: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  sale_price: number | null
  category_id: string | null
  images: string[]
  thumbnail_url: string | null
  gallery_urls: string[]
  video_url: string | null
  frame_shape: FrameShape | null
  variants: ColorVariant[] | null
  features: string[]
  specifications: Record<string, string>
  stock_quantity: number
  is_featured: boolean
  is_active: boolean
  created_at: string
  updated_at: string
  category?: Category
  shape_id?: string | null
}

export interface ProductVariantImage {
  id: string
  variant_id: string
  url: string
  sort_order: number
}

export interface ProductVariant {
  id: string
  product_id: string
  color_id: string
  stock: number
  color: {
    id: string
    color_name: string
    hex_code: string
  } | null
  images: ProductVariantImage[]
}

export interface HeroSlide {
  id: string
  title: string
  subtitle: string | null
  image_url: string
  button_text: string | null
  button_link: string | null
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Testimonial {
  id: string
  name: string
  role: string | null
  content: string
  rating: number
  avatar_url: string | null
  is_active: boolean
  created_at: string
}

export interface Order {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string | null
  shipping_address: {
    street: string
    city: string
    state: string
    zip: string
    country: string
    delivery_zone?: "inside_dhaka" | "outside_dhaka" | string
  }
  items: Array<{
    product_id: string
    name: string
    price: number
    quantity: number
    image: string
    customization?: {
      lens_type: string
      add_ons: string[]
    } | null
  }>
  subtotal: number
  shipping_cost: number
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  notes: string | null
  created_at: string
  updated_at: string
}

export interface SiteSetting {
  id: string
  key: string
  value: unknown
  created_at: string
  updated_at: string
}

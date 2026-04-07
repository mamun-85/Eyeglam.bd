"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useCart } from "@/components/cart-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Spinner } from "@/components/ui/spinner"
import { formatPrice } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import type { ShippingInfoSettings } from "@/lib/site-settings"

interface CheckoutFormProps {
  shippingInfo: ShippingInfoSettings
}

export function CheckoutForm({ shippingInfo }: CheckoutFormProps) {
  const router = useRouter()
  const { items, subtotal, clearCart } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [shippingZone, setShippingZone] = useState<"inside_dhaka" | "outside_dhaka">("inside_dhaka")

  const baseShipping =
    shippingZone === "inside_dhaka"
      ? shippingInfo.inside_dhaka_shipping
      : shippingInfo.outside_dhaka_shipping
  const shipping = subtotal >= shippingInfo.free_shipping_threshold ? 0 : baseShipping
  const total = subtotal + shipping

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const supabase = createClient()

    try {
      const orderData = {
        customer_name: formData.get("name") as string,
        customer_email: formData.get("email") as string,
        customer_phone: formData.get("phone") as string,
        shipping_address: {
          street: formData.get("street") as string,
          city: formData.get("city") as string,
          state: formData.get("state") as string,
          zip: formData.get("zip") as string,
          country: formData.get("country") as string,
          delivery_zone: shippingZone,
        },
        items: items.map((item) => ({
          product_id: item.custom_details?.base_product_id || item.id,
          name: item.name,
          price: item.sale_price || item.price,
          quantity: item.quantity,
          image: item.image,
          customization: item.custom_details
            ? {
                lens_type: item.custom_details.lens_type,
                add_ons: item.custom_details.add_ons,
              }
            : null,
        })),
        subtotal,
        shipping_cost: shipping,
        total,
        notes: formData.get("notes") as string,
      }

      const { error: insertError } = await supabase
        .from("orders")
        .insert(orderData)

      if (insertError) throw insertError

      clearCart()
      router.push("/checkout/success")
    } catch (err) {
      console.error("Order error:", err)
      setError("Failed to place order. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="mt-8 text-center">
        <p className="text-lg text-muted-foreground">
          Your cart is empty. Add some products to continue.
        </p>
        <Button className="mt-4" onClick={() => router.push("/products")}>
          Continue Shopping
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 grid gap-8 lg:grid-cols-2">
      {/* Shipping Information */}
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Contact Information
          </h2>
          <div className="mt-4 grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" type="tel" />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Shipping Address
          </h2>
          <div className="mt-4 grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="street">Street Address</Label>
              <Input id="street" name="street" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" name="state" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="zip">ZIP Code</Label>
                <Input id="zip" name="zip" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" name="country" defaultValue="United States" required />
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-foreground">Delivery Zone</h2>
          <div className="mt-4 grid gap-3">
            <Label htmlFor="shipping_zone">Choose area</Label>
            <select
              id="shipping_zone"
              name="shipping_zone"
              value={shippingZone}
              onChange={(e) => setShippingZone(e.target.value as "inside_dhaka" | "outside_dhaka")}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="inside_dhaka">Inside Dhaka</option>
              <option value="outside_dhaka">Outside Dhaka</option>
            </select>
            <p className="text-xs text-muted-foreground">
              Shipping charge for this selection: {formatPrice(baseShipping)}
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Order Notes (Optional)
          </h2>
          <div className="mt-4">
            <Textarea
              id="notes"
              name="notes"
              placeholder="Any special instructions for your order..."
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div>
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">
            Order Summary
          </h2>

          <ul className="mt-6 divide-y divide-border">
            {items.map((item) => (
              <li key={item.id} className="flex gap-4 py-4">
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col">
                  <h3 className="text-sm font-medium">{item.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Qty: {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-medium">
                  {formatPrice((item.sale_price || item.price) * item.quantity)}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-6 border-t border-border pt-6">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            <div className="mt-2 flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-medium">
                {shipping === 0 ? "Free" : formatPrice(shipping)}
              </span>
            </div>
            {subtotal < shippingInfo.free_shipping_threshold && (
              <p className="mt-2 text-xs text-muted-foreground">
                Add {formatPrice(shippingInfo.free_shipping_threshold - subtotal)} more for
                free shipping
              </p>
            )}
            <div className="mt-4 flex justify-between border-t border-border pt-4">
              <span className="text-base font-semibold">Total</span>
              <span className="text-base font-semibold">{formatPrice(total)}</span>
            </div>
          </div>

          {error && (
            <p className="mt-4 text-sm text-destructive">{error}</p>
          )}

          <Button
            type="submit"
            size="lg"
            className="mt-6 w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Spinner className="mr-2" />
                Processing...
              </>
            ) : (
              `Place Order - ${formatPrice(total)}`
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}

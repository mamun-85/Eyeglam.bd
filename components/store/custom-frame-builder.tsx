"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useCart } from "@/components/cart-provider"
import { formatPrice } from "@/lib/utils"
import type { Product } from "@/lib/types"
import type { PricedOption } from "@/lib/site-settings"

interface CustomFrameBuilderProps {
  frames: Product[]
  lensOptions: PricedOption[]
  addOnOptions: PricedOption[]
}

export function CustomFrameBuilder({
  frames,
  lensOptions,
  addOnOptions,
}: CustomFrameBuilderProps) {
  const { addItem, setIsOpen } = useCart()
  const [selectedFrameId, setSelectedFrameId] = useState(frames[0]?.id || "")
  const [selectedLensName, setSelectedLensName] = useState(lensOptions[0]?.name || "")
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([])

  const selectedFrame = useMemo(
    () => frames.find((frame) => frame.id === selectedFrameId),
    [frames, selectedFrameId],
  )

  const frameBasePrice = selectedFrame
    ? selectedFrame.sale_price || selectedFrame.price
    : 0
  const selectedLensPrice =
    lensOptions.find((item) => item.name === selectedLensName)?.price || 0
  const addOnPrice = addOnOptions
    .filter((item) => selectedAddOns.includes(item.name))
    .reduce((sum, item) => sum + item.price, 0)

  const totalPrice = frameBasePrice + selectedLensPrice + addOnPrice

  const toggleAddOn = (name: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name],
    )
  }

  const handleAddCustomToCart = () => {
    if (!selectedFrame) return

    const sortedAddOns = [...selectedAddOns].sort()
    const configKey = `${selectedFrame.id}::${selectedLensName}::${sortedAddOns.join(",")}`

    addItem({
      id: configKey,
      name: `${selectedFrame.name} (Custom)`,
      price: totalPrice,
      sale_price: null,
      image: selectedFrame.images[0] || "/placeholder.svg",
      custom_details: {
        base_product_id: selectedFrame.id,
        lens_type: selectedLensName,
        add_ons: sortedAddOns,
      },
    })
    setIsOpen(true)
  }

  if (frames.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <p className="text-muted-foreground">
          No frames are available right now. Please check back later.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-xl font-semibold">Choose Your Frame</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {frames.map((frame) => {
            const active = frame.id === selectedFrameId
            const framePrice = frame.sale_price || frame.price
            return (
              <button
                key={frame.id}
                type="button"
                className={`rounded-lg border p-3 text-left transition-colors ${
                  active
                    ? "border-accent bg-accent/5"
                    : "border-border hover:border-accent/40"
                }`}
                onClick={() => setSelectedFrameId(frame.id)}
              >
                <div className="relative h-28 w-full overflow-hidden rounded-md bg-muted">
                  <Image
                    src={frame.images[0] || "/placeholder.svg"}
                    alt={frame.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="mt-3 text-sm font-medium">{frame.name}</p>
                <p className="text-sm text-accent">{formatPrice(framePrice)}</p>
              </button>
            )
          })}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-xl font-semibold">Choose Lenses & Add-ons</h2>

        <div className="mt-5 grid gap-2">
          <Label htmlFor="lens_type">Lens Type</Label>
          <select
            id="lens_type"
            value={selectedLensName}
            onChange={(e) => setSelectedLensName(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            {lensOptions.map((lens) => (
              <option key={lens.name} value={lens.name}>
                {lens.name} (+{formatPrice(lens.price)})
              </option>
            ))}
          </select>
        </div>

        <div className="mt-5">
          <p className="text-sm font-medium">Add-ons</p>
          <div className="mt-3 space-y-2">
            {addOnOptions.map((addOn) => {
              const checked = selectedAddOns.includes(addOn.name)
              return (
                <label
                  key={addOn.name}
                  className="flex cursor-pointer items-center justify-between rounded-md border border-border px-3 py-2"
                >
                  <span className="text-sm">{addOn.name}</span>
                  <span className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">
                      +{formatPrice(addOn.price)}
                    </span>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleAddOn(addOn.name)}
                      className="h-4 w-4"
                    />
                  </span>
                </label>
              )
            })}
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-border bg-muted/40 p-4">
          <p className="text-sm text-muted-foreground">Price Breakdown</p>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Frame</span>
              <span>{formatPrice(frameBasePrice)}</span>
            </div>
            <div className="flex justify-between">
              <span>Lens</span>
              <span>{formatPrice(selectedLensPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span>Add-ons</span>
              <span>{formatPrice(addOnPrice)}</span>
            </div>
            <div className="mt-2 flex justify-between border-t border-border pt-2 text-base font-semibold">
              <span>Total</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
          </div>
        </div>

        {selectedFrame && (
          <div className="mt-6 flex flex-col gap-2">
            <Button className="w-full" onClick={handleAddCustomToCart}>
              Add Custom Item To Cart
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href={`/products/${selectedFrame.slug}`}>View Selected Frame</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

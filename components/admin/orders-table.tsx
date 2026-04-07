"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, Trash2, Eraser } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import type { Order } from "@/lib/types"

interface OrdersTableProps {
  orders: Order[]
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
}

export function OrdersTable({ orders }: OrdersTableProps) {
  const router = useRouter()
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [updateError, setUpdateError] = useState<string | null>(null)
  const [processingOrderId, setProcessingOrderId] = useState<string | null>(null)

  const updateStatus = async (orderId: string, status: string) => {
    setUpdateError(null)
    const supabase = createClient()
    const { error } = await supabase.from("orders").update({ status }).eq("id", orderId)
    if (error) {
      setUpdateError(`Failed to update order status: ${error.message}`)
      return
    }
    router.refresh()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDeliveryZone = (zone?: string) => {
    if (!zone) return "N/A"
    if (zone === "inside_dhaka") return "Inside Dhaka"
    if (zone === "outside_dhaka") return "Outside Dhaka"
    return zone
  }

  const deleteOrder = async (orderId: string) => {
    if (!confirm("Delete this order permanently?")) return
    setUpdateError(null)
    setProcessingOrderId(orderId)

    const supabase = createClient()
    const { error } = await supabase.from("orders").delete().eq("id", orderId)
    if (error) {
      setUpdateError(`Failed to delete order: ${error.message}`)
      setProcessingOrderId(null)
      return
    }

    if (selectedOrder?.id === orderId) setSelectedOrder(null)
    setProcessingOrderId(null)
    router.refresh()
  }

  const clearOrderItems = async (order: Order) => {
    if (!confirm("Clear all products from this order?")) return
    setUpdateError(null)
    setProcessingOrderId(order.id)

    const shippingCost = Number(order.shipping_cost) || 0
    const supabase = createClient()
    const { error } = await supabase
      .from("orders")
      .update({
        items: [],
        subtotal: 0,
        total: shippingCost,
      })
      .eq("id", order.id)

    if (error) {
      setUpdateError(`Failed to clear order products: ${error.message}`)
      setProcessingOrderId(null)
      return
    }

    setSelectedOrder({
      ...order,
      items: [],
      subtotal: 0,
      total: shippingCost,
    })
    setProcessingOrderId(null)
    router.refresh()
  }

  return (
    <>
      {updateError && (
        <p className="mb-4 rounded-md bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {updateError}
        </p>
      )}
      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-sm">
                  {order.id.slice(0, 8)}...
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{order.customer_name}</p>
                    <p className="text-sm text-muted-foreground">{order.customer_email}</p>
                  </div>
                </TableCell>
                <TableCell>{formatDate(order.created_at)}</TableCell>
                <TableCell className="font-medium">{formatPrice(order.total)}</TableCell>
                <TableCell>
                  <Select
                    value={order.status}
                    onValueChange={(value) => updateStatus(order.id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <Badge className={statusColors[order.status]}>
                        {order.status}
                      </Badge>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      disabled={processingOrderId === order.id}
                      onClick={() => deleteOrder(order.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No orders yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Customer</h4>
                  <p className="mt-1">{selectedOrder.customer_name}</p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.customer_email}</p>
                  {selectedOrder.customer_phone && (
                    <p className="text-sm text-muted-foreground">{selectedOrder.customer_phone}</p>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Shipping Address</h4>
                  <p className="mt-1 text-sm">
                    {selectedOrder.shipping_address.street}<br />
                    {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} {selectedOrder.shipping_address.zip}<br />
                    {selectedOrder.shipping_address.country}
                  </p>
                  <p className="mt-2 text-sm">
                    <span className="text-muted-foreground">Zone:</span>{" "}
                    {formatDeliveryZone(selectedOrder.shipping_address.delivery_zone)}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Items</h4>
                <ul className="mt-2 divide-y divide-border">
                  {selectedOrder.items.map((item, idx) => (
                    <li key={idx} className="py-2">
                      <div className="flex justify-between gap-4">
                        <span>{item.name} x {item.quantity}</span>
                        <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                      {item.customization && (
                        <div className="mt-1 text-xs text-muted-foreground">
                          <p>Lens: {item.customization.lens_type}</p>
                          {item.customization.add_ons.length > 0 && (
                            <p>Add-ons: {item.customization.add_ons.join(", ")}</p>
                          )}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-border pt-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatPrice(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>{formatPrice(selectedOrder.shipping_cost)}</span>
                </div>
                <div className="flex justify-between font-medium mt-2">
                  <span>Total</span>
                  <span>{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>

              {selectedOrder.notes && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Notes</h4>
                  <p className="mt-1 text-sm">{selectedOrder.notes}</p>
                </div>
              )}

              <div className="flex justify-end">
                <Button
                  variant="outline"
                  className="text-destructive hover:text-destructive"
                  disabled={processingOrderId === selectedOrder.id || selectedOrder.items.length === 0}
                  onClick={() => clearOrderItems(selectedOrder)}
                >
                  <Eraser className="mr-2 h-4 w-4" />
                  Clear Products From Order
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

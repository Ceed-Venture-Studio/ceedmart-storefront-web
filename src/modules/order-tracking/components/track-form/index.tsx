"use client"

import { trackOrder, type TrackedOrder } from "@lib/data/order-tracking"
import { useState, useTransition } from "react"

type Props = {
  initialRef: string
  initialContact: string
}

const STATUS_LABEL: Record<string, string> = {
  pending: "Order placed",
  completed: "Completed",
  archived: "Archived",
  canceled: "Canceled",
  requires_action: "Requires action",
}

const FULFILLMENT_LABEL: Record<string, string> = {
  not_fulfilled: "Preparing",
  partially_fulfilled: "Partially prepared",
  fulfilled: "Ready to ship",
  partially_shipped: "Partially shipped",
  shipped: "Shipped",
  partially_delivered: "Partially delivered",
  delivered: "Delivered",
  canceled: "Canceled",
  returned: "Returned",
}

const PAYMENT_LABEL: Record<string, string> = {
  not_paid: "Payment pending",
  awaiting: "Awaiting payment",
  authorized: "Payment authorized",
  captured: "Payment received",
  partially_captured: "Partially paid",
  partially_refunded: "Partially refunded",
  refunded: "Refunded",
  canceled: "Canceled",
  requires_action: "Payment requires action",
}

const formatAmount = (n: number, currency: string): string => {
  const cc = (currency || "").toLowerCase()
  if (cc === "ngn") {
    return `₦${n.toLocaleString("en-NG", { maximumFractionDigits: 2 })}`
  }
  return `${n.toLocaleString()} ${currency.toUpperCase()}`
}

const formatDate = (iso: string): string => {
  const d = new Date(iso)
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  })
}

export default function TrackForm({ initialRef, initialContact }: Props) {
  const [ref, setRef] = useState(initialRef)
  const [contact, setContact] = useState(initialContact)
  const [result, setResult] = useState<
    { order: TrackedOrder } | { error: string } | null
  >(null)
  const [pending, startTransition] = useTransition()

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!ref.trim() || !contact.trim()) return
    setResult(null)
    startTransition(async () => {
      const res = await trackOrder(ref.trim(), contact.trim())
      if (res.ok) setResult({ order: res.order })
      else setResult({ error: res.error })
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={submit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-ui-fg-base">
            Order number
          </span>
          <input
            value={ref}
            onChange={(e) => setRef(e.target.value)}
            placeholder="e.g. 1024"
            className="rounded-md border border-ui-border-base bg-ui-bg-field h-12 px-3 text-base"
            required
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-ui-fg-base">
            Email or phone
          </span>
          <input
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="you@example.com or +234…"
            className="rounded-md border border-ui-border-base bg-ui-bg-field h-12 px-3 text-base"
            required
          />
        </label>
        <button
          type="submit"
          disabled={pending || !ref.trim() || !contact.trim()}
          className="h-12 rounded-md bg-ui-fg-base text-ui-bg-base font-semibold text-base disabled:opacity-50"
        >
          {pending ? "Looking up…" : "Track order"}
        </button>
      </form>

      {result && "error" in result && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-800 text-sm">
          {result.error}
        </div>
      )}

      {result && "order" in result && (
        <OrderStatusCard order={result.order} />
      )}
    </div>
  )
}

function OrderStatusCard({ order }: { order: TrackedOrder }) {
  const status =
    order.status === "canceled"
      ? "Canceled"
      : order.fulfillment_status === "delivered"
        ? "Delivered"
        : order.fulfillment_status === "shipped"
          ? "Shipped"
          : order.payment_status === "captured"
            ? "Confirmed"
            : "Received"

  return (
    <div className="rounded-lg border border-ui-border-base bg-white p-6 flex flex-col gap-5">
      <div>
        <div className="text-sm text-ui-fg-subtle">Order</div>
        <div className="text-2xl font-bold">#{order.display_id}</div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs uppercase tracking-wide text-ui-fg-subtle">
            Status
          </div>
          <div className="text-lg font-semibold">{status}</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-ui-fg-subtle">
            Total
          </div>
          <div className="text-lg font-semibold">
            {formatAmount(order.total, order.currency_code)}
          </div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-ui-fg-subtle">
            Items
          </div>
          <div className="text-lg font-semibold">{order.item_count}</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-ui-fg-subtle">
            Payment
          </div>
          <div className="text-lg font-semibold">
            {PAYMENT_LABEL[order.payment_status] ?? order.payment_status}
          </div>
        </div>
      </div>

      {(order.tracking_number || order.shipped_at || order.delivered_at) && (
        <div className="rounded-md border border-ui-border-base bg-ui-bg-subtle p-4 flex flex-col gap-2">
          <div className="font-medium text-ui-fg-base">Shipment</div>
          {order.tracking_number && (
            <div className="text-sm">
              <span className="text-ui-fg-subtle">Tracking number: </span>
              <span className="font-mono">{order.tracking_number}</span>
            </div>
          )}
          {order.shipped_at && (
            <div className="text-sm text-ui-fg-subtle">
              Shipped {formatDate(order.shipped_at)}
            </div>
          )}
          {order.delivered_at && (
            <div className="text-sm text-ui-fg-subtle">
              Delivered {formatDate(order.delivered_at)}
            </div>
          )}
        </div>
      )}

      <div className="text-sm text-ui-fg-subtle">
        Fulfillment:{" "}
        {FULFILLMENT_LABEL[order.fulfillment_status] ?? order.fulfillment_status}
        {order.status !== "canceled" &&
          ` · Order state: ${STATUS_LABEL[order.status] ?? order.status}`}
      </div>
    </div>
  )
}

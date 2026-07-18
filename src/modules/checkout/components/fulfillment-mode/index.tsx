"use client"

import { setFulfillmentMode, type FulfillmentMode as ModeT } from "@lib/data/fulfillment-mode"
import type { PublicShop } from "@lib/data/shops"
import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import Divider from "@modules/common/components/divider"
import { useState, useTransition } from "react"

// Storefront-side fulfillment picker. Sits at the very top of the
// checkout flow so the address step can adapt (pickup skips the
// delivery address, delivery keeps the existing form).
//
// Reads existing selection from cart.metadata.ceedmart so the choice
// persists across page reloads and step navigations. Writes back via
// setFulfillmentMode which populates the ceedmart categorization block
// on the cart — Medusa carries that into order.metadata on complete.

type Props = {
  cart: HttpTypes.StoreCart | null
  shops: PublicShop[]
}

const FulfillmentModeSelector = ({ cart, shops }: Props) => {
  const initialCeedmart = ((cart?.metadata as any)?.ceedmart ?? {}) as {
    fulfillment?: ModeT
    store_id?: string
  }
  const [mode, setMode] = useState<ModeT>(
    initialCeedmart.fulfillment ?? "delivery"
  )
  const [shopId, setShopId] = useState<string>(
    initialCeedmart.store_id ?? ""
  )
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const persist = (nextMode: ModeT, nextShopId: string | null) => {
    setError(null)
    startTransition(async () => {
      try {
        await setFulfillmentMode(nextMode, nextShopId)
      } catch (e: any) {
        setError(e?.message ?? "Failed to update fulfillment mode")
      }
    })
  }

  const handleModeChange = (nextMode: ModeT) => {
    setMode(nextMode)
    const chosenShop = nextMode === "pickup" ? shopId || null : null
    persist(nextMode, chosenShop)
  }

  const handleShopChange = (nextShopId: string) => {
    setShopId(nextShopId)
    persist("pickup", nextShopId || null)
  }

  return (
    <div>
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading level="h2" className="flex flex-row text-3xl-regular gap-x-2 items-baseline">
          Delivery
        </Heading>
      </div>

      <div className="flex flex-col gap-y-4">
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleModeChange("delivery")}
            className={`flex flex-col items-start gap-1 rounded-md border p-4 text-left transition-colors ${
              mode === "delivery"
                ? "border-ui-fg-base bg-ui-bg-subtle"
                : "border-ui-border-base hover:bg-ui-bg-subtle-hover"
            }`}
            disabled={pending}
          >
            <span className="txt-medium-plus">Delivery</span>
            <span className="txt-small text-ui-fg-subtle">
              Ship to my address.
            </span>
          </button>
          <button
            type="button"
            onClick={() => handleModeChange("pickup")}
            className={`flex flex-col items-start gap-1 rounded-md border p-4 text-left transition-colors ${
              mode === "pickup"
                ? "border-ui-fg-base bg-ui-bg-subtle"
                : "border-ui-border-base hover:bg-ui-bg-subtle-hover"
            }`}
            disabled={pending || shops.length === 0}
          >
            <span className="txt-medium-plus">Pickup</span>
            <span className="txt-small text-ui-fg-subtle">
              {shops.length === 0
                ? "No pickup shops available"
                : "Collect from a Ceedmart shop."}
            </span>
          </button>
        </div>

        {mode === "pickup" && shops.length > 0 && (
          <div className="flex flex-col gap-y-2">
            <Text className="txt-medium">Pickup location</Text>
            <select
              value={shopId}
              onChange={(e) => handleShopChange(e.target.value)}
              className="border rounded-md p-3 bg-ui-bg-field border-ui-border-base"
              disabled={pending}
            >
              <option value="">Select a shop…</option>
              {shops.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                  {s.city ? ` — ${s.city}` : ""}
                </option>
              ))}
            </select>
            {shopId && (
              <Text size="small" className="text-ui-fg-subtle">
                We'll notify you when your order is ready for collection.
              </Text>
            )}
          </div>
        )}

        {error && (
          <Text size="small" className="text-ui-fg-error">
            {error}
          </Text>
        )}
      </div>
      <Divider className="mt-8" />
    </div>
  )
}

export default FulfillmentModeSelector

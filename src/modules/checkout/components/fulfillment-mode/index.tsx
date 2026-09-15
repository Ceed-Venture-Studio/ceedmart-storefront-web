"use client"

import { setFulfillmentMode, type FulfillmentMode as ModeT } from "@lib/data/fulfillment-mode"
import { setShippingMethod } from "@lib/data/cart"
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
  /** Shipping options whose fulfillment set is a pickup set — the real,
   *  configured ability to collect an order. */
  pickupOptions: HttpTypes.StoreCartShippingOption[]
  /** The single delivery option, when there is exactly one. */
  soleDeliveryOptionId: string | null
}

const FulfillmentModeSelector = ({
  cart,
  shops,
  pickupOptions,
  soleDeliveryOptionId,
}: Props) => {
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

  // Whether pickup is possible at all.
  //
  // This used to be `shops.length > 0`, where shops came from /store/shops —
  // sales channels carrying a ceedmart.code in their metadata. No channel in
  // production has ever carried one, so the list is empty, the button was
  // permanently `disabled`, and clicking Pickup did nothing whatsoever. It
  // was not even a failed click: a disabled button fires no event, so there
  // was nothing to see and nothing logged.
  //
  // Meanwhile a genuine pickup option — "Office Pickup (Ceedmart Eliozu,
  // Port Harcourt)", a fulfillment set of type `pickup` — was configured and
  // offered one step later. Two sources of truth for one capability, and the
  // one the customer met first was the one nobody had populated.
  //
  // The shipping option is the authority now, because it is what actually
  // fulfils the order. The shops list survives as the nicer store picker for
  // when multiple shops are provisioned.
  const canPickup = pickupOptions.length > 0 || shops.length > 0

  // Name the place they will collect from. The option name already reads
  // "Office Pickup (Ceedmart Eliozu, Port Harcourt)", which is more useful
  // on the button than a generic line.
  const pickupLocationLabel =
    shops.length === 0 && pickupOptions.length === 1
      ? pickupOptions[0].name
      : null

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

  // Choosing here also sets the cart's shipping method. Before, this wrote
  // metadata and nothing else, so the customer chose pickup and was then
  // asked to choose between pickup and delivery all over again on the next
  // step — two controls for one decision, each able to contradict the other.
  const handleModeChange = (nextMode: ModeT) => {
    setMode(nextMode)
    const chosenShop = nextMode === "pickup" ? shopId || null : null
    persist(nextMode, chosenShop)

    const optionId =
      nextMode === "pickup" ? pickupOptions[0]?.id : soleDeliveryOptionId

    // Only when the choice is unambiguous. With several delivery options the
    // Shipping step still has a real question to ask, and pre-picking one
    // would answer it on the customer's behalf.
    if (optionId && cart?.id) {
      startTransition(async () => {
        try {
          await setShippingMethod({
            cartId: cart.id,
            shippingMethodId: optionId,
          })
        } catch (e: any) {
          setError(e?.message ?? "Failed to set the shipping method")
        }
      })
    }
  }

  const handleShopChange = (nextShopId: string) => {
    setShopId(nextShopId)
    persist("pickup", nextShopId || null)
  }

  return (
    <div>
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading level="h2" className="flex flex-row text-3xl-regular gap-x-2 items-baseline">
          {/* Not "Delivery": this step is where delivery is one of the two
              answers, and naming it after one of them prejudges the choice. */}
          How you'll get it
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
            disabled={pending || !canPickup}
          >
            <span className="txt-medium-plus">Pickup</span>
            <span className="txt-small text-ui-fg-subtle">
              {!canPickup
                ? "No pickup shops available"
                : pickupLocationLabel ?? "Collect from a Ceedmart shop."}
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

import "server-only"
import { cookies as nextCookies } from "next/headers"

import { sdk } from "@lib/config"
import { DELIVERY_LOCATION_COOKIE } from "./delivery-locations"

// Per-location catalog: the location picker's choice decides which sales
// channel product listings are read from. The backend owns the mapping
// (GET /store/web-locations) because channel ids differ per environment.
// A product is sold in a location when it is linked to that location's
// "Web – <name>" channel in admin.

type WebLocationMap = {
  default_sales_channel_id: string | null
  locations: { id: string; sales_channel_id: string }[]
}

const getWebLocationMap = async (): Promise<WebLocationMap | null> => {
  try {
    return await sdk.client.fetch<WebLocationMap>("/store/web-locations", {
      method: "GET",
      // Same window as product listings, so a location set up in admin
      // starts filtering within a minute.
      next: { revalidate: 60 },
    })
  } catch {
    // Backend without the endpoint: list products as before, unscoped.
    return null
  }
}

/**
 * The sales channel product listings should be read from, or undefined to
 * leave the request unscoped (a backend without the endpoint).
 *
 * With per-location channels on the storefront's key, a listing that asks
 * for stock levels must name exactly one channel, so a visitor who has not
 * picked a location — or picked one with no channel — gets the default.
 * The default is sent even while no locations are mapped: this answer is
 * cached, and an unscoped request would be rejected the moment the channels
 * are linked to the key, until the cache expired.
 */
export const getCatalogSalesChannelId = async (): Promise<
  string | undefined
> => {
  const map = await getWebLocationMap()
  if (!map) {
    return undefined
  }

  let locationId: string | undefined
  try {
    const cookies = await nextCookies()
    locationId = cookies.get(DELIVERY_LOCATION_COOKIE)?.value
  } catch {
    // Outside a request (build time): fall through to the default.
  }

  const match = map.locations.find((l) => l.id === locationId)
  return match?.sales_channel_id ?? map.default_sales_channel_id ?? undefined
}

/**
 * The sales channel a new cart is created in, or undefined to let the
 * backend pick its default.
 *
 * Carts always stay on the default channel — that is where shipping options,
 * stock reservations and pickup shops are configured — whatever location the
 * visitor chose. It has to be named explicitly: with per-location channels
 * on the storefront's key, Medusa refuses to create a cart without one.
 */
export const getCartSalesChannelId = async (): Promise<string | undefined> => {
  const map = await getWebLocationMap()
  return map?.default_sales_channel_id ?? undefined
}

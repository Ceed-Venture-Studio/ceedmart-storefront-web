"use server"

import { sdk } from "@lib/config"
import { getGlobalCacheOptions } from "./cookies"

export type PublicShop = {
  id: string
  name: string
  code: string
  city: string | null
  address: string | null
  phone: string | null
}

type ShopsResponse = { shops: PublicShop[] }

export const listShops = async (): Promise<PublicShop[]> => {
  const next = {
    ...getGlobalCacheOptions("shops"),
    revalidate: 300,
  }
  try {
    const { shops } = await sdk.client.fetch<ShopsResponse>("/store/shops", {
      method: "GET",
      next,
    })
    return shops ?? []
  } catch {
    return []
  }
}

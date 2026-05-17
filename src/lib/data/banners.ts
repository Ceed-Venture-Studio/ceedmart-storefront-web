"use server"

import { sdk } from "@lib/config"
import { getGlobalCacheOptions } from "./cookies"
import type { Banner, BannerSlot, BannersResponse } from "../../types/banner"

export const listBanners = async (
  slot: BannerSlot,
  limit: number = 10
): Promise<Banner[]> => {
  const next = {
    ...getGlobalCacheOptions("banners"),
    revalidate: 60,
  }

  try {
    const { banners } = await sdk.client.fetch<BannersResponse>(
      "/store/banners",
      {
        method: "GET",
        query: { slot, limit },
        next,
      }
    )
    return banners ?? []
  } catch {
    return []
  }
}

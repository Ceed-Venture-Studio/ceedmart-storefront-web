"use server"

import { sdk } from "@lib/config"
import { getGlobalCacheOptions } from "./cookies"

export type Locale = {
  code: string
  name: string
}

/**
 * Fetches available locales from the backend.
 * Returns null if the endpoint returns 404 (locales not configured).
 */
export const listLocales = async (): Promise<Locale[] | null> => {
  const next = {
    ...getGlobalCacheOptions("locales"),
    revalidate: 60,
  }

  return sdk.client
    .fetch<{ locales: Locale[] }>(`/store/locales`, {
      method: "GET",
      next,
    })
    .then(({ locales }) => locales)
    .catch(() => null)
}

"use server"

import { sdk } from "@lib/config"
import { getCacheOptions } from "./cookies"

// Storefront feature-flag client (BRD §15).
//
// The backend is the single source of truth — see
// app/ceedmart/src/lib/feature-flags on that side. The storefront reads the
// published set rather than its own env vars, so one backend env change
// switches a feature off across storefront, POS and API together instead of
// needing three coordinated deploys.
//
// Everything defaults OFF on failure. If we cannot confirm a feature is on,
// it is off: showing an auction page whose bid endpoint is disabled is worse
// than not showing it at all.

export type FeatureFlag =
  | "preorder"
  | "custom_build"
  | "build_configurator"
  | "auction"

export type FeatureFlags = Record<FeatureFlag, boolean>

const ALL_OFF: FeatureFlags = {
  preorder: false,
  custom_build: false,
  build_configurator: false,
  auction: false,
}

export const getFeatureFlags = async (): Promise<FeatureFlags> => {
  const next = {
    ...(await getCacheOptions("feature-flags")),
  }

  return await sdk.client
    .fetch<{ flags: FeatureFlags }>("/store/feature-flags", {
      method: "GET",
      next,
      cache: "force-cache",
    })
    .then((res) => ({ ...ALL_OFF, ...(res.flags ?? {}) }))
    .catch(() => ALL_OFF)
}

export const isFeatureEnabled = async (flag: FeatureFlag): Promise<boolean> => {
  const flags = await getFeatureFlags()
  return flags[flag] === true
}

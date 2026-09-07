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

// Long enough that flags cost nothing on a busy page, short enough that
// switching one off actually takes effect.
//
// This was force-cache with no revalidate, which Next persists to disk —
// across restarts, and indefinitely. A backend flag change never reached the
// storefront: enabling a feature left its page 404ing, and, far worse,
// turning one OFF in an incident would have done nothing at all. A kill
// switch that cannot be pulled is not a kill switch.
const FLAG_TTL_SECONDS = 30

export const getFeatureFlags = async (): Promise<FeatureFlags> => {
  const next = {
    ...(await getCacheOptions("feature-flags")),
    revalidate: FLAG_TTL_SECONDS,
  }

  return await sdk.client
    .fetch<{ flags: FeatureFlags }>("/store/feature-flags", {
      method: "GET",
      next,
    })
    .then((res) => ({ ...ALL_OFF, ...(res.flags ?? {}) }))
    .catch(() => ALL_OFF)
}

export const isFeatureEnabled = async (flag: FeatureFlag): Promise<boolean> => {
  const flags = await getFeatureFlags()
  return flags[flag] === true
}

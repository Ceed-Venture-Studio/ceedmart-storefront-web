"use server"

import { sdk } from "@lib/config"

// Guided configurator data (BRD §7.3, §7.4, §7.8).

export type ComponentOption = {
  id: string
  label: string
  brand: string | null
  variant_id: string | null
  indicative_price: number | null
  currency_code: string
  attributes: Record<string, unknown>
  is_fixed: boolean
}

export type ComponentCategory = {
  code: string
  label: string
  is_required: boolean
  allows_multiple: boolean
  max_quantity: number
  help_text: string | null
  options: ComponentOption[]
}

export type Finding = {
  code: string
  severity: "blocking" | "warning"
  message: string
  remedy: string | null
  categories: string[]
}

export type Validation = {
  blocking: Finding[]
  warnings: Finding[]
  missing: string[]
  missing_labels: string[]
  unacknowledged: Finding[]
  can_submit: boolean
  estimated_total: number
  currency_code: string
}

export type Selection = {
  category_code: string
  option_id: string
  quantity?: number
}

export const getBuildCatalog = async (
  buildType: "desktop" | "laptop",
  modelFamily?: string
): Promise<{ categories: ComponentCategory[] } | null> => {
  return await sdk.client
    .fetch<{ categories: ComponentCategory[] }>("/store/builds/catalog", {
      method: "GET",
      query: { build_type: buildType, model_family: modelFamily },
      // Catalogue prices and availability move; a stale option list would
      // let someone configure a part we no longer sell.
      cache: "no-store",
    })
    .catch(() => null)
}

/**
 * Server-side compatibility check.
 *
 * The browser runs the same rules for instant feedback, but §7.9 requires
 * validation be repeated on the server, and this is the answer that counts.
 */
export const validateConfiguration = async (
  buildType: "desktop" | "laptop",
  selections: Selection[],
  acknowledgedWarnings: string[] = []
): Promise<Validation | null> => {
  return await sdk.client
    .fetch<Validation>("/store/builds/validate", {
      method: "POST",
      body: {
        build_type: buildType,
        selections,
        acknowledged_warnings: acknowledgedWarnings,
      },
    })
    .catch(() => null)
}

export const saveConfiguration = async (input: {
  name?: string
  build_type: "desktop" | "laptop"
  selections: Selection[]
  acknowledged_warnings?: string[]
  session_token?: string
}) => {
  return await sdk.client.fetch<{
    configuration: { reference: string }
    validation: Validation
  }>("/store/builds/configurations", { method: "POST", body: input })
}

export const submitConfiguration = async (
  reference: string,
  input: {
    customer_name: string
    customer_email: string
    customer_phone?: string
    delivery_state?: string
    needed_by?: string
    notes?: string
    acknowledged_warnings?: string[]
  }
) => {
  return await sdk.client.fetch<{
    request: { reference: string; status: string }
  }>(`/store/builds/configurations/${reference}`, { method: "POST", body: input })
}

"use server"

import { sdk } from "@lib/config"

// Custom-build requests and quotes (BRD §7.5, §7.6).

export type BuildQuoteLine = {
  label: string
  description?: string | null
  category?: string | null
  quantity: number
  unit_price: number
}

export type BuildQuoteView = {
  reference: string
  status: string
  version: number
  version_count: number
  line_items: BuildQuoteLine[]
  service_items: BuildQuoteLine[] | null
  subtotal: number
  discount_total: number
  tax_total: number
  delivery_total: number
  total: number
  currency_code: string
  build_days: number | null
  warranty_text: string | null
  cancellation_terms: string | null
  valid_until: string
  change_note: string | null
  build_type: string | null
  can_accept: boolean
  blocked_reason: string | null
  terms: { version_id: string; version: number; body: string } | null
}

export type BuildRequestInput = {
  customer_name: string
  customer_email: string
  customer_phone?: string
  delivery_state?: string
  build_type: "desktop" | "laptop"
  intended_use: string
  budget_min?: number
  budget_max?: number
  preferred_brands?: string[]
  required_software?: string[]
  performance_notes?: string
  portability_needs?: string
  needed_by?: string
  notes?: string
}

export const submitBuildRequest = async (input: BuildRequestInput) => {
  return await sdk.client.fetch<{
    request: { id: string; reference: string; status: string }
  }>("/store/builds/requests", {
    method: "POST",
    body: input,
  })
}

/**
 * Fetch a quote by its customer-facing reference.
 *
 * Never cached. Whether a quote can still be accepted depends on the clock
 * and on whether a specialist has since issued a newer version — serving a
 * cached "you can accept this" would let someone act on a quote that has
 * already been superseded.
 */
export const getBuildQuote = async (
  reference: string
): Promise<BuildQuoteView | null> => {
  return await sdk.client
    .fetch<{ quote: BuildQuoteView }>(`/store/builds/quotes/${reference}`, {
      method: "GET",
      cache: "no-store",
    })
    .then((res) => res.quote ?? null)
    .catch(() => null)
}

export const respondToBuildQuote = async (
  reference: string,
  action: "accept" | "reject" | "request_revision",
  note?: string
) => {
  return await sdk.client.fetch<{
    build?: { reference: string; status: string; total: number }
    quote?: { reference: string; status: string }
  }>(`/store/builds/quotes/${reference}`, {
    method: "POST",
    body: { action, note },
  })
}

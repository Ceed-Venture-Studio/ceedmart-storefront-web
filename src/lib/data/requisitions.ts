"use server"

import { sdk } from "@lib/config"
import { getGlobalCacheOptions } from "./cookies"

export type Requisition = {
  id: string
  title: string
  description: string // HTML
  apply_url: string
  salary: string | null
  status: "open" | "closed"
  created_at: string
  updated_at: string
}

type RequisitionsResponse = {
  requisitions: Requisition[]
  count: number
}

export const listOpenRequisitions = async (
  limit: number = 50
): Promise<Requisition[]> => {
  // Cache under a global tag so the admin can purge it when a requisition
  // changes (alongside how banners/products are revalidated).
  const next = {
    ...getGlobalCacheOptions("requisitions"),
    revalidate: 60,
  }

  try {
    const { requisitions } = await sdk.client.fetch<RequisitionsResponse>(
      "/store/requisitions",
      { method: "GET", query: { limit }, next }
    )
    return requisitions ?? []
  } catch {
    return []
  }
}

type RequisitionResponse = { requisition: Requisition }

export const getRequisition = async (
  id: string
): Promise<Requisition | null> => {
  const next = {
    ...getGlobalCacheOptions("requisitions"),
    revalidate: 60,
  }

  try {
    const { requisition } = await sdk.client.fetch<RequisitionResponse>(
      `/store/requisitions/${id}`,
      { method: "GET", next }
    )
    return requisition ?? null
  } catch {
    // 404 / closed / network — caller renders notFound().
    return null
  }
}

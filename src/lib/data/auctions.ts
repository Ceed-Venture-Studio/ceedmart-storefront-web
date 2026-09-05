"use server"

import { sdk } from "@lib/config"

// Auction data for the storefront (BRD §8.2, §8.6, D-14).

export type AuctionLive = {
  id: string
  status: string
  current_price: number | null
  starting_price: number
  min_next_bid: number
  min_increment: number
  buy_now_price: number | null
  currency_code: string
  bid_count: number
  has_reserve: boolean
  reserve_met: boolean
  ends_at: string
  seconds_remaining: number
  server_time: string
  extension_count: number
  viewer_is_leading: boolean
}

export type PublicBid = {
  sequence: number
  bidder: string
  amount: number
  placed_at: string
  kind: string
  voided: boolean
  triggered_extension: boolean
}

export type Eligibility = {
  eligible: boolean
  emailVerified: boolean
  phoneVerified: boolean
  barred: boolean
  reason: string | null
}

/**
 * Poll a live auction.
 *
 * `no-store` on both sides. D-14 accepted short polling instead of real-time
 * infrastructure on the condition that the server stays authoritative — a
 * cached price would break exactly that.
 */
export const getAuctionLive = async (
  auctionId: string
): Promise<AuctionLive | null> => {
  return await sdk.client
    .fetch<AuctionLive>(`/store/auctions/${auctionId}/live`, {
      method: "GET",
      cache: "no-store",
    })
    .catch(() => null)
}

export const getAuctionBids = async (
  auctionId: string
): Promise<PublicBid[]> => {
  return await sdk.client
    .fetch<{ bids: PublicBid[] }>(`/store/auctions/${auctionId}/bids`, {
      method: "GET",
      cache: "no-store",
    })
    .then((r) => r.bids ?? [])
    .catch(() => [])
}

export const placeBid = async (
  auctionId: string,
  amount: number,
  kind: "bid" | "buy_now" = "bid"
) => {
  return await sdk.client.fetch<{
    bid: { sequence: number; amount: number; triggered_extension: boolean }
    auction: {
      current_price: number
      bid_count: number
      ends_at: string
      min_next_bid: number
      extended: boolean
    }
  }>(`/store/auctions/${auctionId}/bids`, {
    method: "POST",
    body: { amount, kind, accept_terms: true },
  })
}

export const sendBidderOtp = async (phone: string) => {
  return await sdk.client.fetch<{
    sent: boolean
    phone: string
    retryAfterSeconds: number
  }>("/store/auctions/verification/send", { method: "POST", body: { phone } })
}

export const confirmBidderOtp = async (code: string) => {
  return await sdk.client.fetch<{
    verified: boolean
    message?: string
    eligibility: Eligibility
  }>("/store/auctions/verification/confirm", { method: "POST", body: { code } })
}

export type AuctionListItem = {
  id: string
  reference: string
  title: string
  description: string | null
  images: string[]
  condition: string
  status: string
  starts_at: string
  ends_at: string
  seconds_remaining: number
  starting_price: number
  current_price: number | null
  buy_now_price: number | null
  currency_code: string
  bid_count: number
  has_reserve: boolean
  reserve_met: boolean
}

/**
 * List public auctions.
 *
 * Cached for a few seconds only — a listing that says "live" about an
 * auction that closed a minute ago sends people to a dead page.
 */
export const listAuctions = async (
  status?: string
): Promise<{ auctions: AuctionListItem[]; server_time: string }> => {
  return await sdk.client
    .fetch<{ auctions: AuctionListItem[]; server_time: string }>(
      "/store/auctions",
      {
        method: "GET",
        query: status ? { status } : undefined,
        cache: "no-store",
      }
    )
    .catch(() => ({ auctions: [], server_time: new Date().toISOString() }))
}

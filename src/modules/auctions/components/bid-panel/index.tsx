"use client"

import { Button, Input, Text, clx } from "@medusajs/ui"
import { useCallback, useEffect, useRef, useState } from "react"

import {
  confirmBidderOtp,
  getAuctionBids,
  getAuctionLive,
  placeBid,
  sendBidderOtp,
  type AuctionLive,
  type Eligibility,
  type PublicBid,
} from "@lib/data/auctions"

// The live bidding panel (BRD §8.2, §8.6, §8.7, D-14).
//
// ── The client is never authoritative ───────────────────────────────────
// §8.6: "bids are submitted to the server; the client display is not
// authoritative." So the countdown is derived from the server's own clock —
// the poll returns `server_time` and `seconds_remaining`, and the local tick
// counts down from THAT rather than from the browser's Date. A bidder whose
// laptop clock is ten minutes fast still sees the real remaining time.
//
// Polling every 3s while live (D-14), backing off to 15s once ended. No
// websockets: the design's guarantee is server authority, and real-time
// delivery is a comfort on top of it.

type Props = {
  auctionId: string
  initial: AuctionLive
  initialBids: PublicBid[]
  eligibility: Eligibility | null
  isSignedIn: boolean
}

const naira = (kobo: number | null) =>
  kobo == null ? "—" : `₦${(kobo / 100).toLocaleString()}`

const countdown = (seconds: number): string => {
  if (seconds <= 0) return "Ended"
  const d = Math.floor(seconds / 86400)
  const h = Math.floor((seconds % 86400) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (d > 0) return `${d}d ${h}h`
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m ${String(s).padStart(2, "0")}s`
  return `${s}s`
}

const BidPanel = ({
  auctionId,
  initial,
  initialBids,
  eligibility,
  isSignedIn,
}: Props) => {
  const [live, setLive] = useState<AuctionLive>(initial)
  const [bids, setBids] = useState<PublicBid[]>(initialBids)
  const [remaining, setRemaining] = useState(initial.seconds_remaining)
  const [amount, setAmount] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  // Verification state, shown only when the bidder needs it.
  const [phone, setPhone] = useState("")
  const [code, setCode] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [verified, setVerified] = useState(!!eligibility?.eligible)

  const isLive = live.status === "live" && remaining > 0
  const previousEnds = useRef(live.ends_at)

  const refresh = useCallback(async () => {
    const [next, nextBids] = await Promise.all([
      getAuctionLive(auctionId),
      getAuctionBids(auctionId),
    ])
    if (!next) return

    // §8.7 — an extension is broadcast to every viewer, so say so rather
    // than letting the clock mysteriously jump.
    if (next.ends_at !== previousEnds.current) {
      previousEnds.current = next.ends_at
      setNotice("A late bid extended this auction.")
    }

    setLive(next)
    setRemaining(next.seconds_remaining)
    setBids(nextBids)
  }, [auctionId])

  // Poll.
  useEffect(() => {
    const interval = setInterval(refresh, isLive ? 3000 : 15000)
    return () => clearInterval(interval)
  }, [refresh, isLive])

  // Local tick between polls, seeded from the SERVER's remaining seconds.
  useEffect(() => {
    if (!isLive) return
    const tick = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000)
    return () => clearInterval(tick)
  }, [isLive])

  const submit = async (kind: "bid" | "buy_now") => {
    setError(null)
    setNotice(null)
    setBusy(true)

    try {
      const value =
        kind === "buy_now"
          ? (live.buy_now_price ?? 0)
          : Math.round(Number(amount.replace(/[^\d.]/g, "")) * 100)

      const res = await placeBid(auctionId, value, kind)

      setAmount("")
      setNotice(
        kind === "buy_now"
          ? "Bought. We'll email you payment details."
          : res.auction.extended
            ? "Bid accepted — and it extended the auction."
            : "Bid accepted. You're the highest bidder."
      )
      await refresh()
    } catch (e: any) {
      // The server's message is the useful one — it names the new minimum
      // when a bid was too low (§8.11).
      setError(e?.message ?? "That bid didn't go through.")
      await refresh()
    } finally {
      setBusy(false)
    }
  }

  const requestOtp = async () => {
    setError(null)
    setBusy(true)
    try {
      const res = await sendBidderOtp(phone)
      setOtpSent(true)
      setNotice(
        res.sent
          ? `Code sent to ${res.phone}.`
          : `Hold on ${res.retryAfterSeconds}s before requesting another code.`
      )
    } catch (e: any) {
      setError(e?.message ?? "Could not send a code.")
    } finally {
      setBusy(false)
    }
  }

  const confirmOtp = async () => {
    setError(null)
    setBusy(true)
    try {
      const res = await confirmBidderOtp(code)
      if (res.verified && res.eligibility.eligible) {
        setVerified(true)
        setNotice("Verified. You can bid now.")
      } else {
        setError(res.message ?? res.eligibility.reason ?? "Not verified yet.")
      }
    } catch (e: any) {
      setError(e?.message ?? "Could not check that code.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-col gap-5 border border-ui-border-base rounded-lg p-5">
      {/* ── Price and clock ─────────────────────────────────────── */}
      <div className="flex flex-col gap-1">
        <Text className="txt-small text-ui-fg-muted">
          {live.bid_count > 0 ? "Current bid" : "Starting price"}
        </Text>
        <Text className="text-3xl font-bold text-ceedmart-navy tabular-nums">
          {naira(live.current_price ?? live.starting_price)}
        </Text>
        <Text className="txt-small text-ui-fg-subtle">
          {live.bid_count} bid{live.bid_count === 1 ? "" : "s"}
          {live.has_reserve && (
            <>
              {" · "}
              <span className={live.reserve_met ? "text-wholefoods-dark" : ""}>
                {live.reserve_met ? "Reserve met" : "Reserve not met"}
              </span>
            </>
          )}
        </Text>
      </div>

      <div
        className={clx(
          "flex items-baseline justify-between rounded-md px-3 py-2",
          remaining <= 300 && isLive
            ? "bg-ui-bg-subtle border border-ui-border-error"
            : "bg-grey-5"
        )}
      >
        <Text className="txt-small text-ui-fg-muted">
          {isLive ? "Time remaining" : "Status"}
        </Text>
        <Text
          className={clx(
            "font-semibold tabular-nums",
            remaining <= 300 && isLive ? "text-ui-fg-error" : "text-ui-fg-base"
          )}
        >
          {isLive ? countdown(remaining) : live.status.replace(/_/g, " ")}
        </Text>
      </div>

      {live.viewer_is_leading && isLive && (
        <div className="rounded-md bg-wholefoods-bg border border-wholefoods p-3">
          <Text className="txt-small-plus text-wholefoods-dark">
            You&apos;re the highest bidder.
          </Text>
        </div>
      )}

      {notice && (
        <Text className="txt-small text-ui-fg-subtle">{notice}</Text>
      )}
      {error && <Text className="txt-small text-ui-fg-error">{error}</Text>}

      {/* ── Bidding ─────────────────────────────────────────────── */}
      {!isLive ? (
        <Text className="txt-small text-ui-fg-muted">
          {live.status === "scheduled"
            ? "Bidding hasn't opened yet."
            : "Bidding has closed on this item."}
        </Text>
      ) : !isSignedIn ? (
        <Text className="txt-small text-ui-fg-subtle">
          Sign in to place a bid.
        </Text>
      ) : eligibility?.barred ? (
        <Text className="txt-small text-ui-fg-error">
          {eligibility.reason}
        </Text>
      ) : !verified ? (
        // §5.2 — verified email and Nigerian phone before bidding.
        <div className="flex flex-col gap-3 border-t border-ui-border-base pt-4">
          <Text className="txt-small-plus text-ui-fg-base">
            Verify your phone to bid
          </Text>
          <Text className="txt-small text-ui-fg-muted">
            We ask once. It keeps auctions to people who intend to pay.
          </Text>

          {!otpSent ? (
            <>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="08012345678"
                inputMode="tel"
              />
              <Button onClick={requestOtp} isLoading={busy}>
                Send code
              </Button>
            </>
          ) : (
            <>
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="6-digit code"
                inputMode="numeric"
                maxLength={6}
              />
              <Button onClick={confirmOtp} isLoading={busy}>
                Verify
              </Button>
              <button
                type="button"
                onClick={requestOtp}
                className="txt-small text-ui-fg-interactive underline self-start"
              >
                Send another code
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3 border-t border-ui-border-base pt-4">
          <Text className="txt-small text-ui-fg-muted">
            Minimum next bid {naira(live.min_next_bid)}
          </Text>
          <Input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={String(live.min_next_bid / 100)}
            inputMode="numeric"
          />
          <Button
            onClick={() => submit("bid")}
            isLoading={busy}
            disabled={!amount.trim()}
          >
            Place bid
          </Button>

          {live.buy_now_price != null && (
            <Button
              variant="secondary"
              onClick={() => submit("buy_now")}
              isLoading={busy}
            >
              Buy now for {naira(live.buy_now_price)}
            </Button>
          )}
        </div>
      )}

      {/* ── History ─────────────────────────────────────────────── */}
      {bids.length > 0 && (
        <div className="border-t border-ui-border-base pt-4">
          <Text className="txt-small-plus text-ui-fg-base mb-2">
            Bid history
          </Text>
          <ul className="flex flex-col gap-1 max-h-64 overflow-y-auto">
            {bids.map((b) => (
              <li
                key={b.sequence}
                className={clx(
                  "flex justify-between gap-3 txt-small",
                  b.voided && "opacity-50 line-through"
                )}
              >
                {/* §8.6 — bidder identity is masked. */}
                <span className="text-ui-fg-subtle">{b.bidder}</span>
                <span className="tabular-nums text-ui-fg-base">
                  {naira(b.amount)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default BidPanel

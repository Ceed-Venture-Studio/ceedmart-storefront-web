"use client"

import { Button, Text, Textarea, clx } from "@medusajs/ui"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"

import { respondToBuildQuote, type BuildQuoteView } from "@lib/data/builds"

// The customer's view of a build quote, and the accept / revise / reject
// decision (BRD §7.6, §7.7).
//
// Three things the BRD requires be visible before anyone commits: the
// itemised breakdown, the expiry, and the cancellation terms — specifically
// "whether ownership of procured components prevents cancellation after a
// milestone" (§7.9). That last one is the sentence a customer will quote
// back at us in a dispute, so it is shown in full, not linked.

type Props = {
  quote: BuildQuoteView
  countryCode: string
}

const naira = (kobo: number) =>
  `₦${(kobo / 100).toLocaleString("en-NG", { minimumFractionDigits: 0 })}`

const QuoteView = ({ quote, countryCode }: Props) => {
  const router = useRouter()
  const [mode, setMode] = useState<"idle" | "revise" | "reject">("idle")
  const [note, setNote] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const respond = (action: "accept" | "reject" | "request_revision") => {
    setError(null)
    startTransition(async () => {
      try {
        const res = await respondToBuildQuote(quote.reference, action, note)
        if (action === "accept" && res.build) {
          router.push(`/${countryCode}/builds/${quote.reference}?accepted=1`)
          router.refresh()
          return
        }
        setDone(
          action === "reject"
            ? "Thanks for letting us know — we've closed this quote."
            : "We've asked your specialist to revise it. You'll get the new version by email."
        )
      } catch (err: any) {
        setError(err?.message ?? "Something went wrong. Please try again.")
      }
    })
  }

  const allLines = [
    ...(quote.line_items ?? []),
    ...(quote.service_items ?? []),
  ]

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <span className="txt-small font-mono text-ui-fg-muted">
          {quote.reference} · version {quote.version}
        </span>
        <h1 className="text-2xl font-semibold text-ceedmart-navy">
          Your custom {quote.build_type === "laptop" ? "laptop" : "PC"} quote
        </h1>
        {quote.change_note && (
          <Text className="txt-small text-ui-fg-subtle">
            What changed: {quote.change_note}
          </Text>
        )}
      </header>

      <div className="border border-ui-border-base rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-grey-5">
            <tr className="txt-small text-ui-fg-subtle">
              <th className="px-4 py-2 font-medium">Item</th>
              <th className="px-4 py-2 font-medium text-right w-20">Qty</th>
              <th className="px-4 py-2 font-medium text-right w-32">Price</th>
            </tr>
          </thead>
          <tbody>
            {allLines.map((line, i) => (
              <tr key={`${line.label}-${i}`} className="border-t border-grey-10">
                <td className="px-4 py-3">
                  <span className="txt-medium text-ui-fg-base">{line.label}</span>
                  {line.description && (
                    <span className="block txt-small text-ui-fg-muted">
                      {line.description}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right tabular-nums txt-medium">
                  {line.quantity}
                </td>
                <td className="px-4 py-3 text-right tabular-nums txt-medium">
                  {naira(line.unit_price * line.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t border-grey-20 bg-grey-5">
            {[
              ["Subtotal", quote.subtotal],
              ...(quote.discount_total
                ? [["Discount", -quote.discount_total] as const]
                : []),
              ...(quote.tax_total ? [["Tax", quote.tax_total] as const] : []),
              ...(quote.delivery_total
                ? [["Delivery", quote.delivery_total] as const]
                : []),
            ].map(([label, amount]) => (
              <tr key={label as string} className="txt-small text-ui-fg-subtle">
                <td className="px-4 py-1" colSpan={2}>
                  {label}
                </td>
                <td className="px-4 py-1 text-right tabular-nums">
                  {naira(amount as number)}
                </td>
              </tr>
            ))}
            <tr className="border-t border-grey-20">
              <td className="px-4 py-3 txt-medium-plus text-ui-fg-base" colSpan={2}>
                Total
              </td>
              <td className="px-4 py-3 text-right text-xl font-bold tabular-nums text-ceedmart-navy">
                {naira(quote.total)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <dl className="grid grid-cols-1 small:grid-cols-3 gap-4">
        {[
          [
            "Build time",
            quote.build_days ? `About ${quote.build_days} days after you accept` : null,
          ],
          ["Warranty", quote.warranty_text],
          [
            "Valid until",
            new Date(quote.valid_until).toLocaleDateString("en-NG", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
          ],
        ]
          .filter(([, value]) => !!value)
          .map(([label, value]) => (
            <div key={label as string} className="flex flex-col">
              <dt className="txt-small text-ui-fg-muted">{label}</dt>
              <dd className="txt-medium text-ui-fg-base">{value}</dd>
            </div>
          ))}
      </dl>

      {quote.cancellation_terms && (
        <div className="border border-ui-border-base rounded-lg p-4 bg-ui-bg-subtle">
          <Text className="txt-medium-plus text-ui-fg-base mb-1">
            Cancelling this build
          </Text>
          <Text className="txt-small text-ui-fg-subtle whitespace-pre-line">
            {quote.cancellation_terms}
          </Text>
        </div>
      )}

      {done ? (
        <div className="border border-ui-border-base rounded-lg p-4 bg-ui-bg-subtle">
          <Text className="txt-medium text-ui-fg-base">{done}</Text>
        </div>
      ) : !quote.can_accept ? (
        <div className="border border-ui-border-base rounded-lg p-4 bg-grey-5">
          <Text className="txt-medium text-ui-fg-subtle">
            {quote.blocked_reason ?? "This quote can no longer be accepted."}
          </Text>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {mode !== "idle" && (
            <Textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={
                mode === "revise"
                  ? "What would you like changed?"
                  : "Anything you'd like us to know? (optional)"
              }
            />
          )}

          <div className="flex flex-col small:flex-row gap-3">
            {mode === "idle" ? (
              <>
                <Button
                  onClick={() => respond("accept")}
                  isLoading={pending}
                  className="small:flex-1"
                >
                  Accept this quote
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setMode("revise")}
                  className="small:flex-1"
                >
                  Ask for changes
                </Button>
                <Button variant="transparent" onClick={() => setMode("reject")}>
                  No thanks
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() =>
                    respond(mode === "revise" ? "request_revision" : "reject")
                  }
                  isLoading={pending}
                  variant={mode === "reject" ? "danger" : "primary"}
                  className="small:flex-1"
                >
                  {mode === "revise" ? "Send my changes" : "Turn down this quote"}
                </Button>
                <Button variant="secondary" onClick={() => setMode("idle")}>
                  Back
                </Button>
              </>
            )}
          </div>

          {error && <Text className="txt-small text-ui-fg-error">{error}</Text>}
        </div>
      )}
    </div>
  )
}

export default QuoteView

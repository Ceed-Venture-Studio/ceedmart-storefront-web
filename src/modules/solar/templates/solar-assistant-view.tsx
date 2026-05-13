"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@medusajs/ui"
import { recommendSolar } from "@lib/data/solar"
import { getOrCreateSessionId } from "@lib/util/session-id"
import type {
  Appliance,
  RecommendResponse,
  SolarBundle,
} from "../../../types/solar"
import type { PropertyType } from "../data/appliances"
import { APPLIANCE_PRESETS } from "../data/appliances"
import ApplianceForm, {
  presetToRow,
  type ApplianceRow,
} from "../components/appliance-form"
import LoadSummary from "../components/load-summary"
import BundleCard from "../components/bundle-card"
import QuoteModal from "../components/quote-modal"
import PropertyTypeStep from "../components/property-type-step"

const STARTER_PRESET_IDS = ["ac-1.5hp", "fridge-double", "ceiling-fan"]

const buildStarterRows = (): ApplianceRow[] =>
  STARTER_PRESET_IDS.map((id) => APPLIANCE_PRESETS.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => !!p)
    .map(presetToRow)

const rowToApiAppliance = (r: ApplianceRow): Appliance => {
  const a: Appliance = {
    name: r.name,
    qty: r.qty,
    watts: r.watts,
    hours_per_day: r.hours_per_day,
    period: r.period,
  }
  // If user marked it as inverter-type, override the backend's auto surge
  // detection (which would assume 3× for fridges/AC/etc.).
  if (r.inverter_capable && r.is_inverter) {
    a.surge_factor = 1
  }
  return a
}

export default function SolarAssistantView() {
  const [property, setPropertyState] = useState<PropertyType | null>(null)
  const [rows, setRows] = useState<ApplianceRow[]>([])

  const setProperty = (next: PropertyType) => {
    setPropertyState(next)
    // Seed the form on first selection so users see what a typical starting
    // point looks like (and what the inverter toggle is for).
    if (rows.length === 0) {
      setRows(buildStarterRows())
    }
  }
  const [result, setResult] = useState<RecommendResponse | null>(null)
  const [selectedTier, setSelectedTier] = useState<SolarBundle["tier"] | null>(
    null
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [quoteId, setQuoteId] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState<string>("")

  useEffect(() => {
    setSessionId(getOrCreateSessionId())
  }, [])

  const selectedBundle = useMemo(
    () => result?.bundles.find((b) => b.tier === selectedTier) ?? null,
    [result, selectedTier]
  )

  const validRows = rows.filter(
    (r) => r.name.trim() && r.qty > 0 && r.watts > 0 && r.hours_per_day > 0
  )

  const handleCalculate = async () => {
    setError(null)
    if (validRows.length === 0) {
      setError(
        "Add at least one appliance (with watts > 0 and hours > 0)."
      )
      return
    }
    setLoading(true)
    try {
      const res = await recommendSolar({
        session_id: sessionId || undefined,
        appliances: validRows.map(rowToApiAppliance),
      })
      setResult(res)
      setSelectedTier(
        res.bundles.find((b) => b.tier === "recommended")?.tier ??
          res.bundles[0]?.tier ??
          null
      )
      setQuoteId(null)
      setTimeout(
        () =>
          document
            .getElementById("solar-results")
            ?.scrollIntoView({ behavior: "smooth", block: "start" }),
        50
      )
    } catch (err: any) {
      setError(err?.message || "Could not calculate. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setResult(null)
    setSelectedTier(null)
    setQuoteId(null)
    setError(null)
  }

  if (quoteId) {
    return (
      <div className="bg-white border border-grey-20 rounded-rounded p-6 small:p-10 text-center max-w-2xl mx-auto">
        <div className="text-3xl mb-3">✓</div>
        <h2 className="text-2xl font-semibold text-ui-fg-base mb-2">
          Thanks — we&apos;ll be in touch
        </h2>
        <p className="text-sm text-grey-60 mb-1">
          Your quote request{" "}
          <span className="font-mono text-ui-fg-base">{quoteId}</span> has been
          received.
        </p>
        <p className="text-sm text-grey-60 mb-6">
          Our solar team will reach out within one business day.
        </p>
        <Button variant="secondary" onClick={handleReset}>
          Calculate another estimate
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <PropertyTypeStep value={property} onChange={setProperty} />

      {property && (
        <section className="bg-white border border-grey-20 rounded-rounded p-4 small:p-6">
          <h2 className="text-lg font-semibold text-ui-fg-base mb-1">
            What do you really need to keep running?
          </h2>
          <p className="text-sm text-grey-60 mb-5">
            Focus on the essentials — the appliances you can&apos;t go without
            when there&apos;s no power. We&apos;ve started you off with a few
            common ones; remove what doesn&apos;t apply, then search to add
            more or type a name to add a custom item.
          </p>

          <ApplianceForm
            property={property}
            rows={rows}
            onChange={setRows}
            disabled={loading}
          />

          {error && (
            <p className="mt-4 text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <div className="mt-6 flex flex-col small:flex-row gap-3 small:items-center small:justify-between">
            <span className="text-xs text-grey-50">
              {validRows.length} appliance{validRows.length === 1 ? "" : "s"}{" "}
              ready
            </span>
            <Button
              size="large"
              className="bg-ceedmart-navy hover:bg-ceedmart-navy-light"
              onClick={handleCalculate}
              isLoading={loading}
              disabled={validRows.length === 0}
            >
              Calculate solar estimate
            </Button>
          </div>
        </section>
      )}

      {result && (
        <section id="solar-results" className="flex flex-col gap-6 scroll-mt-20">
          <LoadSummary load={result.load} />

          {result.catalog_ready && result.bundles.length > 0 ? (
            <>
              <div>
                <h2 className="text-lg font-semibold text-ui-fg-base mb-1">
                  Pick the bundle that fits you
                </h2>
                <p className="text-sm text-grey-60">
                  All three are sized for the load you entered. Choose the one
                  that suits your budget.
                </p>
              </div>
              <div className="grid grid-cols-1 small:grid-cols-3 gap-4">
                {result.bundles.map((b) => (
                  <BundleCard
                    key={b.tier}
                    bundle={b}
                    selected={selectedTier === b.tier}
                    onSelect={() => setSelectedTier(b.tier)}
                  />
                ))}
              </div>
              <div className="flex justify-center">
                <Button
                  size="large"
                  className="bg-ceedmart-navy hover:bg-ceedmart-navy-light min-w-[240px]"
                  disabled={!selectedBundle}
                  onClick={() => setModalOpen(true)}
                >
                  Get quote for{" "}
                  <span className="capitalize ml-1">{selectedTier}</span>
                </Button>
              </div>
            </>
          ) : (
            <div className="bg-white border border-grey-20 rounded-rounded p-6 text-center">
              <h2 className="text-lg font-semibold text-ui-fg-base mb-2">
                We&apos;ll prepare a custom quote for you
              </h2>
              <p className="text-sm text-grey-60 mb-4">
                Based on your load profile above, our team will hand-pick the
                right inverter, battery, and panels and get back to you with a
                tailored quote.
              </p>
              <a
                href="https://wa.me/2347087502195"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-10 px-5 rounded-base bg-ceedmart-navy text-white text-sm font-semibold hover:bg-ceedmart-navy-light"
              >
                Chat with us on WhatsApp
              </a>
            </div>
          )}
        </section>
      )}

      {selectedBundle && result?.catalog_ready && (
        <QuoteModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          bundle={selectedBundle}
          calculationId={result.calculation_id}
          onSuccess={(id) => {
            setModalOpen(false)
            setQuoteId(id)
          }}
        />
      )}
    </div>
  )
}

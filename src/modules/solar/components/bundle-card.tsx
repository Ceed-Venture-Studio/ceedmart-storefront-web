"use client"

import { convertToLocale } from "@lib/util/money"
import { clx } from "@medusajs/ui"
import type { SolarBundle, SolarComponent } from "../../../types/solar"

type Props = {
  bundle: SolarBundle
  selected: boolean
  onSelect: () => void
}

const tierLabels: Record<SolarBundle["tier"], string> = {
  budget: "Budget",
  recommended: "Recommended",
  premium: "Premium",
}

const ComponentRow = ({
  label,
  comp,
}: {
  label: string
  comp: SolarComponent | null
}) => {
  if (!comp) {
    return (
      <div className="flex justify-between text-sm text-grey-50">
        <span>{label}</span>
        <span>—</span>
      </div>
    )
  }
  const spec =
    comp.capacity_kw != null
      ? `${comp.capacity_kw} kW`
      : comp.capacity_kwh != null
        ? `${comp.capacity_kwh} kWh`
        : comp.panel_watts != null
          ? `${comp.panel_watts}W`
          : ""
  return (
    <div className="flex justify-between gap-3 text-sm">
      <span className="text-grey-60">{label}</span>
      <span className="text-right text-ui-fg-base font-medium">
        {comp.qty > 1 ? `${comp.qty} × ` : ""}
        {comp.title}
        {spec && <span className="text-grey-50"> · {spec}</span>}
      </span>
    </div>
  )
}

export default function BundleCard({ bundle, selected, onSelect }: Props) {
  const total =
    bundle.total_price != null && bundle.currency_code
      ? convertToLocale({
          amount: bundle.total_price,
          currency_code: bundle.currency_code,
          maximumFractionDigits: 0,
        })
      : null

  return (
    <button
      type="button"
      onClick={onSelect}
      className={clx(
        "flex flex-col gap-4 text-left bg-white rounded-rounded p-5 border-2 transition-all",
        selected
          ? "border-ceedmart-navy shadow-md"
          : "border-grey-20 hover:border-grey-40"
      )}
    >
      <div className="flex items-center justify-between">
        <span
          className={clx(
            "px-2.5 py-1 rounded-base text-xs font-semibold uppercase tracking-wide",
            bundle.tier === "recommended"
              ? "bg-ceedmart-navy text-white"
              : bundle.tier === "premium"
                ? "bg-ceedmart-gold text-ceedmart-navy"
                : "bg-grey-10 text-grey-70"
          )}
        >
          {tierLabels[bundle.tier]}
        </span>
        {total && (
          <span className="text-xl font-semibold text-ui-fg-base">{total}</span>
        )}
      </div>

      <div className="flex flex-col gap-2 border-t border-b border-grey-10 py-3">
        <ComponentRow label="Inverter" comp={bundle.inverter} />
        <ComponentRow label="Battery" comp={bundle.battery} />
        <ComponentRow label="Panels" comp={bundle.panels} />
      </div>

      <ul className="flex flex-col gap-1.5 text-sm text-grey-70">
        {bundle.why.map((line, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-ceedmart-navy">•</span>
            <span>{line}</span>
          </li>
        ))}
      </ul>

      {bundle.can_power.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {bundle.can_power.map((c) => (
            <span
              key={c.label}
              className="px-2 py-0.5 bg-wholefoods-bg text-wholefoods-dark text-xs font-medium rounded-circle"
            >
              {c.qty}× {c.label}
            </span>
          ))}
        </div>
      )}

      {bundle.cannot_power.length > 0 && (
        <p className="text-xs text-grey-50">
          Won&apos;t power: {bundle.cannot_power.join(", ")}
        </p>
      )}

      <div
        className={clx(
          "mt-auto h-10 flex items-center justify-center rounded-base text-sm font-semibold transition-colors",
          selected
            ? "bg-ceedmart-navy text-white"
            : "bg-grey-10 text-grey-70"
        )}
      >
        {selected ? "Selected" : "Select this option"}
      </div>
    </button>
  )
}

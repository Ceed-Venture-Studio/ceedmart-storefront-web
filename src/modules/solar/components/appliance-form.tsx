"use client"

import { clx } from "@medusajs/ui"
import type { AppliancePreset, PropertyType } from "../data/appliances"
import AppliancePicker from "./appliance-picker"

export type ApplianceRow = {
  preset_id: string | null
  name: string
  watts: number
  qty: number
  hours_per_day: number
  period: "day" | "night" | "both"
  // only meaningful for inverter-capable presets
  inverter_capable: boolean
  is_inverter: boolean
  // mirror preset fields we need at submit time
  base_watts: number
  inverter_watts: number | null
  heavy_motor: boolean
}

type Props = {
  property: PropertyType
  rows: ApplianceRow[]
  onChange: (next: ApplianceRow[]) => void
  disabled?: boolean
}

export const presetToRow = (p: AppliancePreset): ApplianceRow => ({
  preset_id: p.id,
  name: p.name,
  watts: p.watts,
  qty: 1,
  hours_per_day: p.default_hours,
  period: p.default_period,
  inverter_capable: !!p.inverter_capable,
  is_inverter: false,
  base_watts: p.watts,
  inverter_watts: p.inverter_watts ?? null,
  heavy_motor: !!p.heavy_motor,
})

export const customToRow = (name: string): ApplianceRow => ({
  preset_id: null,
  name,
  watts: 100,
  qty: 1,
  hours_per_day: 4,
  period: "both",
  inverter_capable: false,
  is_inverter: false,
  base_watts: 100,
  inverter_watts: null,
  heavy_motor: false,
})

export default function ApplianceForm({
  property,
  rows,
  onChange,
  disabled,
}: Props) {
  const update = (i: number, patch: Partial<ApplianceRow>) => {
    onChange(rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)))
  }

  const remove = (i: number) => {
    onChange(rows.filter((_, idx) => idx !== i))
  }

  const handlePickPreset = (p: AppliancePreset) => {
    const existing = rows.findIndex((r) => r.preset_id === p.id)
    if (existing >= 0) {
      update(existing, { qty: rows[existing].qty + 1 })
      return
    }
    onChange([...rows, presetToRow(p)])
  }

  const handleAddCustom = (name: string) => {
    onChange([...rows, customToRow(name)])
  }

  const toggleInverter = (i: number) => {
    const r = rows[i]
    if (!r.inverter_capable) return
    const nextIsInverter = !r.is_inverter
    update(i, {
      is_inverter: nextIsInverter,
      watts:
        nextIsInverter && r.inverter_watts != null
          ? r.inverter_watts
          : r.base_watts,
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <AppliancePicker
        property={property}
        onPick={handlePickPreset}
        onAddCustom={handleAddCustom}
      />

      {rows.length === 0 ? (
        <div className="border border-dashed border-grey-30 rounded-rounded p-6 text-center text-sm text-grey-60">
          Search above to add your first appliance.
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {rows.map((r, i) => (
            <li
              key={i}
              className="flex flex-col gap-3 p-3 small:p-4 bg-white border border-grey-20 rounded-rounded"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-ui-fg-base truncate">
                    {r.name}
                  </div>
                  {r.preset_id === null && (
                    <div className="text-[11px] text-grey-50 mt-0.5">
                      Custom appliance
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  disabled={disabled}
                  aria-label={`Remove ${r.name}`}
                  className="w-8 h-8 flex items-center justify-center text-grey-50 hover:text-red-500 hover:bg-grey-10 rounded-base text-lg shrink-0"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-2 small:grid-cols-4 gap-3">
                <NumberField
                  label="Qty"
                  value={r.qty}
                  min={1}
                  step={1}
                  onChange={(v) => update(i, { qty: Math.max(1, Math.round(v)) })}
                  disabled={disabled}
                />
                <NumberField
                  label="Watts"
                  value={r.watts}
                  min={0}
                  step={10}
                  onChange={(v) => update(i, { watts: Math.max(0, Math.round(v)) })}
                  disabled={disabled}
                />
                <NumberField
                  label="Hours / day"
                  value={r.hours_per_day}
                  min={0}
                  max={24}
                  step={0.5}
                  onChange={(v) =>
                    update(i, { hours_per_day: Math.min(24, Math.max(0, v)) })
                  }
                  disabled={disabled}
                />
                <SelectField
                  label="Period"
                  value={r.period}
                  onChange={(v) =>
                    update(i, { period: v as ApplianceRow["period"] })
                  }
                  disabled={disabled}
                  options={[
                    { value: "both", label: "Day & Night" },
                    { value: "day", label: "Day only" },
                    { value: "night", label: "Night only" },
                  ]}
                />
              </div>

              {r.inverter_capable && (
                <label
                  className={clx(
                    "flex items-center gap-2 text-sm select-none cursor-pointer",
                    disabled && "pointer-events-none opacity-50"
                  )}
                >
                  <input
                    type="checkbox"
                    checked={r.is_inverter}
                    onChange={() => toggleInverter(i)}
                    disabled={disabled}
                    className="w-4 h-4 accent-ceedmart-navy"
                  />
                  <span className="text-ui-fg-base font-medium">
                    Inverter type
                  </span>
                  <span className="text-xs text-grey-50">
                    (variable-speed — lower power draw, no surge)
                  </span>
                </label>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function NumberField({
  label,
  value,
  min,
  max,
  step,
  onChange,
  disabled,
}: {
  label: string
  value: number
  min?: number
  max?: number
  step?: number
  onChange: (v: number) => void
  disabled?: boolean
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-grey-50">
        {label}
      </span>
      <input
        type="number"
        value={value || ""}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        onChange={(e) => {
          const n = parseFloat(e.target.value)
          onChange(Number.isFinite(n) ? n : 0)
        }}
        className="h-10 px-3 rounded-base border border-grey-20 bg-white text-sm text-ui-fg-base focus:outline-none focus:border-ceedmart-navy"
      />
    </label>
  )
}

function SelectField({
  label,
  value,
  onChange,
  disabled,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  disabled?: boolean
  options: { value: string; label: string }[]
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-grey-50">
        {label}
      </span>
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 px-2 rounded-base border border-grey-20 bg-white text-sm text-ui-fg-base focus:outline-none focus:border-ceedmart-navy"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )
}

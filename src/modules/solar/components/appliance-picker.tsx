"use client"

import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react"
import { clx } from "@medusajs/ui"
import { useMemo, useState } from "react"
import type { AppliancePreset, PropertyType } from "../data/appliances"
import { APPLIANCE_PRESETS, getPresetsForProperty } from "../data/appliances"

type Props = {
  property: PropertyType
  onPick: (preset: AppliancePreset) => void
  onAddCustom: (name: string) => void
}

type Choice =
  | { kind: "preset"; preset: AppliancePreset }
  | { kind: "custom"; name: string }

export default function AppliancePicker({ property, onPick, onAddCustom }: Props) {
  const [query, setQuery] = useState("")

  const propertyPresets = useMemo(
    () => getPresetsForProperty(property),
    [property]
  )

  // Empty query → show curated list for the chosen property.
  // Active query → search the full catalog so a home user can still find
  // "Photocopier" or an office user can find "Yam Pounder".
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return propertyPresets
    const matches = (p: AppliancePreset) =>
      p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    const inProperty = propertyPresets.filter(matches)
    const others = APPLIANCE_PRESETS.filter(
      (p) => !p.property_types.includes(property) && matches(p)
    )
    return [...inProperty, ...others]
  }, [propertyPresets, property, query])

  const exactMatch = useMemo(
    () =>
      filtered.find((p) => p.name.toLowerCase() === query.trim().toLowerCase()),
    [filtered, query]
  )

  const grouped = useMemo(() => {
    const map = new Map<string, AppliancePreset[]>()
    for (const p of filtered) {
      const arr = map.get(p.category) ?? []
      arr.push(p)
      map.set(p.category, arr)
    }
    return Array.from(map.entries())
  }, [filtered])

  const handleChange = (choice: Choice | null) => {
    if (!choice) return
    if (choice.kind === "preset") {
      onPick(choice.preset)
    } else if (choice.name.trim()) {
      onAddCustom(choice.name.trim())
    }
    setQuery("")
  }

  return (
    <Combobox<Choice | null>
      value={null}
      onChange={handleChange}
      immediate
    >
      <div className="relative">
        <div className="flex items-center bg-white border border-grey-20 rounded-base focus-within:border-ceedmart-navy">
          <span className="pl-3 text-grey-50 text-base">🔍</span>
          <ComboboxInput
            className="w-full h-11 px-3 bg-transparent text-sm text-ui-fg-base focus:outline-none placeholder:text-grey-50"
            placeholder="Search appliances or type to add a custom one…"
            displayValue={() => query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
          />
          <ComboboxButton className="px-3 text-grey-50 hover:text-grey-70" aria-label="Show appliance list">
            ▾
          </ComboboxButton>
        </div>

        <ComboboxOptions className="absolute z-20 mt-1 w-full max-h-80 overflow-auto bg-white border border-grey-20 rounded-rounded shadow-lg empty:invisible">
          {query.trim() && !exactMatch && (
            <ComboboxOption
              value={{ kind: "custom", name: query.trim() } as Choice}
              className={({ focus }) =>
                clx(
                  "px-3 py-2.5 text-sm cursor-pointer flex items-center gap-2",
                  focus ? "bg-ceedmart-navy/5 text-ceedmart-navy" : "text-ui-fg-base"
                )
              }
            >
              <span className="font-semibold">+ Add</span>
              <span className="font-medium">&ldquo;{query.trim()}&rdquo;</span>
              <span className="text-xs text-grey-50 ml-auto">Custom</span>
            </ComboboxOption>
          )}

          {grouped.length === 0 && !query.trim() && (
            <div className="px-3 py-3 text-sm text-grey-50">No appliances available</div>
          )}

          {grouped.map(([category, items]) => (
            <div key={category}>
              <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-grey-50 bg-grey-5 sticky top-0">
                {category}
              </div>
              {items.map((p) => (
                <ComboboxOption
                  key={p.id}
                  value={{ kind: "preset", preset: p } as Choice}
                  className={({ focus }) =>
                    clx(
                      "px-3 py-2 text-sm cursor-pointer flex items-center justify-between gap-3",
                      focus ? "bg-ceedmart-navy/5 text-ceedmart-navy" : "text-ui-fg-base"
                    )
                  }
                >
                  <span>{p.name}</span>
                  <span className="text-xs text-grey-50">
                    {p.inverter_watts ?? p.watts}–{p.watts}W
                  </span>
                </ComboboxOption>
              ))}
            </div>
          ))}
        </ComboboxOptions>
      </div>
    </Combobox>
  )
}

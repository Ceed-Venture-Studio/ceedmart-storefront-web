"use client"

import { useMemo, useState } from "react"
import { clx } from "@medusajs/ui"

export type FilterOption = {
  value: string
  label: string
}

type Props = {
  title: string
  options: FilterOption[]
  selected: string[]
  onToggle: (value: string) => void
  initiallyOpen?: boolean
  searchable?: boolean
}

export default function FilterCheckboxGroup({
  title,
  options,
  selected,
  onToggle,
  initiallyOpen = true,
  searchable = false,
}: Props) {
  const [open, setOpen] = useState(initiallyOpen)
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return options
    return options.filter((o) => o.label.toLowerCase().includes(q))
  }, [options, query])

  return (
    <div className="border-b border-grey-10 pb-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between w-full py-2 text-left"
      >
        <span className="text-sm font-semibold text-ui-fg-base">
          {title}
          {selected.length > 0 && (
            <span className="ml-2 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-ceedmart-navy text-white text-[11px] font-semibold">
              {selected.length}
            </span>
          )}
        </span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className={clx(
            "w-4 h-4 text-grey-50 transition-transform",
            open ? "rotate-180" : ""
          )}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="mt-2 flex flex-col gap-1.5">
          {searchable && options.length > 8 && (
            <input
              type="text"
              value={query}
              placeholder="Search…"
              onChange={(e) => setQuery(e.target.value)}
              className="h-9 px-3 mb-1 rounded-base border border-grey-20 bg-white text-sm focus:outline-none focus:border-ceedmart-navy"
            />
          )}
          <ul className="flex flex-col gap-0.5 max-h-64 overflow-y-auto">
            {filtered.map((o) => {
              const isOn = selected.includes(o.value)
              return (
                <li key={o.value}>
                  <label
                    className={clx(
                      "flex items-center gap-2.5 cursor-pointer rounded-base px-2 py-1.5 hover:bg-grey-5 transition-colors",
                      isOn && "bg-ceedmart-navy/5"
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={isOn}
                      onChange={() => onToggle(o.value)}
                      className="w-4 h-4 accent-ceedmart-navy"
                    />
                    <span
                      className={clx(
                        "text-sm",
                        isOn
                          ? "text-ceedmart-navy font-medium"
                          : "text-ui-fg-base"
                      )}
                    >
                      {o.label}
                    </span>
                  </label>
                </li>
              )
            })}
            {filtered.length === 0 && (
              <li className="text-xs text-grey-50 px-2 py-2">No matches.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

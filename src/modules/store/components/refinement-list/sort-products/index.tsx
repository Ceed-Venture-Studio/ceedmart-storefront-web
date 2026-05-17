"use client"

import { clx } from "@medusajs/ui"

export type SortOptions = "price_asc" | "price_desc" | "created_at"

const sortOptions: { value: SortOptions; label: string }[] = [
  { value: "created_at", label: "Latest arrivals" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
]

type Props = {
  sortBy: SortOptions
  onChange: (value: SortOptions) => void
}

const SortProducts = ({ sortBy, onChange }: Props) => {
  return (
    <div className="border-b border-grey-10 pb-4">
      <div className="py-2 text-sm font-semibold text-ui-fg-base">Sort by</div>
      <ul className="flex flex-col gap-0.5">
        {sortOptions.map((o) => {
          const active = sortBy === o.value
          return (
            <li key={o.value}>
              <label
                className={clx(
                  "flex items-center gap-2.5 cursor-pointer rounded-base px-2 py-1.5 hover:bg-grey-5 transition-colors",
                  active && "bg-ceedmart-navy/5"
                )}
              >
                <input
                  type="radio"
                  name="sort-by"
                  checked={active}
                  onChange={() => onChange(o.value)}
                  className="w-4 h-4 accent-ceedmart-navy"
                />
                <span
                  className={clx(
                    "text-sm",
                    active
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
      </ul>
    </div>
  )
}

export default SortProducts

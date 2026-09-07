"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useEffect, useState, useTransition } from "react"
import { convertToLocale } from "@lib/util/money"
import type { PreorderFacets } from "@lib/data/preorder"

// Search and filters for the pre-order list (BRD §6.3).
//
// State lives in the URL rather than in the component. A shopper who filters
// to "under ₦400,000, arriving within two weeks" and sends that link to
// someone should be sending what they are looking at, and coming back via
// the browser's back button should restore it. It also keeps the list a
// server component: the page re-renders from the query string instead of
// this fetching a second copy of the data.

type Props = {
  facets: PreorderFacets
  count: number
  total: number
}

const SORTS = [
  { value: "", label: "Most recent" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "fastest", label: "Arrives soonest" },
]

const label = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1).replace(/_/g, " ")

const PreorderFilters = ({ facets, count, total }: Props) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [pending, startTransition] = useTransition()

  // Typing is local; the URL is only rewritten once the customer pauses.
  // Pushing on every keystroke would put a history entry behind each letter
  // and make the back button unusable.
  const [term, setTerm] = useState(searchParams.get("q") ?? "")

  const apply = (changes: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(changes)) {
      if (value === null || value === "") {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    }
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    })
  }

  useEffect(() => {
    const current = searchParams.get("q") ?? ""
    if (term === current) {
      return
    }
    const timer = setTimeout(() => apply({ q: term || null }), 300)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term])

  const get = (key: string) => searchParams.get(key) ?? ""

  const hasFilters = ["q", "condition", "source", "max_days", "max_price", "sort"]
    .some((k) => searchParams.get(k))

  const priceCeiling = facets.price_range
    ? Math.ceil(facets.price_range.max / 100)
    : null

  return (
    <div className="flex flex-col gap-4 mb-8">
      <div className="flex flex-col small:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="search"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search pre-orders — try a brand, model or condition"
            aria-label="Search pre-orders"
            data-testid="preorder-search"
            className="w-full h-11 pl-4 pr-4 rounded-md border border-grey-20 bg-white text-sm focus:outline-none focus:border-ceedmart-navy transition-colors"
          />
        </div>

        <select
          value={get("sort")}
          onChange={(e) => apply({ sort: e.target.value || null })}
          aria-label="Sort pre-orders"
          data-testid="preorder-sort"
          className="h-11 rounded-md border border-grey-20 bg-white px-3 text-sm"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Only rendered when there is more than one value to choose between.
            A filter with a single option is not a choice, it is furniture. */}
        {facets.conditions.length > 1 && (
          <select
            value={get("condition")}
            onChange={(e) => apply({ condition: e.target.value || null })}
            aria-label="Filter by condition"
            data-testid="preorder-condition"
            className="h-9 rounded-md border border-grey-20 bg-white px-3 text-sm"
          >
            <option value="">Any condition</option>
            {facets.conditions.map((c) => (
              <option key={c} value={c}>
                {label(c)}
              </option>
            ))}
          </select>
        )}

        {facets.max_days > 0 && (
          <select
            value={get("max_days")}
            onChange={(e) => apply({ max_days: e.target.value || null })}
            aria-label="Filter by delivery time"
            data-testid="preorder-max-days"
            className="h-9 rounded-md border border-grey-20 bg-white px-3 text-sm"
          >
            <option value="">Any delivery time</option>
            {[7, 14, 21, 30]
              .filter((d) => d < facets.max_days)
              .map((d) => (
                <option key={d} value={String(d)}>
                  Within {d} days
                </option>
              ))}
          </select>
        )}

        {priceCeiling !== null && facets.price_range && (
          <select
            value={get("max_price")}
            onChange={(e) => apply({ max_price: e.target.value || null })}
            aria-label="Filter by price"
            data-testid="preorder-max-price"
            className="h-9 rounded-md border border-grey-20 bg-white px-3 text-sm"
          >
            <option value="">Any price</option>
            {[100000, 250000, 500000, 1000000, 2000000]
              .filter((p) => p < priceCeiling)
              .map((p) => (
                <option key={p} value={String(p)}>
                  Under{" "}
                  {convertToLocale({
                    amount: p,
                    currency_code: "ngn",
                    maximumFractionDigits: 0,
                  })}
                </option>
              ))}
          </select>
        )}

        {hasFilters && (
          <button
            type="button"
            onClick={() => {
              setTerm("")
              apply({
                q: null,
                condition: null,
                source: null,
                max_days: null,
                max_price: null,
                sort: null,
              })
            }}
            className="h-9 px-3 text-sm underline text-ceedmart-navy"
            data-testid="preorder-clear-filters"
          >
            Clear
          </button>
        )}

        <span
          className="text-sm text-ui-fg-subtle ml-auto"
          aria-live="polite"
          data-testid="preorder-result-count"
        >
          {pending
            ? "Searching…"
            : count === total
              ? `${total} pre-order${total === 1 ? "" : "s"}`
              : `${count} of ${total}`}
        </span>
      </div>
    </div>
  )
}

export default PreorderFilters

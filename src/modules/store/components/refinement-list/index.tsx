"use client"

import { clx } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useMemo, useState } from "react"

import SortProducts, { SortOptions } from "./sort-products"
import FilterCheckboxGroup from "./filter-checkbox-group"

type Props = {
  sortBy: SortOptions
  categories?: HttpTypes.StoreProductCategory[]
  collections?: HttpTypes.StoreCollection[]
  "data-testid"?: string
}

const RefinementList = ({
  sortBy,
  categories = [],
  collections = [],
  "data-testid": dataTestId,
}: Props) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [mobileOpen, setMobileOpen] = useState(false)

  const selectedCategoryIds = useMemo(
    () => searchParams.getAll("category_id"),
    [searchParams]
  )
  const selectedCollectionIds = useMemo(
    () => searchParams.getAll("collection_id"),
    [searchParams]
  )

  const totalActive =
    selectedCategoryIds.length + selectedCollectionIds.length

  const buildHref = useCallback(
    (mutate: (p: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams)
      mutate(params)
      params.delete("page")
      const qs = params.toString()
      return qs ? `${pathname}?${qs}` : pathname
    },
    [pathname, searchParams]
  )

  const pushNext = (mutate: (p: URLSearchParams) => void) => {
    router.push(buildHref(mutate), { scroll: false })
  }

  const handleSort = (next: SortOptions) =>
    pushNext((p) => p.set("sortBy", next))

  const toggleMulti = (key: string) => (value: string) =>
    pushNext((p) => {
      const current = p.getAll(key)
      p.delete(key)
      const set = new Set(current)
      if (set.has(value)) set.delete(value)
      else set.add(value)
      for (const v of set) p.append(key, v)
    })

  const clearAll = () =>
    pushNext((p) => {
      p.delete("category_id")
      p.delete("collection_id")
    })

  const categoryOptions = useMemo(
    () =>
      (categories || [])
        .filter((c) => !c.parent_category)
        .map((c) => ({ value: c.id, label: c.name })),
    [categories]
  )

  const collectionOptions = useMemo(
    () => (collections || []).map((c) => ({ value: c.id, label: c.title })),
    [collections]
  )

  const FilterPanel = (
    <div className="flex flex-col gap-4" data-testid={dataTestId}>
      <SortProducts sortBy={sortBy} onChange={handleSort} />
      {categoryOptions.length > 0 && (
        <FilterCheckboxGroup
          title="Category"
          options={categoryOptions}
          selected={selectedCategoryIds}
          onToggle={toggleMulti("category_id")}
          searchable
        />
      )}
      {collectionOptions.length > 0 && (
        <FilterCheckboxGroup
          title="Collection"
          options={collectionOptions}
          selected={selectedCollectionIds}
          onToggle={toggleMulti("collection_id")}
          searchable
        />
      )}
      {totalActive > 0 && (
        <button
          type="button"
          onClick={clearAll}
          className="self-start text-sm font-semibold text-ceedmart-navy hover:text-ceedmart-navy-light"
        >
          Clear all filters
        </button>
      )}
    </div>
  )

  return (
    <>
      {/* Mobile trigger */}
      <div className="flex small:hidden items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="inline-flex items-center gap-2 h-10 px-4 rounded-full border border-grey-20 bg-white text-sm font-semibold text-ui-fg-base hover:border-ceedmart-navy"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 6h18M6 12h12M10 18h4"
            />
          </svg>
          Filter & sort
          {totalActive > 0 && (
            <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-ceedmart-navy text-white text-[11px] font-semibold">
              {totalActive}
            </span>
          )}
        </button>
        {totalActive > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="text-sm font-semibold text-grey-60 hover:text-ceedmart-navy"
          >
            Clear
          </button>
        )}
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden small:block small:min-w-[260px] small:max-w-[260px] small:mr-8 sticky top-20 self-start">
        <div className="bg-white border border-grey-20 rounded-rounded p-4">
          <h2 className="text-base font-semibold text-ui-fg-base mb-3">
            Filter & sort
          </h2>
          {FilterPanel}
        </div>
      </aside>

      {/* Mobile drawer */}
      <div
        className={clx(
          "fixed inset-0 z-[60] small:hidden",
          mobileOpen ? "" : "pointer-events-none"
        )}
        aria-hidden={!mobileOpen}
      >
        <div
          className={clx(
            "absolute inset-0 bg-black/40 transition-opacity",
            mobileOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={clx(
            "absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white shadow-2xl transition-transform",
            mobileOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex items-center justify-between p-4 border-b border-grey-10">
            <h2 className="text-base font-semibold text-ui-fg-base">
              Filter & sort
            </h2>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close filters"
              className="w-9 h-9 rounded-base text-grey-60 hover:bg-grey-10 flex items-center justify-center text-2xl leading-none"
            >
              ×
            </button>
          </div>
          <div className="overflow-y-auto p-4 h-[calc(100%-65px)]">
            {FilterPanel}
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="mt-6 w-full h-11 rounded-base bg-ceedmart-navy hover:bg-ceedmart-navy-light text-white text-sm font-semibold"
            >
              View results
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default RefinementList

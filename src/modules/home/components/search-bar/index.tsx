"use client"

import { useRouter, useParams } from "next/navigation"
import { useState, useTransition, FormEvent } from "react"

export default function SearchBar({
  buttonClassName,
  initialQuery = "",
}: {
  buttonClassName?: string
  initialQuery?: string
}) {
  const [query, setQuery] = useState(initialQuery)
  const router = useRouter()
  const { countryCode } = useParams()

  // router.push to a server-rendered route resolves on the SERVER, so there is
  // a gap of a second or more where nothing on the page changes. Without this
  // the button looks broken and people press it again. useTransition is the
  // only way to observe that gap — the navigation itself exposes no state.
  const [isPending, startTransition] = useTransition()

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    if (!q || isPending) {
      return
    }
    startTransition(() => {
      router.push(`/${countryCode}/store?q=${encodeURIComponent(q)}`)
    })
  }

  return (
    <form
      onSubmit={handleSearch}
      className="w-full max-w-2xl mx-auto"
      data-hero-search
    >
      <div className="relative w-full">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-grey-40"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search wholesale products, brands, or categories..."
          className="w-full h-12 pl-12 pr-14 rounded-full border border-grey-20 bg-white text-sm text-grey-90 placeholder:text-grey-40 focus:outline-none focus:border-ceedmart-navy transition-colors shadow-sm hover:shadow-md focus:shadow-md"
        />
        <button
          type="submit"
          disabled={isPending || !query.trim()}
          aria-busy={isPending}
          aria-label={isPending ? "Searching" : "Search"}
          className={
            buttonClassName ||
            "absolute right-1.5 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-ceedmart-navy text-white flex items-center justify-center hover:bg-ceedmart-navy-light transition-colors disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-ceedmart-navy"
          }
          data-testid="hero-search-button"
        >
          {isPending ? (
            <svg
              className="h-4 w-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth={4}
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          ) : (
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          )}
        </button>
      </div>
    </form>
  )
}

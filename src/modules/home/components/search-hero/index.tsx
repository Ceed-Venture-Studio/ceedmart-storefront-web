"use client"

import { useRouter, useParams } from "next/navigation"
import { useState, FormEvent } from "react"

type Category = {
  id: string
  name: string
  handle: string
}

type ExtraPill = {
  id: string
  name: string
  href: string // pre-resolved path relative to country root (e.g. "/collections/foo")
}

type Tone = "light" | "dark"

export default function SearchHero({
  categories,
  extras = [],
  tone = "dark",
}: {
  categories: Category[]
  extras?: ExtraPill[]
  tone?: Tone
}) {
  const isLight = tone === "light"
  const [query, setQuery] = useState("")
  const router = useRouter()
  const { countryCode } = useParams()

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/${countryCode}/store?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const handleCategoryClick = (handle: string) => {
    router.push(`/${countryCode}/categories/${handle}`)
  }

  const handleExtraClick = (href: string) => {
    router.push(`/${countryCode}${href}`)
  }

  return (
    <div className="w-full flex flex-col items-center px-6">
      <div className="flex flex-col items-center gap-5 small:gap-6 w-full max-w-3xl">
        {/* Slogan + SEO caption */}
        <div className="flex flex-col items-center text-center gap-1">
          <p
            className={
              isLight
                ? "text-white text-base small:text-lg font-semibold drop-shadow-sm"
                : "text-ceedmart-navy text-base small:text-lg font-semibold"
            }
          >
            Quality products, great prices…
          </p>
          <h1
            className={
              isLight
                ? "text-white/90 text-sm small:text-base font-medium drop-shadow-sm"
                : "text-grey-70 text-sm small:text-base font-medium"
            }
          >
            Whole Foods · Solar Power · CCTV · Computer & Accessories
          </h1>
        </div>

        {/* Search Input */}
        <form
          onSubmit={handleSearch}
          className="w-full"
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
              placeholder="Search whole foods, electronics, solar, furniture…"
              className="w-full h-14 pl-12 pr-14 rounded-full border-2 border-grey-20 bg-white text-base text-grey-90 placeholder:text-grey-40 focus:outline-none focus:border-ceedmart-navy transition-colors shadow-sm hover:shadow-md focus:shadow-md"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-ceedmart-navy text-white flex items-center justify-center hover:bg-ceedmart-navy-light transition-colors"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </button>
          </div>
        </form>

        {/* Category Pills */}
        {(categories.length > 0 || extras.length > 0) && (
          <div className="w-full -mx-6 px-6 overflow-x-auto small:overflow-visible">
            <div className="flex small:flex-wrap items-center justify-start small:justify-center gap-2.5 small:gap-3 mt-1 pb-1 min-w-max small:min-w-0">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.handle)}
                  className="shrink-0 px-5 py-2.5 rounded-full border border-grey-20 bg-white text-base font-medium text-grey-80 hover:border-ceedmart-navy hover:text-ceedmart-navy hover:bg-ceedmart-navy/5 hover:shadow-sm transition-all cursor-pointer whitespace-nowrap"
                >
                  {category.name}
                </button>
              ))}
              {extras.map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => handleExtraClick(pill.href)}
                  className="shrink-0 px-5 py-2.5 rounded-full border border-ceedmart-gold/60 bg-ceedmart-gold/15 text-base font-medium text-ceedmart-navy hover:border-ceedmart-gold hover:bg-ceedmart-gold/25 hover:shadow-sm transition-all cursor-pointer whitespace-nowrap"
                >
                  {pill.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

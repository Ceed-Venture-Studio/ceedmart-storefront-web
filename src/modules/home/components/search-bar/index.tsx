"use client"

import { useRouter, useParams } from "next/navigation"
import { useState, FormEvent } from "react"

export default function SearchBar() {
  const [query, setQuery] = useState("")
  const router = useRouter()
  const { countryCode } = useParams()

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/${countryCode}/store?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto">
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
          placeholder="Search for products, brands, or categories..."
          className="w-full h-12 pl-12 pr-14 rounded-full border border-grey-20 bg-white text-sm text-grey-90 placeholder:text-grey-40 focus:outline-none focus:border-ceedmart-navy transition-colors shadow-sm hover:shadow-md focus:shadow-md"
        />
        <button
          type="submit"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-ceedmart-navy text-white flex items-center justify-center hover:bg-ceedmart-navy-light transition-colors"
        >
          <svg
            className="h-4 w-4"
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
  )
}

"use client"

import Image from "next/image"
import { useRouter, useParams } from "next/navigation"
import { useState, FormEvent } from "react"

type Category = {
  id: string
  name: string
  handle: string
}

export default function SearchHero({
  categories,
}: {
  categories: Category[]
}) {
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

  return (
    <div className="w-full flex flex-col items-center px-6">
      <div className="flex flex-col items-center gap-8 w-full max-w-2xl">
        {/* Logo & Brand */}
        <div className="flex flex-col items-center gap-3">
          <Image
            src="/logo.png"
            alt="CeedMart"
            width={72}
            height={72}
            className="h-[72px] w-[72px]"
          />
          <h1 className="text-ceedmart-navy text-3xl font-bold tracking-tight">
            CeedMart
          </h1>
          <p className="text-grey-50 text-base">
            What are you looking for today?
          </p>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearch} className="w-full">
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
        {categories.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.handle)}
                className="px-4 py-2 rounded-full border border-grey-20 bg-white text-sm font-medium text-grey-70 hover:border-ceedmart-navy hover:text-ceedmart-navy hover:bg-ceedmart-navy/5 transition-all cursor-pointer"
              >
                {category.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

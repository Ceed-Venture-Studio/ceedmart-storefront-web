"use client"

import { usePathname, useRouter, useParams } from "next/navigation"
import { FormEvent, useEffect, useRef, useState } from "react"

/**
 * NavSearchSlot — renders a compact search input inside the nav whenever
 * the in-page hero search (marked with `data-hero-search`) is NOT in the
 * viewport. Watches for hero remounts on route change so the slot
 * reattaches its observer after navigation.
 */
export default function NavSearchSlot() {
  const [visible, setVisible] = useState(false)
  const [query, setQuery] = useState("")
  const router = useRouter()
  const pathname = usePathname()
  const { countryCode } = useParams()
  const observerRef = useRef<IntersectionObserver | null>(null)
  const heroRef = useRef<Element | null>(null)

  useEffect(() => {
    const attach = () => {
      const hero = document.querySelector("[data-hero-search]")
      if (hero === heroRef.current) return

      observerRef.current?.disconnect()
      heroRef.current = hero

      if (!hero) {
        // No hero search on this page → always show nav search.
        setVisible(true)
        return
      }

      // Wait for first IntersectionObserver callback to set the initial state.
      const obs = new IntersectionObserver(
        ([entry]) => setVisible(!entry.isIntersecting),
        { threshold: 0, rootMargin: "0px" }
      )
      obs.observe(hero)
      observerRef.current = obs
    }

    // Try immediately, then retry shortly to catch async-rendered heroes.
    attach()
    const t1 = setTimeout(attach, 150)
    const t2 = setTimeout(attach, 500)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      observerRef.current?.disconnect()
      heroRef.current = null
    }
  }, [pathname])

  // Reset query when navigating away.
  useEffect(() => {
    setQuery("")
  }, [pathname])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    router.push(`/${countryCode}/store?q=${encodeURIComponent(query.trim())}`)
  }

  if (!visible) return null

  return (
    <form
      onSubmit={submit}
      className="hidden small:flex flex-1 max-w-md mx-4 animate-fade-in-top"
      role="search"
    >
      <div className="relative w-full">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-grey-40"
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
          placeholder="Search products…"
          aria-label="Search products"
          className="w-full h-10 pl-10 pr-3 rounded-full border border-grey-20 bg-grey-5 text-sm text-grey-90 placeholder:text-grey-40 focus:outline-none focus:border-ceedmart-navy focus:bg-white transition-colors"
        />
      </div>
    </form>
  )
}

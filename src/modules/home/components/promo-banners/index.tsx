"use client"

import { clx } from "@medusajs/ui"
import { useEffect, useState } from "react"

type Banner = {
  id: string
  bg: string
  textColor: string
  chipBg: string
  chipText: string
  dotColor: string
  icon: JSX.Element
  eyebrow: string
  headline: string
  sub: string
}

const banners: Banner[] = [
  {
    id: "min-order",
    bg: "bg-gradient-to-r from-ceedmart-navy via-ceedmart-navy-light to-ceedmart-blue",
    textColor: "text-white",
    chipBg: "bg-ceedmart-gold",
    chipText: "text-ceedmart-navy",
    dotColor: "bg-white",
    icon: (
      <svg
        viewBox="0 0 64 64"
        fill="currentColor"
        className="w-10 h-10 small:w-12 small:h-12"
      >
        <path d="M20 8h24l6 12H14l6-12zm-8 16h40l-3 28a4 4 0 0 1-4 4H19a4 4 0 0 1-4-4l-3-28zm12 8v14h4V32h-4zm12 0v14h4V32h-4z" />
      </svg>
    ),
    eyebrow: "Wholesale Only",
    headline: "₦30,000 minimum online order",
    sub: "Buy in bulk — lower prices per unit.",
  },
  {
    id: "free-delivery",
    bg: "bg-gradient-to-r from-ceedmart-gold via-yellow-400 to-amber-500",
    textColor: "text-ceedmart-navy",
    chipBg: "bg-ceedmart-navy",
    chipText: "text-ceedmart-gold",
    dotColor: "bg-ceedmart-navy",
    icon: (
      <svg
        viewBox="0 0 64 64"
        fill="currentColor"
        className="w-10 h-10 small:w-12 small:h-12"
      >
        <path d="M4 16h32v24H4V16zm32 8h10l8 10v6H36V24zm-22 20a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm28 0a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
      </svg>
    ),
    eyebrow: "Free Delivery",
    headline: "Free delivery in Lagos & Port Harcourt",
    sub: "Same-city orders within 20 km of our dispatch hub.",
  },
]

const ROTATE_MS = 6000

export default function PromoBanners() {
  const [idx, setIdx] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const t = setInterval(
      () => setIdx((i) => (i + 1) % banners.length),
      ROTATE_MS
    )
    return () => clearInterval(t)
  }, [paused])

  return (
    <div className="w-full flex justify-center px-6">
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl h-[104px] small:h-[120px] shadow-md"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        role="region"
        aria-label="Promotions"
      >
        {banners.map((b, i) => {
          const active = i === idx
          return (
            <div
              key={b.id}
              aria-hidden={!active}
              className={clx(
                "absolute inset-0 flex items-center gap-4 small:gap-6 px-5 small:px-8 transition-opacity duration-700 ease-in-out",
                b.bg,
                b.textColor,
                {
                  "opacity-100 visible": active,
                  "opacity-0 invisible": !active,
                }
              )}
            >
              <div
                className={clx(
                  "flex-shrink-0 rounded-full p-2.5 small:p-3",
                  b.chipBg,
                  b.chipText
                )}
              >
                {b.icon}
              </div>

              <div className="flex-1 min-w-0">
                <span
                  className={clx(
                    "inline-block px-2.5 py-0.5 rounded-full text-[9px] small:text-[10px] font-bold uppercase tracking-wider mb-1",
                    b.chipBg,
                    b.chipText
                  )}
                >
                  {b.eyebrow}
                </span>
                <div className="text-sm small:text-lg font-extrabold leading-tight truncate">
                  {b.headline}
                </div>
                <p className="text-xs small:text-sm opacity-85 leading-snug truncate">
                  {b.sub}
                </p>
              </div>
            </div>
          )
        })}

        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
          {banners.map((b, i) => {
            const active = i === idx
            return (
              <button
                key={b.id}
                onClick={() => setIdx(i)}
                aria-label={`Show promotion ${i + 1}`}
                className={clx(
                  "h-1.5 rounded-full transition-all",
                  banners[idx].dotColor,
                  {
                    "w-6 opacity-100": active,
                    "w-1.5 opacity-40": !active,
                  }
                )}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

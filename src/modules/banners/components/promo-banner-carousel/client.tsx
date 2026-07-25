"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import type { Banner } from "../../../../types/banner"

type Props = {
  banners: Banner[]
  intervalMs?: number
}

const ROTATE_MS = 5000

const isExternal = (url: string) => /^https?:\/\//i.test(url)

const CTA = ({
  href,
  label,
  primary,
  variant,
}: {
  href: string
  label: string
  primary: string
  variant: "primary" | "secondary"
}) => {
  const style =
    variant === "primary"
      ? { backgroundColor: "#ffffff", color: primary }
      : { backgroundColor: "transparent", borderColor: "#ffffff", color: "#ffffff" }
  const className =
    "inline-flex items-center justify-center px-5 py-2.5 rounded-full font-semibold text-sm whitespace-nowrap transition-opacity hover:opacity-90 " +
    (variant === "secondary" ? "border" : "")
  if (isExternal(href)) {
    return (
      <a href={href} className={className} style={style} target="_blank" rel="noopener noreferrer">
        {label}
      </a>
    )
  }
  return (
    <LocalizedClientLink href={href} className={className} style={style}>
      {label}
    </LocalizedClientLink>
  )
}

export default function PromoBannerCarouselClient({ banners, intervalMs = ROTATE_MS }: Props) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused || banners.length <= 1) return
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % banners.length)
    }, intervalMs)
    return () => clearInterval(t)
  }, [paused, banners.length, intervalMs])

  if (banners.length === 0) return null

  const current = banners[index]
  const bg = current.primary_color || "#05007F"
  const fg = current.secondary_color || "#FFFFFF"

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden"
      style={{ backgroundColor: bg, color: fg }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
        <div className="relative flex flex-col small:flex-row items-stretch">
          {/* Image on the right (or top on mobile) — decorative */}
          <div className="relative w-full small:w-2/5 aspect-[4/1] small:aspect-auto small:min-h-[180px]">
            <Image
              src={current.image_url}
              alt={current.alt_text ?? ""}
              fill
              sizes="(max-width: 640px) 100vw, 40vw"
              className="object-cover"
              priority={false}
            />
          </div>

          {/* Text + CTAs */}
          <div className="flex-1 p-6 small:p-8 flex flex-col justify-center gap-3">
            {current.headline && (
              <h2 className="text-xl small:text-2xl font-bold leading-tight">
                {current.headline}
              </h2>
            )}
            {current.subheadline && (
              <p className="text-sm small:text-base opacity-90 max-w-xl">
                {current.subheadline}
              </p>
            )}
            {(current.link_url || current.cta_2_url) && (
              <div className="flex flex-wrap gap-2 mt-2">
                {current.link_url && (
                  <CTA
                    href={current.link_url}
                    label={current.cta_1_label || "Shop now"}
                    primary={bg}
                    variant="primary"
                  />
                )}
                {current.cta_2_url && current.cta_2_label && (
                  <CTA
                    href={current.cta_2_url}
                    label={current.cta_2_label}
                    primary={bg}
                    variant="secondary"
                  />
                )}
              </div>
            )}
          </div>
        </div>

      {banners.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {banners.map((b, i) => (
            <button
              key={b.id}
              onClick={() => setIndex(i)}
              aria-label={`Show promo ${i + 1}`}
              className="h-1.5 rounded-full transition-all"
              style={{
                width: i === index ? 24 : 8,
                backgroundColor: fg,
                opacity: i === index ? 1 : 0.5,
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

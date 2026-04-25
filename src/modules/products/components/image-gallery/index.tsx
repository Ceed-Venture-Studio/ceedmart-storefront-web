"use client"

import { HttpTypes } from "@medusajs/types"
import { Container, clx } from "@medusajs/ui"
import PlaceholderImage from "@modules/common/icons/placeholder-image"
import Image from "next/image"
import { useState } from "react"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const validImages = (images ?? []).filter((i) => !!i.url)
  const [activeIndex, setActiveIndex] = useState(0)

  if (!validImages.length) {
    return (
      <div className="flex items-start relative">
        <div className="flex flex-col flex-1 gap-y-4">
          <Container className="relative aspect-[29/34] w-full overflow-hidden bg-ui-bg-subtle flex flex-col items-center justify-center gap-y-3 text-ui-fg-muted">
            <PlaceholderImage size={64} />
            <span className="text-sm">Image coming soon</span>
          </Container>
        </div>
      </div>
    )
  }

  const safeIndex = Math.min(activeIndex, validImages.length - 1)
  const current = validImages[safeIndex]
  const showControls = validImages.length > 1

  const goTo = (i: number) =>
    setActiveIndex(((i % validImages.length) + validImages.length) % validImages.length)

  return (
    <div className="flex flex-col gap-y-3">
      <Container className="relative aspect-[29/34] w-full overflow-hidden bg-ui-bg-subtle group">
        <Image
          key={current.id}
          src={current.url!}
          priority
          fill
          alt={`Product image ${safeIndex + 1}`}
          sizes="(max-width: 576px) 320px, (max-width: 1024px) 480px, 600px"
          className="absolute inset-0 rounded-rounded object-cover"
        />

        {showControls && (
          <>
            <button
              type="button"
              onClick={() => goTo(safeIndex - 1)}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/85 hover:bg-white text-ui-fg-base shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => goTo(safeIndex + 1)}
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/85 hover:bg-white text-ui-fg-base shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {validImages.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Show image ${i + 1}`}
                  onClick={() => goTo(i)}
                  className={clx("h-1.5 rounded-full bg-white transition-all shadow", {
                    "w-6 opacity-100": i === safeIndex,
                    "w-1.5 opacity-60 hover:opacity-100": i !== safeIndex,
                  })}
                />
              ))}
            </div>
          </>
        )}
      </Container>

      {showControls && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {validImages.map((image, i) => (
            <button
              key={image.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Select image ${i + 1}`}
              aria-current={i === safeIndex}
              className={clx(
                "relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border bg-ui-bg-subtle transition-colors",
                {
                  "border-ceedmart-navy ring-2 ring-ceedmart-navy/30":
                    i === safeIndex,
                  "border-grey-20 hover:border-grey-40": i !== safeIndex,
                }
              )}
            >
              <Image
                src={image.url!}
                alt={`Thumbnail ${i + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ImageGallery

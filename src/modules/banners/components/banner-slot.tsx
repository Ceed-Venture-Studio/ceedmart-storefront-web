import Image from "next/image"
import { listBanners } from "@lib/data/banners"
import type { BannerSlot as SlotKey } from "../../../types/banner"

type Props = {
  slot: SlotKey
  limit?: number
  className?: string
  itemClassName?: string
  priority?: boolean
}

export default async function BannerSlot({
  slot,
  limit = 1,
  className,
  itemClassName,
  priority,
}: Props) {
  const banners = await listBanners(slot, limit)
  if (banners.length === 0) return null

  return (
    <div className={className}>
      {banners.map((b) => {
        const img = (
          <Image
            src={b.image_url}
            alt={b.alt_text ?? ""}
            width={b.image_width}
            height={b.image_height}
            sizes="100vw"
            priority={priority}
            className="w-full h-auto"
          />
        )
        if (b.link_url) {
          const isExternal = /^https?:\/\//i.test(b.link_url)
          return (
            <a
              key={b.id}
              href={b.link_url}
              className={itemClassName ?? "block"}
              {...(isExternal
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              {img}
            </a>
          )
        }
        return (
          <div key={b.id} className={itemClassName}>
            {img}
          </div>
        )
      })}
    </div>
  )
}

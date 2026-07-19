import { listBanners } from "@lib/data/banners"
import PromoBannerCarouselClient from "./client"

export default async function PromoBannerCarousel() {
  const banners = await listBanners("category_carousel", 10)
  if (banners.length === 0) return null
  return <PromoBannerCarouselClient banners={banners} />
}

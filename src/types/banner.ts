export type BannerSlot =
  | "home_hero_desktop"
  | "home_hero_mobile"
  | "home_secondary"
  | "category_banner"
  | "promo_strip"
  | "product_sidebar"
  | "category_carousel"

export type Banner = {
  id: string
  slot: BannerSlot
  image_url: string
  image_width: number
  image_height: number
  link_url: string | null
  cta_1_label?: string | null
  cta_2_url?: string | null
  cta_2_label?: string | null
  headline?: string | null
  subheadline?: string | null
  primary_color?: string | null
  secondary_color?: string | null
  alt_text: string | null
  priority: number
}

export type BannersResponse = {
  banners: Banner[]
}

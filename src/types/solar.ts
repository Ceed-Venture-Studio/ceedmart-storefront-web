export type Appliance = {
  name: string
  qty: number
  watts: number
  hours_per_day: number
  period: "day" | "night" | "both"
  critical?: boolean
  surge_factor?: number
}

export type LoadProfile = {
  appliances: Appliance[]
  total_load_w: number
  peak_load_w: number
  daily_kwh: number
  day_kwh: number
  night_kwh: number
  has_heavy_motors: boolean
  margin_pct: number
}

export type SolarComponent = {
  product_id: string
  variant_id: string | null
  title: string
  thumbnail: string | null
  qty: number
  unit_price: number | null
  currency_code: string | null
  capacity_kw?: number
  capacity_kwh?: number
  panel_watts?: number
}

export type SolarBundleTier = "budget" | "recommended" | "premium"

export type SolarBundle = {
  tier: SolarBundleTier
  margin_pct: number
  inverter: SolarComponent | null
  battery: SolarComponent | null
  panels: SolarComponent | null
  total_price: number | null
  currency_code: string | null
  why: string[]
  can_power: { label: string; qty: number }[]
  cannot_power: string[]
}

export type RecommendRequest = {
  appliances: Appliance[]
  session_id?: string
  locale?: string
}

export type RecommendResponse = {
  calculation_id: string | null
  load: LoadProfile
  catalog_ready: boolean
  bundles: SolarBundle[]
  notes: string[]
}

export type QuoteRequest = {
  calculation_id?: string
  selected_tier: SolarBundleTier
  selected_bundle: SolarBundle
  customer_name: string
  customer_email: string
  customer_phone?: string
  customer_location?: string
  notes?: string
}

export type Quote = {
  id: string
  calculation_id: string | null
  selected_tier: SolarBundleTier
  selected_bundle: SolarBundle
  customer_name: string
  customer_email: string
  customer_phone: string | null
  customer_location: string | null
  notes: string | null
  status: "new" | "contacted" | "quoted" | "won" | "lost"
  email_sent_at: string | null
  created_at: string
  updated_at: string
}

export type QuoteResponse = { quote: Quote }

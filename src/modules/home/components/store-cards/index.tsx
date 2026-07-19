"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

type StoreCard = {
  href: string
  eyebrow: string
  title: string
  desc: string
  cta?: string
  gradient: string
  titleColor: string
  // Description body color. Defaults to "text-white/85" if omitted —
  // matches the tone used on dark gradients.
  descColor?: string
  iconColor: string
  chipBg: string
  chipText: string
  icon: React.ReactNode
}

const ArrowIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
    />
  </svg>
)

const cards: StoreCard[] = [
  {
    href: "/store/wholefoods",
    eyebrow: "Fresh & Organic",
    title: "Whole Foods",
    desc: "Wholesale & bulk orders of fresh organic farm produce and whole foods",
    gradient: "from-wholefoods-dark via-wholefoods to-wholefoods-accent",
    titleColor: "text-ceedmart-gold",
    iconColor: "text-wholefoods-light",
    chipBg: "bg-white/25",
    chipText: "text-wholefoods-light",
    icon: (
      <svg viewBox="0 0 64 64" fill="currentColor" className="w-16 h-16 small:w-20 small:h-20">
        <path d="M32 8c0 0-20 8-20 32 0 12 8 18 14 20 2-8 6-14 6-14s4 6 6 14c6-2 14-8 14-20C52 16 32 8 32 8z" />
      </svg>
    ),
  },
  {
    href: "/store/solar-energy-power",
    eyebrow: "Reliable Power",
    title: "Solar Energy & Power",
    desc: "Solar panels, inverters, batteries and power stations for homes and businesses",
    cta: "Explore Solar Energy & Power",
    gradient: "from-tech-dark via-tech to-tech-light",
    titleColor: "text-white",
    iconColor: "text-white",
    chipBg: "bg-white/20",
    chipText: "text-tech-light",
    icon: (
      // sun + panel
      <svg viewBox="0 0 64 64" fill="currentColor" className="w-16 h-16 small:w-20 small:h-20">
        <circle cx="32" cy="16" r="6" />
        <path d="M32 4v4m0 20v4M18 16h4m20 0h4M22 6l3 3m14 14l3 3M22 26l3-3m14-14l3-3" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" />
        <path d="M14 34h36l4 22H10l4-22zm4 4l-2 14h32l-2-14H18zm8 0v14m6-14v14m6-14v14" />
      </svg>
    ),
  },
  {
    href: "/store/cctv-access-control",
    eyebrow: "Watch & Protect",
    title: "CCTV & Access Control",
    desc: "Cameras, DVRs, biometric readers and access systems to keep your space safe",
    cta: "Explore CCTV & Access Control",
    // Ceedmart yellow (gold) primary with a warmer inner tone for depth.
    gradient: "from-yellow-500 via-ceedmart-gold to-amber-300",
    // Yellow is high-contrast against white — swap to the brand navy for
    // legibility instead of the white treatment other cards use.
    titleColor: "text-ceedmart-navy",
    descColor: "text-ceedmart-navy/80",
    iconColor: "text-ceedmart-navy",
    chipBg: "bg-ceedmart-navy/15",
    chipText: "text-ceedmart-navy",
    icon: (
      // dome camera glyph
      <svg viewBox="0 0 64 64" fill="currentColor" className="w-16 h-16 small:w-20 small:h-20">
        <path d="M12 20a20 20 0 0 1 40 0v6H12v-6zm4 0h32a16 16 0 0 0-32 0zm-2 10h36v6H14v-6zm14 8h8v4h-8v-4zm-2 4h12l-2 16H28l-2-16z" />
        <circle cx="32" cy="18" r="4" fill="#0037BF" />
      </svg>
    ),
  },
  {
    href: "/store/computer-accessories",
    eyebrow: "Work & Play",
    title: "Computer & Accessories",
    desc: "Laptops, monitors, peripherals and productivity gear for home and office",
    cta: "Explore Computer & Accessories",
    gradient: "from-slate-800 via-slate-600 to-slate-400",
    titleColor: "text-white",
    iconColor: "text-slate-100",
    chipBg: "bg-white/20",
    chipText: "text-slate-100",
    icon: (
      // laptop / monitor glyph
      <svg viewBox="0 0 64 64" fill="currentColor" className="w-16 h-16 small:w-20 small:h-20">
        <path d="M10 14a4 4 0 0 1 4-4h36a4 4 0 0 1 4 4v26H10V14zm4 0v22h36V14H14zm-6 30h48l-2 6H10l-2-6zm18 0h12v2H26v-2z" />
      </svg>
    ),
  },
]

export default function StoreCards({
  excludeHrefs = [],
}: {
  excludeHrefs?: string[]
} = {}) {
  const shown = cards.filter((c) => !excludeHrefs.includes(c.href))
  if (shown.length === 0) return null

  // With four cards, a balanced 2×2 grid keeps the content-rich cards
  // readable; three stays 3-across; two side-by-side; one full-width.
  const gridCols =
    shown.length === 1
      ? "small:grid-cols-1"
      : shown.length === 2
        ? "small:grid-cols-2"
        : shown.length === 3
          ? "small:grid-cols-3"
          : "small:grid-cols-2"

  return (
    <div className={`grid grid-cols-1 ${gridCols} gap-4 w-full max-w-6xl`}>
      {shown.map((c) => (
        <LocalizedClientLink
          key={c.href}
          href={c.href}
          className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${c.gradient} p-6 small:p-8 flex flex-col justify-between min-h-[220px] small:min-h-[260px] shadow-md hover:shadow-xl transition-shadow duration-300 small:transition-all small:hover:scale-[1.02]`}
        >
          <div
            className={`absolute top-4 right-4 opacity-20 group-hover:opacity-30 transition-opacity ${c.iconColor}`}
          >
            {c.icon}
          </div>
          <div>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 ${c.chipBg} ${c.chipText}`}
            >
              {c.eyebrow}
            </span>
            <h3
              className={`text-2xl small:text-3xl font-bold leading-tight drop-shadow-sm ${c.titleColor}`}
            >
              {c.title}
            </h3>
            <p
              className={`text-sm mt-2 max-w-[220px] ${c.descColor ?? "text-white/85"}`}
            >
              {c.desc}
            </p>
          </div>
          <div
            className={`flex items-center gap-2 font-semibold text-sm mt-4 group-hover:gap-3 transition-all ${c.titleColor}`}
          >
            {c.cta ?? "Order in bulk"}
            <ArrowIcon />
          </div>
        </LocalizedClientLink>
      ))}
    </div>
  )
}

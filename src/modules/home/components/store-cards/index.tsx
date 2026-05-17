"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

type StoreCard = {
  href: string
  eyebrow: string
  title: string
  desc: string
  gradient: string
  titleColor: string
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
    desc: "Bulk groceries, organic produce & wholesale essentials",
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
    href: "/store/tech",
    eyebrow: "Wholesale Electronics",
    title: "Electronics & Solar",
    desc: "Bulk electronics, gadgets, CCTV, solar & power solutions",
    gradient: "from-tech-dark via-tech to-tech-light",
    titleColor: "text-white",
    iconColor: "text-white",
    chipBg: "bg-white/20",
    chipText: "text-tech-light",
    icon: (
      <svg viewBox="0 0 64 64" fill="currentColor" className="w-16 h-16 small:w-20 small:h-20">
        <path d="M8 12a4 4 0 0 1 4-4h40a4 4 0 0 1 4 4v28a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4V12m4 0v28h40V12H12m-2 36h44v4H10v-4m16-22h12v2H26v-2m-4 6h20v2H22v-2" />
      </svg>
    ),
  },
  {
    href: "/store/home-furniture",
    eyebrow: "Bohemian & Cane",
    title: "Home Furniture",
    desc: "Handwoven cane chairs, bohemian decor & lifestyle pieces",
    gradient: "from-amber-800 via-amber-600 to-orange-400",
    titleColor: "text-white",
    iconColor: "text-amber-100",
    chipBg: "bg-white/20",
    chipText: "text-amber-100",
    icon: (
      <svg viewBox="0 0 64 64" fill="currentColor" className="w-16 h-16 small:w-20 small:h-20">
        <path d="M14 18h36v6H14v-6zm-2 10h40v18h-6v-12H18v12h-6V28zm6 18h2v6h-2v-6zm26 0h2v6h-2v-6z" />
      </svg>
    ),
  },
]

export default function StoreCards() {
  return (
    <div className="grid grid-cols-1 small:grid-cols-3 gap-4 w-full max-w-6xl">
      {cards.map((c) => (
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
            <p className="text-white/85 text-sm mt-2 max-w-[220px]">{c.desc}</p>
          </div>
          <div className="flex items-center gap-2 text-white font-semibold text-sm mt-4 group-hover:gap-3 transition-all">
            Order in bulk
            <ArrowIcon />
          </div>
        </LocalizedClientLink>
      ))}
    </div>
  )
}

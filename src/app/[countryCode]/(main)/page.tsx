import { Metadata } from "next"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "CeedMart — Launching Friday, May 29, 2026",
  description:
    "ceedmart.com goes live Friday, May 29, 2026. Best prices in Whole Foods & Fresh Farm Produce, Solar Generators, Inverters, Panels and Batteries, and Rattan Patio Furniture.",
}

// Lagos timezone (UTC+1) — pick local midnight for the launch.
const LAUNCH_DATE = new Date("2026-05-29T00:00:00+01:00")

function daysUntilLaunch() {
  const ms = LAUNCH_DATE.getTime() - Date.now()
  return Math.max(0, Math.ceil(ms / (24 * 60 * 60 * 1000)))
}

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

const SunPanelIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" className="w-10 h-10 small:w-12 small:h-12">
    <circle cx="32" cy="18" r="7" fill="#FFCE00" />
    <g stroke="#FFCE00" strokeWidth="2" strokeLinecap="round">
      <line x1="32" y1="5" x2="32" y2="9" />
      <line x1="32" y1="27" x2="32" y2="31" />
      <line x1="45" y1="18" x2="41" y2="18" />
      <line x1="23" y1="18" x2="19" y2="18" />
    </g>
    <path
      d="M14 38h36l4 14H10l4-14z"
      fill="#15A6FF"
      fillOpacity="0.5"
      stroke="white"
      strokeWidth="1.5"
    />
    <line x1="14" y1="45" x2="50" y2="45" stroke="white" strokeWidth="1.2" />
  </svg>
)

const FreshIcon = () => (
  <svg viewBox="0 0 64 64" fill="currentColor" className="w-10 h-10 small:w-12 small:h-12 text-ceedmart-gold">
    <path d="M32 8c0 0-20 8-20 32 0 12 8 18 14 20 2-8 6-14 6-14s4 6 6 14c6-2 14-8 14-20C52 16 32 8 32 8z" />
  </svg>
)

const FurnitureIcon = () => (
  <svg viewBox="0 0 64 64" fill="currentColor" className="w-10 h-10 small:w-12 small:h-12 text-ceedmart-gold">
    <path d="M14 18h36v6H14v-6zm-2 10h40v18h-6v-12H18v12h-6V28zm6 18h2v6h-2v-6zm26 0h2v6h-2v-6z" />
  </svg>
)

type CategoryPillProps = {
  Icon: React.ComponentType
  label: string
}

const CategoryPill = ({ Icon, label }: CategoryPillProps) => (
  <div className="flex flex-col xsmall:flex-row items-center gap-3 px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15">
    <Icon />
    <span className="text-white text-sm small:text-base font-semibold text-center xsmall:text-left">
      {label}
    </span>
  </div>
)

export default function Home() {
  const days = daysUntilLaunch()

  return (
    <section className="relative w-full min-h-screen bg-gradient-to-br from-ceedmart-navy via-ceedmart-navy-light to-ceedmart-blue overflow-hidden flex items-center justify-center px-6 py-14 small:py-20">
      {/* Decorative glow */}
      <div
        className="absolute -top-32 -right-32 w-[28rem] h-[28rem] bg-ceedmart-gold/15 rounded-full blur-3xl pointer-events-none"
        aria-hidden
      />
      <div
        className="absolute -bottom-40 -left-32 w-[28rem] h-[28rem] bg-ceedmart-blue/25 rounded-full blur-3xl pointer-events-none"
        aria-hidden
      />

      <div className="relative max-w-5xl mx-auto text-center flex flex-col items-center gap-6 small:gap-8">
        <Image
          src="/logo.png"
          alt="CeedMart"
          width={96}
          height={96}
          className="h-20 w-20 small:h-24 small:w-24 drop-shadow-md"
          priority
        />

        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ceedmart-gold text-ceedmart-navy text-xs font-bold uppercase tracking-widest shadow-md">
          <span className="w-2 h-2 rounded-full bg-ceedmart-navy animate-pulse" />
          Launching Soon
        </span>

        <h1 className="text-white text-4xl small:text-6xl medium:text-7xl font-extrabold leading-[1.05] drop-shadow-md">
          We go <span className="text-ceedmart-gold">live</span>
          <br className="hidden small:block" />
          <span className="block small:inline"> Friday, May 29, 2026</span>
        </h1>

        <p className="text-white/90 text-lg small:text-xl medium:text-2xl max-w-3xl leading-relaxed">
          Best prices on{" "}
          <span className="text-ceedmart-gold font-semibold">
            Whole Foods & Fresh Farm Produce
          </span>
          ,{" "}
          <span className="text-ceedmart-gold font-semibold">
            Solar Generators, Inverters, Panels & Batteries
          </span>
          , and{" "}
          <span className="text-ceedmart-gold font-semibold">
            Rattan Patio Furniture
          </span>
          .
        </p>

        {days > 0 && (
          <div className="flex items-baseline gap-3 mt-2">
            <span className="text-ceedmart-gold text-6xl small:text-7xl font-extrabold drop-shadow-md leading-none">
              {days}
            </span>
            <span className="text-white/90 text-sm small:text-base uppercase tracking-widest font-semibold">
              day{days === 1 ? "" : "s"} to go
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 small:grid-cols-3 gap-3 w-full max-w-3xl mt-4">
          <CategoryPill
            Icon={FreshIcon}
            label="Whole Foods & Fresh Farm Produce"
          />
          <CategoryPill
            Icon={SunPanelIcon}
            label="Solar Generators, Inverters, Panels & Batteries"
          />
          <CategoryPill
            Icon={FurnitureIcon}
            label="Rattan Patio Furniture"
          />
        </div>

        <a
          href="https://wa.me/2347087502195?text=Hello%20CeedMart%2C%20please%20notify%20me%20when%20you%20go%20live."
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#25D366] hover:bg-[#1ebe57] text-white font-semibold text-base transition-colors shadow-md mt-2"
        >
          <WhatsAppIcon />
          Get launch updates on WhatsApp
        </a>

        <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mt-6 text-white/70 text-xs">
          {[
            { href: "/legal/privacy", label: "Privacy" },
            { href: "/legal/terms", label: "Terms" },
            { href: "/legal/refund", label: "Refunds" },
            { href: "/legal/shipping", label: "Shipping" },
            { href: "/legal/cookies", label: "Cookies" },
          ].map((l) => (
            <li key={l.href}>
              <LocalizedClientLink
                href={l.href}
                className="hover:text-white hover:underline"
              >
                {l.label}
              </LocalizedClientLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

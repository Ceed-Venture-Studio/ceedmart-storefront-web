import LocalizedClientLink from "@modules/common/components/localized-client-link"
import SearchBar from "@modules/home/components/search-bar"
import {
  FREE_DELIVERY_THRESHOLD_NGN,
  SUPPORT_WHATSAPP_URL,
} from "@lib/data/delivery-locations"

type Props = {
  /** Real catalogue size — currently unused in the hero copy but kept so the
   *  page can surface it without another round trip. */
  productCount?: number
}

const WhatsAppGlyph = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 016.988 2.896 9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.892c0 2.096.549 4.142 1.595 5.945L0 24l6.305-1.654a11.94 11.94 0 005.71 1.454h.006c6.585 0 11.946-5.335 11.949-11.893a11.82 11.82 0 00-3.45-8.458" />
  </svg>
)

const BENEFITS = [
  {
    title: `Free delivery over ₦${FREE_DELIVERY_THRESHOLD_NGN.toLocaleString(
      "en-NG"
    )}`,
    body: "No delivery charge on qualifying orders.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h11v10H3zM14 10h4l3 3v4h-7z" />
        <circle cx="7" cy="18" r="1.6" />
        <circle cx="17.5" cy="18" r="1.6" />
      </svg>
    ),
  },
  {
    title: "24/7 support",
    body: "Reach a real person any time, day or night.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 13a8 8 0 0116 0v4a2 2 0 01-2 2h-1v-6h3M4 13v4a2 2 0 002 2h1v-6H4" />
      </svg>
    ),
  },
  {
    title: "Same-day delivery in PH",
    body: "Order before cut-off in Port Harcourt.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <circle cx="12" cy="12" r="8.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3.5 2" />
      </svg>
    ),
  },
]

/**
 * Bulk-first hero.
 *
 * Deliberately NOT Faire's "sign up to unlock wholesale pricing" pattern —
 * Ceedmart shows one public price per product with visible quantity breaks,
 * so there is nothing to unlock and claiming otherwise would be a bait.
 * The promise here is transparency: the price drops as the quantity rises,
 * and you can see that before you sign in.
 */
export default function BulkHero({ productCount }: Props) {
  return (
    <section className="relative w-full overflow-hidden bg-ceedmart-navy">
      {/* Depth: soft gold bloom + faint grid, no external assets */}
      <div className="absolute inset-0" aria-hidden>
        <div className="absolute -top-32 -right-24 w-[32rem] h-[32rem] rounded-full bg-ceedmart-gold/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-20 w-[28rem] h-[28rem] rounded-full bg-ceedmart-navy-light/40 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
      </div>

      <div className="content-container relative py-14 small:py-24">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ceedmart-gold/15 text-ceedmart-gold text-xs font-semibold uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-ceedmart-gold" />
            Wholesale &amp; bulk supply
          </span>

          <h1 className="mt-5 text-white text-4xl small:text-6xl font-bold leading-[1.05] tracking-tight">
            Buy in bulk.
            <br />
            <span className="text-ceedmart-gold">Pay less per unit.</span>
          </h1>

          <p className="mt-5 text-white/75 text-base small:text-xl leading-relaxed max-w-xl">
            Foods, solar, security and IT — supplied at quantity to
            restaurants, retailers, installers and offices across Nigeria.
            Prices drop as your order grows, and you can see every break
            before you buy.
          </p>

          <div className="mt-8 max-w-xl">
            <SearchBar />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <LocalizedClientLink
              href="/store"
              className="px-6 py-3 rounded-full bg-ceedmart-gold text-ceedmart-navy text-sm font-bold hover:brightness-95 transition-all"
            >
              Browse the catalogue
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/solar"
              className="px-6 py-3 rounded-full border border-white/25 text-white text-sm font-semibold hover:bg-white/10 transition-all"
            >
              Get a solar estimate
            </LocalizedClientLink>
          </div>
        </div>

        {/* Service promises + a direct line to support. */}
        <div className="mt-12 small:mt-16 grid grid-cols-1 small:grid-cols-2 medium:grid-cols-4 gap-3">
          {BENEFITS.map((benefit) => (
            <div
              key={benefit.title}
              className="rounded-2xl bg-white/[0.07] border border-white/10 px-5 py-5 backdrop-blur-sm"
            >
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-ceedmart-gold/15 text-ceedmart-gold">
                {benefit.icon}
              </span>
              <h3 className="mt-3 text-white text-sm font-bold leading-snug">
                {benefit.title}
              </h3>
              <p className="mt-1 text-white/55 text-xs leading-relaxed">
                {benefit.body}
              </p>
            </div>
          ))}

          <a
            href={SUPPORT_WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-2xl bg-[#25D366] px-5 py-5 flex flex-col justify-between hover:brightness-95 transition-all"
          >
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/25 text-white">
              <WhatsAppGlyph />
            </span>
            <span className="mt-3 block">
              <span className="block text-white text-sm font-bold leading-snug">
                Chat with support
              </span>
              <span className="mt-1 flex items-center gap-1 text-white/85 text-xs font-medium">
                Message us on WhatsApp
                <svg
                  className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5"
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
              </span>
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}

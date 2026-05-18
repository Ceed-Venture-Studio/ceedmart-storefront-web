import LocalizedClientLink from "@modules/common/components/localized-client-link"

type PromoBannerProps = {
  variant: "wholefoods" | "tech" | "furniture"
}

const PromoBanner = ({ variant }: PromoBannerProps) => {
  if (variant === "wholefoods") {
    return (
      <div className="w-full rounded-2xl overflow-hidden bg-gradient-to-r from-wholefoods-dark via-wholefoods-leaf to-wholefoods-accent relative">
        {/* Decorative leaf patterns */}
        <div className="absolute inset-0 opacity-10">
          <svg viewBox="0 0 800 200" fill="currentColor" className="w-full h-full text-white">
            <circle cx="100" cy="50" r="80" />
            <circle cx="300" cy="120" r="60" />
            <circle cx="550" cy="40" r="90" />
            <circle cx="700" cy="100" r="70" />
          </svg>
        </div>

        <div className="relative flex flex-col small:flex-row items-center gap-6 small:gap-10 p-6 small:p-10">
          {/* Leaf icon */}
          <div className="flex-shrink-0">
            <svg viewBox="0 0 64 64" fill="none" className="w-16 h-16 small:w-20 small:h-20">
              <path
                d="M32 8c0 0-20 8-20 32 0 12 8 18 14 20 2-8 6-14 6-14s4 6 6 14c6-2 14-8 14-20C52 16 32 8 32 8z"
                fill="#BBF7D0"
                fillOpacity="0.6"
              />
              <path
                d="M32 20v28M32 28c-4-2-8 0-10 4M32 36c4-2 8 0 10 4"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="flex-1 text-center small:text-left">
            <h2 className="text-ceedmart-gold text-xl small:text-2xl font-bold mb-1">
              Wholesale Fresh Produce & Bulk Groceries
            </h2>
            <p className="text-white/80 text-sm small:text-base max-w-md">
              Order organic produce, grains & natural ingredients in bulk — wholesale prices, direct supply.
            </p>
          </div>

          <LocalizedClientLink
            href="/store/wholefoods"
            className="flex-shrink-0 px-6 py-3 rounded-full bg-white text-wholefoods-dark font-semibold text-sm hover:bg-wholefoods-light transition-colors"
          >
            Order Wholesale
          </LocalizedClientLink>
        </div>
      </div>
    )
  }

  if (variant === "furniture") {
    return (
      <div className="w-full rounded-2xl overflow-hidden bg-gradient-to-r from-amber-800 via-amber-600 to-orange-400 relative">
        <div className="absolute inset-0 opacity-10">
          <svg
            viewBox="0 0 800 200"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="w-full h-full text-white"
          >
            <path d="M50 150 Q 120 100 200 150 T 350 150 T 500 150 T 650 150 T 800 150" />
            <path d="M50 170 Q 120 120 200 170 T 350 170 T 500 170 T 650 170 T 800 170" />
            <circle cx="150" cy="80" r="40" />
            <circle cx="500" cy="60" r="50" />
            <circle cx="700" cy="100" r="35" />
          </svg>
        </div>

        <div className="relative flex flex-col small:flex-row items-center gap-6 small:gap-10 p-6 small:p-10">
          <div className="flex-shrink-0">
            <svg
              viewBox="0 0 64 64"
              fill="none"
              className="w-16 h-16 small:w-20 small:h-20 text-white"
            >
              <path
                d="M14 18h36v6H14v-6zm-2 10h40v18h-6v-12H18v12h-6V28zm6 18h2v6h-2v-6zm26 0h2v6h-2v-6z"
                fill="currentColor"
              />
            </svg>
          </div>

          <div className="flex-1 text-center small:text-left">
            <h2 className="text-white text-xl small:text-2xl font-bold mb-1">
              Explore more from CeedMart
            </h2>
            <p className="text-white/85 text-sm small:text-base max-w-md">
              Fresh whole foods, electronics & solar — quality products at
              great prices, all under one roof.
            </p>
          </div>

          <div className="flex-shrink-0 flex flex-col gap-2 items-center small:items-end">
            <LocalizedClientLink
              href="/store/wholefoods"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-white text-amber-800 font-semibold text-sm hover:bg-amber-50 transition-colors whitespace-nowrap"
            >
              Shop Whole Foods
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/store/tech"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-white/15 text-white border border-white/40 font-semibold text-sm hover:bg-white/25 transition-colors whitespace-nowrap"
            >
              Shop Solar Power & Security
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    )
  }

  // Tech variant
  return (
    <div className="w-full rounded-2xl overflow-hidden bg-gradient-to-r from-tech to-tech-dark relative">
      {/* Decorative circuit pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg viewBox="0 0 800 200" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-white">
          <line x1="0" y1="100" x2="200" y2="100" />
          <line x1="200" y1="100" x2="200" y2="40" />
          <line x1="200" y1="40" x2="400" y2="40" />
          <circle cx="200" cy="100" r="6" fill="currentColor" />
          <line x1="400" y1="40" x2="400" y2="160" />
          <line x1="400" y1="160" x2="600" y2="160" />
          <circle cx="400" cy="40" r="6" fill="currentColor" />
          <line x1="600" y1="160" x2="600" y2="80" />
          <line x1="600" y1="80" x2="800" y2="80" />
          <circle cx="600" cy="160" r="6" fill="currentColor" />
          <rect x="100" y="60" width="40" height="40" rx="4" />
          <rect x="500" y="60" width="40" height="40" rx="4" />
          <rect x="680" y="120" width="40" height="40" rx="4" />
        </svg>
      </div>

      <div className="relative flex flex-col small:flex-row items-center gap-6 small:gap-10 p-6 small:p-10">
        {/* Sun + panel icon */}
        <div className="flex-shrink-0">
          <svg
            viewBox="0 0 64 64"
            fill="none"
            className="w-16 h-16 small:w-20 small:h-20"
          >
            <circle cx="32" cy="20" r="8" fill="#FFCE00" />
            <g stroke="#FFCE00" strokeWidth="2" strokeLinecap="round">
              <line x1="32" y1="6" x2="32" y2="10" />
              <line x1="32" y1="30" x2="32" y2="34" />
              <line x1="46" y1="20" x2="42" y2="20" />
              <line x1="22" y1="20" x2="18" y2="20" />
              <line x1="42" y1="10" x2="40" y2="12" />
              <line x1="22" y1="10" x2="24" y2="12" />
              <line x1="42" y1="30" x2="40" y2="28" />
              <line x1="22" y1="30" x2="24" y2="28" />
            </g>
            <path
              d="M14 40h36l4 14H10l4-14z"
              fill="#15A6FF"
              fillOpacity="0.35"
              stroke="white"
              strokeWidth="1.5"
            />
            <line x1="20" y1="40" x2="22" y2="54" stroke="white" strokeWidth="1.2" />
            <line x1="32" y1="40" x2="32" y2="54" stroke="white" strokeWidth="1.2" />
            <line x1="44" y1="40" x2="42" y2="54" stroke="white" strokeWidth="1.2" />
            <line x1="14" y1="47" x2="50" y2="47" stroke="white" strokeWidth="1.2" />
          </svg>
        </div>

        <div className="flex-1 text-center small:text-left">
          <h2 className="text-white text-xl small:text-2xl font-bold mb-1">
            Size your solar system in minutes
          </h2>
          <p className="text-white/80 text-sm small:text-base max-w-md">
            Tell us what you want to power and we&apos;ll size three solar
            bundles — or browse our pre-built Solar Packages and order today.
          </p>
        </div>

        <div className="flex-shrink-0 flex flex-col gap-2 items-center small:items-end">
          <LocalizedClientLink
            href="/solar"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-ceedmart-gold text-ceedmart-navy font-semibold text-sm hover:bg-ceedmart-gold/90 transition-colors whitespace-nowrap"
          >
            Estimate solar
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/collections/solar-power-packages"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-white/15 text-white border border-white/40 font-semibold text-sm hover:bg-white/25 transition-colors whitespace-nowrap"
          >
            View solar packages
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  )
}

export default PromoBanner

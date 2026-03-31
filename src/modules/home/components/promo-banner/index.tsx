import LocalizedClientLink from "@modules/common/components/localized-client-link"

type PromoBannerProps = {
  variant: "wholefoods" | "tech"
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
        {/* Tech icon */}
        <div className="flex-shrink-0">
          <svg viewBox="0 0 64 64" fill="none" className="w-16 h-16 small:w-20 small:h-20">
            <rect x="12" y="8" width="40" height="32" rx="4" stroke="white" strokeWidth="2" />
            <rect x="16" y="12" width="32" height="24" rx="2" fill="#15A6FF" fillOpacity="0.3" />
            <line x1="24" y1="44" x2="40" y2="44" stroke="white" strokeWidth="2" />
            <line x1="20" y1="48" x2="44" y2="48" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <circle cx="32" cy="24" r="6" stroke="white" strokeWidth="1.5" />
            <path d="M30 24l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="flex-1 text-center small:text-left">
          <h2 className="text-white text-xl small:text-2xl font-bold mb-1">
            Bulk Tech Orders at Wholesale Prices
          </h2>
          <p className="text-white/80 text-sm small:text-base max-w-md">
            Laptops, CCTV systems, solar solutions & gadgets — bulk pricing for businesses and resellers.
          </p>
        </div>

        <LocalizedClientLink
          href="/store/tech"
          className="flex-shrink-0 px-6 py-3 rounded-full bg-ceedmart-gold text-ceedmart-navy font-semibold text-sm hover:bg-ceedmart-gold/90 transition-colors"
        >
          Order Bulk Electronics
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default PromoBanner

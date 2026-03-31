"use client"

import { usePathname } from "next/navigation"
import { useParams } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const HomeIcon = ({ active }: { active: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    fill={active ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth={active ? 0 : 1.8}
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
    />
  </svg>
)

const SearchIcon = ({ active }: { active: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={active ? 2.2 : 1.8}
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
    />
  </svg>
)

const CartIcon = ({ active }: { active: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    fill={active ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth={active ? 0 : 1.8}
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
    />
  </svg>
)

const AccountIcon = ({ active }: { active: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    fill={active ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth={active ? 0 : 1.8}
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
    />
  </svg>
)

export default function MobileBottomNav({
  cartItemsCount,
}: {
  cartItemsCount: number
}) {
  const pathname = usePathname()
  const { countryCode } = useParams()
  const prefix = `/${countryCode}`

  const isActive = (href: string) => {
    if (href === "/") return pathname === prefix || pathname === `${prefix}/`
    return pathname.startsWith(`${prefix}${href}`)
  }

  const navItems = [
    { href: "/", label: "Home", icon: HomeIcon },
    { href: "/store", label: "Search", icon: SearchIcon },
    { href: "/cart", label: "Cart", icon: CartIcon },
    { href: "/account", label: "Account", icon: AccountIcon },
  ]

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 small:hidden">
      <div className="bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
        <nav className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = isActive(href)
            return (
              <LocalizedClientLink
                key={href}
                href={href}
                className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-2 relative transition-colors ${
                  active
                    ? "text-ceedmart-navy"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <div className="relative">
                  <Icon active={active} />
                  {label === "Cart" && cartItemsCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-ceedmart-gold text-ceedmart-navy text-[9px] font-bold min-w-[16px] h-4 flex items-center justify-center rounded-full px-1">
                      {cartItemsCount > 99 ? "99+" : cartItemsCount}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[10px] leading-tight ${
                    active ? "font-semibold" : "font-medium"
                  }`}
                >
                  {label}
                </span>
                {active && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-ceedmart-navy rounded-full" />
                )}
              </LocalizedClientLink>
            )
          })}
        </nav>
        {/* Safe area for phones with home indicator */}
        <div className="h-[env(safe-area-inset-bottom)]" />
      </div>
    </div>
  )
}

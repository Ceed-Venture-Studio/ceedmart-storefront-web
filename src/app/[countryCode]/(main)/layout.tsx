import { Metadata } from "next"
import { headers } from "next/headers"
import { Suspense } from "react"

import { listCartOptions, retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { getBaseURL } from "@lib/util/env"
import { StoreCartShippingOption } from "@medusajs/types"
import CartMismatchBanner from "@modules/layout/components/cart-mismatch-banner"
import Footer from "@modules/layout/templates/footer"
import MobileNavWrapper from "@modules/layout/components/mobile-bottom-nav/mobile-nav-wrapper"
import Nav from "@modules/layout/templates/nav"
import BannerSlot from "@modules/banners/components/banner-slot"
import FreeShippingPriceNudge from "@modules/shipping/components/free-shipping-price-nudge"

// Temporary pre-launch behaviour: hide all chrome (nav, footer, banners,
// mobile bottom nav) on the country-root path so visitors can't navigate
// past the coming-soon landing. Remove this guard after launch by reverting
// the conditional back to always rendering the chrome.
const isLandingPath = (pathname: string | null) => {
  if (!pathname) return false
  return /^\/[a-z]{2}\/?$/.test(pathname)
}

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function PageLayout(props: { children: React.ReactNode }) {
  const pathname = (await headers()).get("x-pathname")
  const hideChrome = isLandingPath(pathname)

  // Landing path: just render the page itself. Skip cart/customer fetches
  // entirely so the network round-trip doesn't slow down the splash.
  if (hideChrome) {
    return <>{props.children}</>
  }

  const customer = await retrieveCustomer()
  const cart = await retrieveCart()
  let shippingOptions: StoreCartShippingOption[] = []

  if (cart) {
    const { shipping_options } = await listCartOptions()

    shippingOptions = shipping_options
  }

  return (
    <>
      <BannerSlot slot="promo_strip" />
      <Nav />
      {customer && cart && (
        <CartMismatchBanner customer={customer} cart={cart} />
      )}

      {cart && (
        <FreeShippingPriceNudge
          variant="popup"
          cart={cart}
          shippingOptions={shippingOptions}
        />
      )}
      <div className="pb-16 small:pb-0">{props.children}</div>
      <Footer />
      <Suspense>
        <MobileNavWrapper />
      </Suspense>
    </>
  )
}

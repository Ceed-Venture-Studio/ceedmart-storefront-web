import { Metadata } from "next"
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
import LocationPicker from "@modules/layout/components/location-picker"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function PageLayout(props: { children: React.ReactNode }) {
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
      <LocationPicker />
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

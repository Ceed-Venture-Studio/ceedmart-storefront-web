"use client"

import { Button, Heading } from "@medusajs/ui"

import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"
import DiscountCode from "@modules/checkout/components/discount-code"
import { HttpTypes } from "@medusajs/types"
import { convertToLocale } from "@lib/util/money"

type SummaryProps = {
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }
}

function buildWhatsAppMessage(cart: HttpTypes.StoreCart) {
  const fmt = (n: number) =>
    convertToLocale({ amount: n, currency_code: cart.currency_code })

  const lines =
    cart.items
      ?.map((item, i) => {
        const variant =
          item.variant?.title && item.variant.title !== "Default"
            ? ` — ${item.variant.title}`
            : ""
        const unit = item.unit_price != null ? fmt(item.unit_price) : null
        const lineTotal = item.total != null ? fmt(item.total) : null
        const priceBit =
          unit && lineTotal
            ? `\n   Qty: ${item.quantity} × ${unit} = ${lineTotal}`
            : `\n   Qty: ${item.quantity}`
        return `${i + 1}. ${item.product_title}${variant}${priceBit}`
      })
      .join("\n\n") ?? ""

  const summaryParts: string[] = []
  if (cart.subtotal != null) summaryParts.push(`Subtotal: ${fmt(cart.subtotal)}`)
  if (cart.discount_total && cart.discount_total > 0)
    summaryParts.push(`Discount: -${fmt(cart.discount_total)}`)
  if (cart.shipping_total && cart.shipping_total > 0)
    summaryParts.push(`Shipping: ${fmt(cart.shipping_total)}`)
  summaryParts.push(`Total: ${fmt(cart.total ?? 0)}`)
  const summary = summaryParts.join("\n")

  return encodeURIComponent(
    `Hello CeedMart,\n\nI'd like to place a pre-order for the items below:\n\n${lines}\n\n${summary}\n\nPlease let me know how to proceed with payment and delivery. Thank you!`
  )
}

const WHATSAPP_NUMBER = "2347087502195"

const Summary = ({ cart }: SummaryProps) => {
  // Temporary pre-launch checkout: the Pay Now button is hidden until the
  // payment platform is live. Customers complete orders by sending their
  // cart over WhatsApp. To restore, render the LocalizedClientLink to
  // /checkout?step={getCheckoutStep(cart)} above the WhatsApp button.

  return (
    <div className="flex flex-col gap-y-4">
      <Heading level="h2" className="text-[2rem] leading-[2.75rem]">
        Summary
      </Heading>
      <DiscountCode cart={cart} />
      <Divider />
      <CartTotals totals={cart} />

      <div className="flex flex-col gap-y-2">
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${buildWhatsAppMessage(cart)}`}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="checkout-button"
        >
          <Button
            className="w-full h-11 bg-[#25D366] hover:bg-[#1ebe57] text-white gap-2"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Place order via WhatsApp
          </Button>
        </a>
        <p className="text-xs text-grey-50 text-center">
          Our team will confirm your order, payment and delivery on WhatsApp.
        </p>
      </div>
    </div>
  )
}

export default Summary

import { listCartShippingMethods } from "@lib/data/fulfillment"
import { listCartPaymentMethods } from "@lib/data/payment"
import { listShops } from "@lib/data/shops"
import { getPreorderOffer, groupCartByFulfilment } from "@lib/data/preorder"
import { cartHasPreorder } from "@lib/util/fulfilment-groups"
import { readCartCeedmart } from "@lib/data/ceedmart-metadata"
import { listListingPolicies } from "@lib/data/listing-policy"
import PreorderTerms from "@modules/checkout/components/preorder-terms"
import { HttpTypes } from "@medusajs/types"
import Addresses from "@modules/checkout/components/addresses"
import FulfillmentModeSelector from "@modules/checkout/components/fulfillment-mode"
import Payment from "@modules/checkout/components/payment"
import Review from "@modules/checkout/components/review"
import Shipping from "@modules/checkout/components/shipping"

export default async function CheckoutForm({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) {
  if (!cart) {
    return null
  }

  const [shippingMethods, paymentMethods, shops, grouped] = await Promise.all([
    listCartShippingMethods(cart.id),
    listCartPaymentMethods(cart.region?.id ?? ""),
    listShops(),
    groupCartByFulfilment(cart),
  ])

  if (!shippingMethods || !paymentMethods) {
    return null
  }

  // §6.6 — the customer must accept the pre-order terms before payment, so
  // the gate sits above Payment rather than beside Review. The terms text
  // and its version come from the server; the client never chooses which
  // version it agreed to.
  const preorderGroup = grouped.groups.find((g) => g.kind === "preorder")

  // Resolve the offer through its listing policy — reference_id is the
  // offer id, and a variant id is not interchangeable with one. Any
  // pre-order line resolves the same terms document, so the first will do.
  let preorderOffer = null
  if (cartHasPreorder(grouped) && preorderGroup?.items.length) {
    const policies = await listListingPolicies(
      preorderGroup.items
        .filter((i) => i.variant_id && i.product_id)
        .map((i) => ({
          variantId: i.variant_id as string,
          productId: i.product_id as string,
        }))
    )

    const offerId = preorderGroup.items
      .map((i) => (i.variant_id ? policies[i.variant_id]?.reference_id : null))
      .find(Boolean)

    if (offerId) {
      preorderOffer = await getPreorderOffer(offerId)
    }
  }

  const acceptedVersionId = readCartCeedmart(cart).terms_version_id

  return (
    <div className="w-full grid grid-cols-1 gap-y-8">
      <FulfillmentModeSelector cart={cart} shops={shops} />

      <Addresses cart={cart} customer={customer} />

      <Shipping cart={cart} availableShippingMethods={shippingMethods} />

      {preorderOffer?.terms && (
        <PreorderTerms
          versionId={preorderOffer.terms.version_id}
          body={preorderOffer.terms.body}
          initiallyAccepted={
            acceptedVersionId === preorderOffer.terms.version_id
          }
        />
      )}

      <Payment cart={cart} availablePaymentMethods={paymentMethods} />

      <Review cart={cart} />
    </div>
  )
}

import { HttpTypes } from "@medusajs/types"

/**
 * The first checkout step the cart is not yet ready to skip.
 *
 * Checkout is a single page whose sections open based on `?step=`, so this
 * decides where a customer lands rather than which steps exist. Sending
 * someone to `payment` with no address shows them a section they cannot
 * complete above one they must; sending a returning customer with a saved
 * address back to `address` makes them re-confirm what is already filled in.
 *
 * The order matches the sections in checkout-form: address → delivery →
 * payment. Keep the returned values in step with the `isOpen` checks in
 * each component — they compare this string literally.
 */
export function getCheckoutStep(
  cart: HttpTypes.StoreCart
): "address" | "delivery" | "payment" {
  // Email as well as address: a guest can have a shipping address copied
  // from a previous cart while we still have no way to reach them.
  if (!cart?.shipping_address?.address_1 || !cart.email) {
    return "address"
  }

  if (!cart?.shipping_methods?.length) {
    return "delivery"
  }

  return "payment"
}

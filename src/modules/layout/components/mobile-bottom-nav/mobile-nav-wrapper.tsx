import { retrieveCart } from "@lib/data/cart"
import MobileBottomNav from "."

export default async function MobileNavWrapper() {
  const cart = await retrieveCart().catch(() => null)

  const totalItems =
    cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0

  return <MobileBottomNav cartItemsCount={totalItems} />
}

"use server"

import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import compareAddresses from "@lib/util/compare-addresses"
import { HttpTypes } from "@medusajs/types"
import { revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import {
  getAuthHeaders,
  getCacheOptions,
  getCacheTag,
  getCartId,
  removeAuthToken,
  removeCartId,
  setAuthToken,
} from "./cookies"

export const retrieveCustomer =
  async (): Promise<HttpTypes.StoreCustomer | null> => {
    const authHeaders = await getAuthHeaders()

    if (!authHeaders) return null

    const headers = {
      ...authHeaders,
    }

    const next = {
      ...(await getCacheOptions("customers")),
    }

    return await sdk.client
      .fetch<{ customer: HttpTypes.StoreCustomer }>(`/store/customers/me`, {
        method: "GET",
        query: {
          fields: "*orders",
        },
        headers,
        next,
        cache: "force-cache",
      })
      .then(({ customer }) => customer)
      .catch(() => null)
  }

export const updateCustomer = async (body: HttpTypes.StoreUpdateCustomer) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const updateRes = await sdk.store.customer
    .update(body, {}, headers)
    .then(({ customer }) => customer)
    .catch(medusaError)

  const cacheTag = await getCacheTag("customers")
  revalidateTag(cacheTag)

  return updateRes
}

export async function signup(_currentState: unknown, formData: FormData) {
  const password = formData.get("password") as string
  const customerForm = {
    email: formData.get("email") as string,
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    phone: formData.get("phone") as string,
  }

  try {
    const token = await sdk.auth.register("customer", "emailpass", {
      email: customerForm.email,
      password: password,
    })

    await setAuthToken(token as string)

    const headers = {
      ...(await getAuthHeaders()),
    }

    // Raw fetch rather than sdk.store.customer.create so the auth cookie
    // stays ours to set, below.
    const createRes = await sdk.client.fetch<{
      customer: HttpTypes.StoreCustomer
    }>("/store/customers", {
      method: "POST",
      body: { ...customerForm, password },
      headers,
    })

    const loginToken = await sdk.auth.login("customer", "emailpass", {
      email: customerForm.email,
      password,
    })

    await setAuthToken(loginToken as string)

    const customerCacheTag = await getCacheTag("customers")
    revalidateTag(customerCacheTag)

    await transferCart()

    return null
  } catch (error: any) {
    if (error instanceof Error) {
      return error.message
    }
    if (typeof error === "object" && error?.message) {
      return error.message
    }
    return "An error occurred during registration. Please try again."
  }
}

/**
 * Where to send someone after signing in.
 *
 * Only a path on this site. An absolute URL — "//evil.test", "https://…" —
 * is discarded rather than followed, because this value arrives from a query
 * string and a login form that redirects anywhere it is told is an open
 * redirect wearing a helpful face.
 */
const safeRedirect = (value: FormDataEntryValue | null): string | null => {
  const path = typeof value === "string" ? value.trim() : ""
  if (!path.startsWith("/") || path.startsWith("//")) {
    return null
  }
  return path
}

export async function login(_currentState: unknown, formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const redirectTo = safeRedirect(formData.get("redirect_to"))

  try {
    // Raw fetch rather than sdk.auth.login so the token lands in our own
    // cookie via setAuthToken, which is what getAuthHeaders reads.
    const loginRes = await sdk.client.fetch<{
      token: string
    }>("/auth/customer/emailpass", {
      method: "POST",
      body: { email, password },
    })

    await setAuthToken(loginRes.token)

    const customerCacheTag = await getCacheTag("customers")
    revalidateTag(customerCacheTag)
  } catch (error: any) {
    if (error instanceof Error) {
      return error.message
    }
    if (typeof error === "object" && error?.message) {
      return error.message
    }
    return "Invalid email or password. Please try again."
  }

  try {
    await transferCart()
  } catch (error: any) {
    return null
  }

  // Back where they came from, when they were sent here mid-task.
  //
  // Someone who reached this form from checkout is signing in in order to
  // pay, not to visit their account. Landing them on the dashboard leaves
  // them to find their way back to a cart they had already filled.
  //
  // Outside the try above on purpose: redirect() signals by throwing, and a
  // catch would swallow it and silently do nothing.
  if (redirectTo) {
    redirect(redirectTo)
  }
}

export async function signout(countryCode: string) {
  await sdk.auth.logout()

  await removeAuthToken()

  const customerCacheTag = await getCacheTag("customers")
  revalidateTag(customerCacheTag)

  await removeCartId()

  const cartCacheTag = await getCacheTag("carts")
  revalidateTag(cartCacheTag)

  redirect(`/${countryCode}/account`)
}

export async function transferCart() {
  const cartId = await getCartId()

  if (!cartId) {
    return
  }

  const headers = await getAuthHeaders()

  await sdk.store.cart.transferCart(cartId, {}, headers)

  const cartCacheTag = await getCacheTag("carts")
  revalidateTag(cartCacheTag)
}

export const addCustomerAddress = async (
  currentState: Record<string, unknown>,
  formData: FormData
): Promise<any> => {
  const isDefaultBilling = (currentState.isDefaultBilling as boolean) || false
  const isDefaultShipping = (currentState.isDefaultShipping as boolean) || false

  const address = {
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    company: formData.get("company") as string,
    address_1: formData.get("address_1") as string,
    address_2: formData.get("address_2") as string,
    city: formData.get("city") as string,
    postal_code: formData.get("postal_code") as string,
    province: formData.get("province") as string,
    country_code: formData.get("country_code") as string,
    phone: formData.get("phone") as string,
    is_default_billing: isDefaultBilling,
    is_default_shipping: isDefaultShipping,
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.customer
    .createAddress(address, {}, headers)
    .then(async ({ customer }) => {
      const customerCacheTag = await getCacheTag("customers")
      revalidateTag(customerCacheTag)
      return { success: true, error: null }
    })
    .catch((err) => {
      return { success: false, error: err.toString() }
    })
}

/**
 * Save an address to the signed-in customer's address book, unless they
 * already have it.
 *
 * Called from checkout, where the address has just been written to the CART.
 * A cart address and a customer address are different records — the cart one
 * is a snapshot of where this order goes, and copying it here is what makes
 * it available to the next order.
 *
 * Deduped with the same comparison the checkout uses to decide whether
 * billing matches shipping, so ordering twice to the same place does not
 * accumulate identical entries. Someone who edits a single character gets a
 * second address, which is correct: we cannot tell a correction from a
 * genuinely different destination, and a spurious entry is easier to live
 * with than a silently overwritten one.
 *
 * Never throws. This runs after the cart is already updated, and failing to
 * save a convenience copy must not take down a checkout that has otherwise
 * succeeded.
 */
export const saveCustomerAddressIfNew = async (
  address: HttpTypes.StoreCreateCustomerAddress
): Promise<{ saved: boolean; reason?: string }> => {
  try {
    const customer = await retrieveCustomer()
    if (!customer) {
      return { saved: false, reason: "not signed in" }
    }

    const existing = customer.addresses ?? []
    if (existing.some((a) => compareAddresses(a, address))) {
      return { saved: false, reason: "already saved" }
    }

    const headers = { ...(await getAuthHeaders()) }
    await sdk.store.customer.createAddress(
      {
        ...address,
        // The first address a customer saves becomes their default for both,
        // so a returning customer has something preselected rather than a
        // list where nothing is chosen.
        is_default_shipping: existing.length === 0,
        is_default_billing: existing.length === 0,
      },
      {},
      headers
    )

    const customerCacheTag = await getCacheTag("customers")
    revalidateTag(customerCacheTag)
    return { saved: true }
  } catch (err: any) {
    console.warn(
      `[checkout] could not save address to the customer's address book: ${err?.message ?? err}`
    )
    return { saved: false, reason: "error" }
  }
}

export const deleteCustomerAddress = async (
  addressId: string
): Promise<void> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  await sdk.store.customer
    .deleteAddress(addressId, headers)
    .then(async () => {
      const customerCacheTag = await getCacheTag("customers")
      revalidateTag(customerCacheTag)
      return { success: true, error: null }
    })
    .catch((err) => {
      return { success: false, error: err.toString() }
    })
}

export const updateCustomerAddress = async (
  currentState: Record<string, unknown>,
  formData: FormData
): Promise<any> => {
  const addressId =
    (currentState.addressId as string) || (formData.get("addressId") as string)

  if (!addressId) {
    return { success: false, error: "Address ID is required" }
  }

  const address = {
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    company: formData.get("company") as string,
    address_1: formData.get("address_1") as string,
    address_2: formData.get("address_2") as string,
    city: formData.get("city") as string,
    postal_code: formData.get("postal_code") as string,
    province: formData.get("province") as string,
    country_code: formData.get("country_code") as string,
  } as HttpTypes.StoreUpdateCustomerAddress

  const phone = formData.get("phone") as string

  if (phone) {
    address.phone = phone
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.customer
    .updateAddress(addressId, address, {}, headers)
    .then(async () => {
      const customerCacheTag = await getCacheTag("customers")
      revalidateTag(customerCacheTag)
      return { success: true, error: null }
    })
    .catch((err) => {
      return { success: false, error: err.toString() }
    })
}

/**
 * Ask for a password-reset email.
 *
 * Always reports success, even for an address with no account. Medusa's own
 * route does the same — it runs the workflow with throwOnError false — and
 * for the same reason: a form that says "no such account" is a way to find
 * out who banks here. The customer sees one message either way.
 */
export async function requestPasswordReset(
  _currentState: unknown,
  formData: FormData
) {
  const email = (formData.get("email") as string)?.trim()

  if (!email) {
    return { ok: false, message: "Enter the email address you signed up with." }
  }

  try {
    await sdk.client.fetch("/auth/customer/emailpass/reset-password", {
      method: "POST",
      body: { identifier: email },
    })
  } catch (error: any) {
    // Deliberately swallowed. The endpoint returns 201 whether or not the
    // account exists, so a failure here is ours — a network blip, Pulse
    // down — and telling the customer to try again is more useful than an
    // internal message. It is logged for whoever has to look.
    console.error("[password-reset] request failed:", error?.message ?? error)
  }

  return {
    ok: true,
    message:
      "If that email has an account, we've sent a link to reset the password. It expires shortly, so use it soon.",
  }
}

/**
 * Set a new password using the token from the reset email.
 *
 * The token IS the authentication — Medusa reads entity_id from it — so
 * there is no email field here and no way to point it at someone else.
 */
export async function resetPassword(
  _currentState: unknown,
  formData: FormData
) {
  const token = formData.get("token") as string
  const password = formData.get("password") as string
  const confirm = formData.get("confirm_password") as string

  if (!token) {
    return {
      ok: false,
      message:
        "This reset link is missing its token. Request a new email and use the link from that.",
    }
  }

  if (!password || password.length < 8) {
    return { ok: false, message: "Use a password of at least 8 characters." }
  }

  if (password !== confirm) {
    return { ok: false, message: "Those two passwords don't match." }
  }

  try {
    await sdk.client.fetch("/auth/customer/emailpass/update", {
      method: "POST",
      body: { password },
      headers: { Authorization: `Bearer ${token}` },
    })
  } catch (error: any) {
    // A rejected token is the common case here, and it is almost always
    // expiry or reuse rather than anything the customer did wrong.
    return {
      ok: false,
      message:
        "That link has expired or has already been used. Request a new one and try again.",
    }
  }

  return { ok: true, message: "Password updated. You can sign in with it now." }
}

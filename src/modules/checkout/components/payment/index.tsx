"use client"

import { RadioGroup } from "@headlessui/react"
import { isStripeLike, isPulsePay, paymentInfoMap } from "@lib/constants"
import { initiatePaymentSession } from "@lib/data/cart"
import {
  isCartPaid,
  listPulsePaymentOptions,
  type PulsePaymentOption,
} from "@lib/data/payment"
import { CheckCircleSolid, CreditCard } from "@medusajs/icons"
import { Button, Container, Heading, Text, clx } from "@medusajs/ui"
import ErrorMessage from "@modules/checkout/components/error-message"
import PaymentContainer, {
  StripeCardContainer,
} from "@modules/checkout/components/payment-container"
import Divider from "@modules/common/components/divider"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

const Payment = ({
  cart,
  availablePaymentMethods,
}: {
  cart: any
  availablePaymentMethods: any[]
}) => {
  const activeSession = cart.payment_collection?.payment_sessions?.find(
    (paymentSession: any) => paymentSession.status === "pending"
  )

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cardBrand, setCardBrand] = useState<string | null>(null)
  const [cardComplete, setCardComplete] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    activeSession?.provider_id ?? ""
  )

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // Kept so a customer whose redirect was blocked or slow has a link to the
  // same payment rather than starting over.
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null)

  // The gateways this shop can actually charge with, straight from Pulse.
  // Medusa lists one Pulse row; the real choice sits a level below it and
  // changes on the Pulse dashboard without a deploy, so it cannot come from
  // config here.
  const [pulseOptions, setPulseOptions] = useState<PulsePaymentOption[] | null>(
    null
  )
  // Why the list is empty, when it is. "not_signed_in" is recoverable in one
  // click and deserves saying so; the others are not the customer's doing.
  const [pulseReason, setPulseReason] = useState<string | null>(null)
  const [selectedChannel, setSelectedChannel] = useState<string | undefined>()

  // Whether to name a gateway when creating the payment. With one
  // configured Pulse resolves it and we send nothing; it refuses to guess
  // between several, so a choice is only meaningful when there is one.
  // Always send what they chose. This used to be sent only when there was
  // more than one option, on the theory that Pulse resolves a lone gateway
  // itself — but the customer has now named one explicitly, and saying so
  // does not depend on that behaviour holding.
  const pulseChannel = selectedChannel

  // The gateway the customer is actually about to be sent to: the only one
  // configured, or the one they picked. Null until we know — and when it is
  // null the UI says "payment" rather than guessing a brand name. Naming the
  // wrong gateway is worse than naming none: the customer lands on a page
  // that does not match the button they pressed.
  const activeOption = pulseOptions?.find(
    (o) => o.provider === selectedChannel
  )
  const gatewayName = activeOption?.displayName || null

  const isOpen = searchParams.get("step") === "payment"

  const visiblePaymentMethods = (availablePaymentMethods ?? []).filter(
    (pm: any) => isPulsePay(pm.id)
  )

  // List the gateways themselves rather than a generic row that opens into
  // them. "Card or bank transfer" was a step that asked the customer to
  // agree to a category before it would tell them who was taking the money;
  // the thing they are choosing IS Paystack or Monnify, so offer that.
  //
  // Falls back to the plain Medusa row whenever Pulse has not answered —
  // offline, no pim_id, nothing configured — so checkout never renders an
  // empty payment step.
  const pulseMethodId = visiblePaymentMethods.find((pm: any) =>
    isPulsePay(pm.id)
  )?.id
  const listGateways = Boolean(
    pulseMethodId && pulseOptions && pulseOptions.length > 0
  )

  // Pulse mints its token per customer, so a signed-out shopper always comes
  // back with nothing. Showing them the generic payment row was a dead end:
  // it looked selectable, and behind it there was no gateway, no pim_id, and
  // a card flow that is account-only by design. Ask them to sign in instead.
  const needsSignIn = pulseReason === "not_signed_in"
  const signInHref = `/account?redirect=${encodeURIComponent(
    `${pathname}?step=payment`
  )}`

  // Titles come from Pulse, so a gateway added on their dashboard appears
  // here without a deploy and without a local name map to go stale.
  const gatewayInfoMap = Object.fromEntries(
    (pulseOptions ?? []).map((o) => [
      o.provider,
      { title: o.displayName, icon: <CreditCard /> },
    ])
  )

  const setPaymentMethod = async (method: string) => {
    setError(null)
    setSelectedPaymentMethod(method)
    if (isStripeLike(method)) {
      await initiatePaymentSession(cart, {
        provider_id: method,
      })
    }
  }

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const paymentReady =
    (activeSession && cart?.shipping_methods.length !== 0) || paidByGiftcard

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  const handleEdit = () => {
    router.push(pathname + "?" + createQueryString("step", "payment"), {
      scroll: false,
    })
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setError(null)

    // Same tab, deliberately.
    //
    // The gateway used to open in a second tab so this page could stay put.
    // But the gateway REDIRECTS back when it is done, and it redirects the
    // tab it is in — so the customer ended up with two checkouts: a new tab
    // holding the real one, and the original still sitting on the payment
    // step behind it. Two pages, one cart, and whichever they looked at
    // first was usually the stale one.
    //
    // A redirect flow only needs one page. Navigating away is safe here:
    // the cart lives on the server, and coming back restores the step from
    // the URL.

    try {
      // Never replace a session that has already been paid.
      //
      // Medusa's createPaymentSessions DELETES the existing session before
      // making a new one. Between paying and the webhook confirming, our
      // session still reads `pending` — so tapping back into this step threw
      // away a completed payment and started another. It happened twice, to
      // two real payments, and left the customer watching a page that could
      // never finish because the session it polled had never been paid.
      //
      const alreadyPaid = await isCartPaid()
      if (alreadyPaid.paid) {
        router.push(pathname + "?" + createQueryString("step", "review"))
        return
      }

      // "unknown" means we could not reach Pulse — it does NOT mean unpaid.
      //
      // This used to carry on regardless, reasoning that an unreachable
      // Pulse should not strand someone who has not paid. But carrying on
      // means createPaymentSessions, and that DELETES the existing session
      // — so the one case we cannot rule out, a payment already made, is
      // the case we destroyed the evidence of.
      //
      // It is not hypothetical. On 18 Sep a customer paid ₦42,500 and tried
      // five times in fourteen minutes; every check answered "unknown"
      // because the Pulse API key had stopped authenticating, and every
      // attempt discarded the session before it. Four payment ids that only
      // Pulse can now account for.
      //
      // So when we cannot tell, we reuse the session rather than replace it.
      // A customer who has already paid keeps the record of it; one who has
      // not is returned to the same gateway page and can still pay. Nobody
      // is stranded, and nothing is thrown away.
      const reusableUrl = activeSession?.data?.checkout_url as
        | string
        | undefined

      if (alreadyPaid.reason === "unknown" && activeSession) {
        if (reusableUrl) {
          setCheckoutUrl(reusableUrl)
          window.location.href = reusableUrl
          return
        }

        // A session we can neither verify nor resume. Replacing it could
        // discard a real payment, so we stop and hand this to a human
        // instead of guessing with the customer's money.
        setError(
          "We can't confirm the status of your payment right now. Please don't pay again — " +
            "contact us on WhatsApp and we'll check and complete your order."
        )
        return
      }

      const shouldInputCard =
        isStripeLike(selectedPaymentMethod) && !activeSession

      // Pulse Pay: create a fresh session, then hand the customer to the
      // gateway in a SEPARATE tab so the cart and this page stay put.
      //
      // Only reached when Pulse gave a definite "not paid", or when there is
      // no session to lose — the unverifiable case returned above rather
      // than replacing anything.
      if (isPulsePay(selectedPaymentMethod)) {
        const result = await initiatePaymentSession(cart, {
          provider_id: selectedPaymentMethod,
          data: {
            ...(pulseChannel ? { channel: pulseChannel } : {}),
            // Where to send them back to. ceedmart.com and www.ceedmart.com
            // both serve this app, and a cart cookie set on one is not sent
            // to the other — so a redirect built from a single configured
            // origin returned half our customers to a host where they had no
            // cart, and the review step 404'd with the money already taken.
            // Only the host is taken from this, and only when it matches the
            // configured domain.
            origin:
              typeof window !== "undefined" ? window.location.origin : "",
          },
        } as any)

        if (result?.checkout_url) {
          // Kept in state as well as navigated to: if the browser blocks or
          // delays the assignment, the notice below gives them a link they
          // can press themselves rather than a page that looks stuck.
          setCheckoutUrl(result.checkout_url)
          window.location.href = result.checkout_url
          return
        }

        setError("Failed to initiate payment. Please try again.")
        return
      }

      const checkActiveSession =
        activeSession?.provider_id === selectedPaymentMethod

      if (!checkActiveSession) {
        await initiatePaymentSession(cart, {
          provider_id: selectedPaymentMethod,
        })
      }

      if (!shouldInputCard) {
        return router.push(
          pathname + "?" + createQueryString("step", "review"),
          {
            scroll: false,
          }
        )
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!isOpen) {
      return
    }
    let cancelled = false
    listPulsePaymentOptions().then(({ options, reason }) => {
      if (!cancelled) {
        setPulseOptions(options)
        setPulseReason(reason)
      }
    })
    return () => {
      cancelled = true
    }
  }, [isOpen])

  // Clean up session_id from URL on return from payment provider
  useEffect(() => {
    setError(null)
    if (searchParams.has("session_id")) {
      const step = searchParams.get("step") || "payment"
      router.replace(pathname + "?step=" + step, { scroll: false })
    }
  }, [isOpen])

  return (
    <div className="bg-white">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row text-3xl-regular gap-x-2 items-baseline",
            {
              "opacity-50 pointer-events-none select-none":
                !isOpen && !paymentReady,
            }
          )}
        >
          Payment
          {!isOpen && paymentReady && <CheckCircleSolid />}
        </Heading>
        {!isOpen && paymentReady && (
          <Text>
            <button
              onClick={handleEdit}
              className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
              data-testid="edit-payment-button"
            >
              Edit
            </button>
          </Text>
        )}
      </div>
      <div>
        <div className={isOpen ? "block" : "hidden"}>
          {!paidByGiftcard && needsSignIn && (
            <div
              className="rounded-lg border border-ui-border-base bg-ui-bg-subtle p-4 flex flex-col gap-3"
              data-testid="payment-sign-in-prompt"
            >
              <Text className="txt-medium-plus text-ui-fg-base">
                Sign in to complete payment
              </Text>
              <Text className="txt-medium text-ui-fg-subtle">
                Card and bank payments are tied to your account, so we can
                show your order and its receipt afterwards. Your cart is kept
                — you&apos;ll come straight back here.
              </Text>
              <LocalizedClientLink href={signInHref} className="w-fit">
                <Button
                  className="h-10 bg-ceedmart-navy hover:bg-ceedmart-navy-light"
                  data-testid="payment-sign-in-button"
                >
                  Sign in
                </Button>
              </LocalizedClientLink>
            </div>
          )}

          {!paidByGiftcard && !needsSignIn && visiblePaymentMethods.length > 0 && (
            <>
              {listGateways ? (
                <RadioGroup
                  value={selectedChannel ?? ""}
                  onChange={(provider: string) => {
                    setSelectedChannel(provider)
                    // Picking a gateway also picks the Medusa provider it
                    // belongs to, so the rest of the step — the submit
                    // button's enabled state, the session it creates — works
                    // unchanged.
                    if (pulseMethodId) {
                      setPaymentMethod(pulseMethodId)
                    }
                  }}
                  data-testid="pulse-gateway-list"
                >
                  {pulseOptions!.map((option) => (
                    <PaymentContainer
                      key={option.provider}
                      paymentInfoMap={gatewayInfoMap}
                      paymentProviderId={option.provider}
                      selectedPaymentOptionId={selectedChannel ?? null}
                    >
                      {/* A shop quietly on test credentials looks exactly
                          like one taking real money. Say so on the row the
                          customer is about to choose. */}
                      {!option.isLive && (
                        <Text className="txt-compact-xsmall text-ui-tag-orange-text">
                          Test mode — no real payment will be taken.
                        </Text>
                      )}
                    </PaymentContainer>
                  ))}
                </RadioGroup>
              ) : (
              <RadioGroup
                value={selectedPaymentMethod}
                onChange={(value: string) => setPaymentMethod(value)}
              >
                {visiblePaymentMethods.map((paymentMethod) => (
                  <div key={paymentMethod.id}>
                    {isStripeLike(paymentMethod.id) ? (
                      <StripeCardContainer
                        paymentProviderId={paymentMethod.id}
                        selectedPaymentOptionId={selectedPaymentMethod}
                        paymentInfoMap={paymentInfoMap}
                        setCardBrand={setCardBrand}
                        setError={setError}
                        setCardComplete={setCardComplete}
                      />
                    ) : (
                      <PaymentContainer
                        paymentInfoMap={paymentInfoMap}
                        paymentProviderId={paymentMethod.id}
                        selectedPaymentOptionId={selectedPaymentMethod}
                      />
                    )}
                  </div>
                ))}
              </RadioGroup>
              )}
            </>
          )}

          {paidByGiftcard && (
            <div className="flex flex-col">
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
                Payment method
              </Text>
              <Text
                className="txt-medium text-ui-fg-subtle"
                data-testid="payment-method-summary"
              >
                Gift card
              </Text>
            </div>
          )}

          <ErrorMessage
            error={error}
            data-testid="payment-method-error-message"
          />

          <Button
            size="large"
            className="mt-6 bg-ceedmart-navy hover:bg-ceedmart-navy-light"
            onClick={handleSubmit}
            isLoading={isLoading}
            disabled={
              (isStripeLike(selectedPaymentMethod) && !cardComplete) ||
              (!selectedPaymentMethod && !paidByGiftcard)
            }
            data-testid="submit-payment-button"
          >
            {!activeSession && isStripeLike(selectedPaymentMethod)
              ? "Enter card details"
              : isPulsePay(selectedPaymentMethod)
                ? gatewayName
                  ? `Pay with ${gatewayName}`
                  : "Continue to payment"
                : "Continue to review"}
          </Button>

          {/* Only seen if the navigation has not taken effect yet, or the
              browser refused it. Without this the page looks like the button
              did nothing. */}
          {checkoutUrl && (
            <div
              className="mt-4 rounded-md border border-ui-border-base bg-ui-bg-subtle p-4"
              data-testid="payment-tab-notice"
            >
              <Text className="txt-medium text-ui-fg-base">
                Taking you to {gatewayName ?? "the payment page"}. You&apos;ll
                come straight back here once you&apos;ve paid.
              </Text>
              <a
                href={checkoutUrl}
                className="txt-medium-plus text-ceedmart-navy underline mt-2 inline-block"
                data-testid="reopen-payment-link"
              >
                Not redirected? Continue to {gatewayName ?? "payment"}
              </a>
            </div>
          )}
        </div>

        <div className={isOpen ? "hidden" : "block"}>
          {cart && paymentReady && activeSession ? (
            <div className="grid grid-cols-2 small:grid-cols-3 gap-x-4 gap-y-5 w-full">
              <div className="flex flex-col">
                <Text className="txt-medium-plus text-ui-fg-base mb-1">
                  Payment method
                </Text>
                <Text
                  className="txt-medium text-ui-fg-subtle"
                  data-testid="payment-method-summary"
                >
                  {/* Prefer the gateway Pulse named over the static map,
                      which cannot know which of several was used. */}
                  {gatewayName ||
                    paymentInfoMap[activeSession?.provider_id]?.title ||
                    activeSession?.provider_id}
                </Text>
              </div>
              <div className="flex flex-col">
                <Text className="txt-medium-plus text-ui-fg-base mb-1">
                  Payment details
                </Text>
                <div
                  className="flex gap-2 txt-medium text-ui-fg-subtle items-center"
                  data-testid="payment-details-summary"
                >
                  <Container className="flex items-center h-7 w-fit p-2 bg-ui-button-neutral-hover">
                    {paymentInfoMap[selectedPaymentMethod]?.icon || (
                      <CreditCard />
                    )}
                  </Container>
                  <Text>
                    {isStripeLike(selectedPaymentMethod) && cardBrand
                      ? cardBrand
                      : "Another step will appear"}
                  </Text>
                </div>
              </div>
            </div>
          ) : paidByGiftcard ? (
            <div className="flex flex-col">
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
                Payment method
              </Text>
              <Text
                className="txt-medium text-ui-fg-subtle"
                data-testid="payment-method-summary"
              >
                Gift card
              </Text>
            </div>
          ) : null}
        </div>
      </div>
      <Divider className="mt-8" />
    </div>
  )
}

export default Payment

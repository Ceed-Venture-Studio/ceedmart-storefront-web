"use client"

import { RadioGroup } from "@headlessui/react"
import { isStripeLike, isPulsePay, paymentInfoMap } from "@lib/constants"
import { initiatePaymentSession } from "@lib/data/cart"
import {
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

  // Kept after the tab opens so a customer who closes it, or whose browser
  // blocked it, has a way back to the same payment rather than starting over.
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null)

  // The gateways this shop can actually charge with, straight from Pulse.
  // Medusa lists one Pulse row; the real choice sits a level below it and
  // changes on the Pulse dashboard without a deploy, so it cannot come from
  // config here.
  const [pulseOptions, setPulseOptions] = useState<PulsePaymentOption[] | null>(
    null
  )
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

    // Reserve the tab NOW, in the synchronous part of the click handler.
    // Creating the payment session takes seconds, and a window.open() after
    // an await has lost the user gesture — every browser blocks it. Opening
    // first and pointing it at the URL afterwards is the only reliable way.
    const paymentTab = isPulsePay(selectedPaymentMethod)
      ? window.open("", "_blank")
      : null

    // Say something while the tab waits. Without this it is several seconds
    // of blank white, which reads as a broken link.
    if (paymentTab) {
      try {
        paymentTab.document.write(
          `<!doctype html><meta charset="utf-8"><title>Opening secure payment…</title>` +
            `<div style="font:16px/1.6 system-ui,sans-serif;color:#05007F;` +
            `display:flex;align-items:center;justify-content:center;height:90vh">` +
            `Opening secure payment…</div>`
        )
      } catch {
        // Some browsers disallow writing into a fresh tab. Harmless — the
        // customer just sees a blank tab a moment longer.
      }
    }

    try {
      const shouldInputCard =
        isStripeLike(selectedPaymentMethod) && !activeSession

      // Pulse Pay: always create a fresh session, then hand the customer to
      // the gateway in a SEPARATE tab so the cart and this page stay put.
      if (isPulsePay(selectedPaymentMethod)) {
        const result = await initiatePaymentSession(cart, {
          provider_id: selectedPaymentMethod,
          ...(pulseChannel ? { data: { channel: pulseChannel } } : {}),
        } as any)

        if (result?.checkout_url) {
          setCheckoutUrl(result.checkout_url)

          if (paymentTab && !paymentTab.closed) {
            paymentTab.location.href = result.checkout_url
          } else {
            // Blocked, or closed before we got the URL. Falling back to this
            // tab is worse than the intent but far better than a customer
            // who clicked Pay and got nothing.
            window.location.href = result.checkout_url
          }
          return
        }

        paymentTab?.close()
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
      paymentTab?.close()
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
    listPulsePaymentOptions().then(({ options }) => {
      if (!cancelled) {
        setPulseOptions(options)
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
          {!paidByGiftcard && visiblePaymentMethods.length > 0 && (
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

          {/* The payment is happening in another tab, so this page has to
              account for itself: say where they went, and give them a way
              back if that tab was blocked or closed. Without this the page
              just sits there looking like the button did nothing. */}
          {checkoutUrl && (
            <div
              className="mt-4 rounded-md border border-ui-border-base bg-ui-bg-subtle p-4"
              data-testid="payment-tab-notice"
            >
              <Text className="txt-medium text-ui-fg-base">
                {gatewayName ?? "The payment page"} is open in another tab.
                Finish paying there and you&apos;ll be brought back to confirm
                your order.
              </Text>
              <a
                href={checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="txt-medium-plus text-ceedmart-navy underline mt-2 inline-block"
                data-testid="reopen-payment-link"
              >
                Tab didn&apos;t open? Continue to {gatewayName ?? "payment"}
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

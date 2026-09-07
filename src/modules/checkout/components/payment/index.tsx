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
  const pulseChannel =
    pulseOptions && pulseOptions.length > 1 ? selectedChannel : undefined

  const isOpen = searchParams.get("step") === "payment"

  const visiblePaymentMethods = (availablePaymentMethods ?? []).filter(
    (pm: any) => isPulsePay(pm.id)
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
            </>
          )}

          {paidByGiftcard && (
            <div className="flex flex-col w-1/3">
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
                ? "Pay with Paystack"
                : "Continue to review"}
          </Button>

          {/* The payment is happening in another tab, so this page has to
              account for itself: say where they went, and give them a way
              back if that tab was blocked or closed. Without this the page
              just sits there looking like the button did nothing. */}
          {/* Named gateways, straight from Pulse. Shown only when there is
              a decision to make — one option is not a choice, it is a label,
              and Pulse resolves it for us. */}
          {isPulsePay(selectedPaymentMethod) &&
            pulseOptions &&
            pulseOptions.length > 1 && (
              <div className="mt-4" data-testid="pulse-channel-picker">
                <Text className="txt-medium-plus text-ui-fg-base mb-2">
                  Pay with
                </Text>
                <div className="flex flex-col gap-y-2">
                  {pulseOptions.map((option) => (
                    <label
                      key={option.provider}
                      className="flex items-center gap-x-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="pulse_channel"
                        value={option.provider}
                        checked={selectedChannel === option.provider}
                        onChange={() => setSelectedChannel(option.provider)}
                      />
                      <span className="txt-medium">{option.displayName}</span>
                      {!option.isLive && (
                        <span className="txt-compact-xsmall rounded bg-ui-tag-orange-bg text-ui-tag-orange-text px-1.5 py-0.5">
                          test mode
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              </div>
            )}

          {/* A shop quietly running on test credentials looks exactly like
              one taking real money. Say so where the customer would notice. */}
          {isPulsePay(selectedPaymentMethod) &&
            pulseOptions?.length === 1 &&
            !pulseOptions[0].isLive && (
              <Text
                className="txt-compact-small text-ui-tag-orange-text mt-3"
                data-testid="pulse-test-mode-notice"
              >
                Test mode — {pulseOptions[0].displayName} is using test
                credentials, so no real payment will be taken.
              </Text>
            )}

          {checkoutUrl && (
            <div
              className="mt-4 rounded-md border border-ui-border-base bg-ui-bg-subtle p-4"
              data-testid="payment-tab-notice"
            >
              <Text className="txt-medium text-ui-fg-base">
                Paystack is open in another tab. Finish paying there and
                you&apos;ll be brought back to confirm your order.
              </Text>
              <a
                href={checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="txt-medium-plus text-ceedmart-navy underline mt-2 inline-block"
                data-testid="reopen-payment-link"
              >
                Tab didn&apos;t open? Continue to Paystack
              </a>
            </div>
          )}
        </div>

        <div className={isOpen ? "hidden" : "block"}>
          {cart && paymentReady && activeSession ? (
            <div className="flex items-start gap-x-1 w-full">
              <div className="flex flex-col w-1/3">
                <Text className="txt-medium-plus text-ui-fg-base mb-1">
                  Payment method
                </Text>
                <Text
                  className="txt-medium text-ui-fg-subtle"
                  data-testid="payment-method-summary"
                >
                  {paymentInfoMap[activeSession?.provider_id]?.title ||
                    activeSession?.provider_id}
                </Text>
              </div>
              <div className="flex flex-col w-1/3">
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
            <div className="flex flex-col w-1/3">
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

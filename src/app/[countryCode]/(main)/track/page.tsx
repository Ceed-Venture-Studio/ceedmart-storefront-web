import type { Metadata } from "next"
import TrackForm from "@modules/order-tracking/components/track-form"

export const metadata: Metadata = {
  title: "Track your order | Ceedmart",
  description:
    "Look up your Ceedmart order status using your order number and the email or phone you provided at checkout.",
}

type Props = {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ ref?: string; contact?: string }>
}

export default async function TrackPage({ searchParams }: Props) {
  const initial = (await searchParams) ?? {}

  return (
    <div className="content-container py-12 small:py-20">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl small:text-4xl font-extrabold text-ui-fg-base mb-2">
          Track your order
        </h1>
        <p className="text-ui-fg-subtle mb-8">
          Enter the order number from your confirmation email plus the phone
          or email you used at checkout.
        </p>
        <TrackForm
          initialRef={initial.ref ?? ""}
          initialContact={initial.contact ?? ""}
        />
      </div>
    </div>
  )
}

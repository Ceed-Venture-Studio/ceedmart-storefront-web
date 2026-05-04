import { Metadata } from "next"
import SolarAssistantView from "@modules/solar/templates/solar-assistant-view"

export const metadata: Metadata = {
  title: "Solar Estimates",
  description:
    "Tell us what you want to power and we'll size a solar inverter, battery, and panel bundle for you.",
}

export default function SolarPage() {
  return (
    <div className="content-container py-8 small:py-12 pb-24 small:pb-16">
      <header className="mb-6 small:mb-10">
        <h1 className="text-3xl small:text-4xl font-semibold text-ui-fg-base">
          Get a solar estimate
        </h1>
        <p className="mt-2 text-sm small:text-base text-grey-60 max-w-2xl">
          Tell us the appliances that matter most to you and we&apos;ll size
          three solar bundles — budget, recommended, and premium — so you can
          pick the one that fits.
        </p>
      </header>
      <SolarAssistantView />
    </div>
  )
}

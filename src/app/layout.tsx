import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import localFont from "next/font/local"
import "styles/globals.css"
import { DeliveryLocationProvider } from "@lib/context/delivery-location-context"

const gilroy = localFont({
  src: [
    {
      path: "../../gilroy/Gilroy-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../gilroy/Gilroy-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../gilroy/Gilroy-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../gilroy/Gilroy-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../gilroy/Gilroy-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-gilroy",
  display: "swap",
  fallback: [
    "Inter",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "sans-serif",
  ],
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light" className={gilroy.variable}>
      <body className="font-sans">
        {/* Sits at the root, not in (main), so the (checkout) route group can
            read the chosen delivery city too. */}
        <DeliveryLocationProvider>
          <main className="relative">{props.children}</main>
        </DeliveryLocationProvider>
      </body>
    </html>
  )
}

import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import localFont from "next/font/local"
import { GoogleAnalytics } from "@next/third-parties/google"
import "styles/globals.css"
import { DeliveryLocationProvider } from "@lib/context/delivery-location-context"

// GA4 measurement id (G-XXXXXXXXXX). NEXT_PUBLIC_, so it is inlined into the
// client bundle AT BUILD TIME — a Cloud Run env var set after the fact does
// nothing. It has to be passed as a --build-arg, which is why it appears in
// both the Dockerfile and cloudbuild.yaml.
//
// Unset means no tag is rendered at all, which keeps local development and
// preview builds out of the production property's data.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID

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
        {/* After the content, so the tag never delays first paint. GA4's
            enhanced measurement picks up client-side route changes from the
            History API, which is how App Router navigates — so page_view
            fires on soft navigations without us wiring anything up. */}
        {GA_ID ? <GoogleAnalytics gaId={GA_ID} /> : null}
      </body>
    </html>
  )
}

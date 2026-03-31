import { Heading } from "@medusajs/ui"
import React from "react"

const WHATSAPP_URL =
  "https://wa.me/2348066933942?text=" +
  encodeURIComponent("Hello CeedMart, I need help with my order.")

const RETURNS_URL =
  "https://wa.me/2348066933942?text=" +
  encodeURIComponent(
    "Hello CeedMart, I would like to enquire about a return or exchange."
  )

const Help = () => {
  return (
    <div className="mt-6">
      <Heading className="text-base-semi">Need help?</Heading>
      <div className="text-base-regular my-2">
        <ul className="gap-y-2 flex flex-col">
          <li>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-ui-fg-base underline"
            >
              Contact Us on WhatsApp
            </a>
          </li>
          <li>
            <a
              href={RETURNS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-ui-fg-base underline"
            >
              Returns & Exchanges
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Help

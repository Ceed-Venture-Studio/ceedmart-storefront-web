import { Metadata } from "next"
import LegalPage, {
  ContactBlock,
  H2,
  H3,
  P,
  Table,
  UL,
} from "@modules/legal/templates/legal-page"

// Text follows "Ceedmart Legal Documents" (revision of October 18, 2026)
// verbatim. Change the wording only from a revised source document.
// Section numbering is the document's own; it has no section 3.

export const metadata: Metadata = {
  title: "Refund Policy | CeedMart",
  description:
    "How Ceedmart General Merchandise handles refunds, returns, replacements and cancellations.",
}

export default function Refund() {
  return (
    <LegalPage title="Refund Policy">
      <P>
        This Refund Policy <strong>(“Policy”)</strong> of Ceedmart General
        Merchandise <strong>(“Ceedmart,” “we,” “our,” or “us”),</strong>{" "}
        explains the terms and conditions governing refunds, returns,
        replacements, cancellations, and related matters for products purchased
        through our website, distribution channels, or physical store.
      </P>
      <P>
        This Policy applies to all customers, including wholesalers, retailers,
        distributors, resellers, procurement agents, corporate buyers,
        institutional buyers, and individual customers purchasing electronics,
        grains, foodstuffs, imported products, and related goods from us.
      </P>
      <P>
        By placing an order with us, you acknowledge that you have read,
        understood, and agreed to this Refund Policy.
      </P>

      <H2>1. Nature of Business Operations</H2>
      <P>Ceedmart operates in:</P>
      <UL>
        <li>Wholesale and distribution of electronics and electronic accessories</li>
        <li>Importation and supply of products across Nigeria and Africa</li>
        <li>Wholesale, distribution, and trading of grains and wholefoods</li>
        <li>Supply chain and procurement services</li>
        <li>B2B and B2C transactions</li>
      </UL>
      <P>
        Due to the nature of our products, logistics processes, international
        sourcing operations, food handling standards, and wholesale
        transactions, refunds and returns are subject to strict conditions
        outlined in this Policy.
      </P>

      <H2>2. Refund Conditions &amp; Eligibility</H2>
      <P>
        Refund, replacement and return of products bought from our website will
        only be initiated where;
      </P>
      <UL>
        <li>
          The product substantially differs from the confirmed order
          specifications listed on our website;
        </li>
        <li>The wrong product was supplied by us;</li>
        <li>
          The product delivered is materially damaged before delivery to the
          customer;
        </li>
        <li>The order cannot be fulfilled by us;</li>
        <li>The customer was charged incorrectly;</li>
        <li>A cancellation request qualifies under this Policy.</li>
      </UL>
      <P>
        Refunds are not automatic and remain subject to inspection,
        verification, logistics review, inventory validation, and approval by
        our team.
      </P>

      <H3>Conditions for Returns</H3>
      <P>To qualify for a return, the customer must:</P>
      <UL>
        <li>Provide proof of purchase or invoice;</li>
        <li>Provide delivery confirmation details;</li>
        <li>Return the product in its original condition;</li>
        <li>Ensure the product remains unused where applicable;</li>
        <li>
          Return all accessories, manuals, packaging, seals, and documentation;
        </li>
        <li>Allow inspection and verification by our team.</li>
      </UL>
      <P>
        We reserve the right to reject returned items, products, electronics or
        wholefoods that:
      </P>
      <UL>
        <li>Show signs of use, abuse, alteration, or tampering;</li>
        <li>Are incomplete and damaged due to customer handling;</li>
        <li>Are returned outside the approved return window;</li>
        <li>
          Are exposed to contamination, moisture, pests, or improper handling
          by the customer;
        </li>
        <li>Show software-related issues not caused by hardware defects;</li>
        <li>
          Are damage resulting from power surges, improper installation, liquid
          exposure, accidents, or negligence.
        </li>
      </UL>

      <H3>Custom, Bulk, and Special Orders</H3>
      <P>
        The following are non-refundable once processing or procurement has
        commenced:
      </P>
      <UL>
        <li>Special import orders</li>
        <li>Customized procurement requests</li>
        <li>Bulk sourcing contracts</li>
        <li>Made-to-order goods</li>
        <li>Products sourced specifically at the customer’s request</li>
      </UL>

      <H2>4. Timeline For Refund Request</H2>
      <UL>
        <li>Customers must follow the following notification timelines:</li>
      </UL>
      <Table
        head={["Product Type", "Refund/Return Notification Period"]}
        rows={[
          ["Electronics & Patio Furniture", "Within 48 hours of delivery"],
          ["Grains & Foodstuffs", "Within 24 hours of delivery"],
          ["Damaged Shipment Claims", "Immediately upon delivery"],
          ["Missing Items", "Within 24 hours"],
          ["Wrong Product Delivered", "Within 24 hours"],
        ]}
      />
      <P>
        Failure to report issues within the applicable timeframe may result in
        rejection of the refund or return request.
      </P>
      <UL>
        <li>
          It may take between 7 – 30 working days to process a refund for both
          local and import-related transactions. Please note that these
          timelines may be affected by verification processes, logistics
          procedures and payment processors.
        </li>
      </UL>

      <H2>5. Refund Methods</H2>
      <UL>
        <li>
          Where products are approved for refunds, customers may get monetary
          refunds, product replacement, or a product exchange for an equivalent
          value of the initial product.
        </li>
        <li>
          We reserve the right to determine the most appropriate refund method.
        </li>
        <li>
          Approved returns may attract reasonable restocking or handling fees
          which may be deducted from the refund amount, especially for
          electronics, bulk orders, imported goods, or customized procurement
          requests.
        </li>
      </UL>

      <H3>How to Request a Refund</H3>
      <P>To initiate a refund or return request, customers should provide:</P>
      <UL>
        <li>Full name</li>
        <li>Order number or invoice</li>
        <li>Product details</li>
        <li>Reason for request</li>
        <li>Photos/videos where applicable</li>
        <li>Delivery details</li>
      </UL>
      <P>
        Requests may be submitted via our customer support channels listed
        below.
      </P>

      <H2>6. Delivery and Logistics Issues</H2>
      <UL>
        <li>
          Where delivery fails due to customer-related reasons like incorrect
          address, unavailability of recipient, refusal to receive goods, or
          failure to clear delivery requirements, additional delivery, storage,
          or logistics charges may apply.
        </li>
        <li>
          We are not liable for delays caused by third-party logistics
          providers, customs clearance processes, Government actions, force
          majeure events, or weather conditions. Such delays shall not
          automatically qualify for refunds.
        </li>
      </UL>

      <H2>7. International Orders and Import Transactions</H2>
      <P>For imported goods and cross-border transactions:</P>
      <UL>
        <li>Refunds may depend on supplier/manufacturer approval;</li>
        <li>
          Customs duties, tariffs, shipping charges, and import costs may be
          non-refundable;
        </li>
        <li>Exchange rate fluctuations may affect refund values;</li>
        <li>Certain international orders may be final once procurement begins.</li>
      </UL>
      <P>
        Customers are responsible for compliance with local import laws and
        regulations in their jurisdictions.
      </P>

      <H2>8. Cancellation Policy</H2>
      <UL>
        <li>Customers may cancel orders before processing or shipment begins.</li>
        <li>
          Once procurement, packaging, importation, shipping or delivery has
          commenced, cancellation may not be possible; administrative or
          logistics fees may apply; and partial refunds may be issued at our
          discretion.
        </li>
      </UL>

      <H2>9. Limitation of Liability</H2>
      <P>To the fullest extent permitted by applicable law:</P>
      <UL>
        <li>Our liability shall be limited to the amount paid for the affected product;</li>
        <li>
          We shall not be liable for indirect, incidental, special, or
          consequential damages;
        </li>
        <li>
          We shall not be responsible for business interruption, loss of
          profits, loss of contracts, or supply chain disruptions resulting
          from product issues or delivery delays.
        </li>
      </UL>

      <H2>10. Force Majeure</H2>
      <P>
        We shall not be liable for failure or delay in performing obligations
        caused by events beyond our reasonable control, including:
      </P>
      <UL>
        <li>Natural disasters</li>
        <li>Pandemics</li>
        <li>War</li>
        <li>Civil unrest</li>
        <li>Government restrictions</li>
        <li>Import/export bans</li>
        <li>Labor disputes</li>
        <li>Fuel scarcity</li>
        <li>Transportation disruptions</li>
        <li>Power failures</li>
      </UL>

      <H2>11. Fraud Prevention</H2>
      <P>To prevent fraud and abuse:</P>
      <UL>
        <li>KYC identity verification may be required;</li>
        <li>Refund requests may undergo compliance review;</li>
        <li>Suspicious transactions may be reported to relevant authorities.</li>
      </UL>
      <P>We reserve the right to suspend transactions pending investigation.</P>

      <H2>12. Your Rights</H2>
      <P>
        In accordance with the Federal Competition and Consumer Protection Act
        (FCCPA) 2018, your rights include the following;
      </P>
      <UL>
        <li>
          The right to be informed in plain and understandable language of this
          Refund Policy.
        </li>
        <li>The right to the disclosure of our product’s prices and services.</li>
        <li>
          The right to disclosure of any reconditioned or second hand goods
          displayed on our website.
        </li>
        <li>
          The right to receive an invoice with a detailed record of your
          purchases, unit of items bought, price, amount of any applicable
          taxes, and the total value of your purchases.
        </li>
        <li>
          The right to examine any product of your choice before purchasing the
          same.
        </li>
        <li>
          The right to return damaged or wrong products purchased from our
          website/store. However, this is subject to this refund and shipping
          policy.
        </li>
      </UL>

      <H2>13. Changes to This Policy</H2>
      <UL>
        <li>
          We reserve the right to update, amend, or modify this Refund Policy
          at any time without prior notice.
        </li>
        <li>
          Updated versions shall become effective immediately upon publication
          on our website unless otherwise stated.
        </li>
        <li>
          Notwithstanding, where you continue to use our website after these
          updates, we will construe such usage as an acceptance of our refund
          policy.
        </li>
      </UL>

      <H2>14. Governing Law and Dispute Resolution</H2>
      <P>
        This Policy shall be governed by the laws of the Federal Republic of
        Nigeria
      </P>
      <P>Any disputes arising from this Policy may first be resolved through;</P>
      <UL>
        <li>Good faith negotiations;</li>
        <li>Arbitration or courts with competent jurisdiction, where necessary.</li>
      </UL>

      <H2>15. Contact Information</H2>
      <P>For refund requests, complaints, or support inquiries, contact:</P>
      <ContactBlock />
    </LegalPage>
  )
}

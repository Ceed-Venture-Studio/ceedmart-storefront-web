import { Metadata } from "next"
import LegalPage, {
  ContactBlock,
  H2,
  H3,
  P,
  UL,
} from "@modules/legal/templates/legal-page"

export const metadata: Metadata = {
  title: "Shipping Policy | CeedMart",
  description:
    "Handling, dispatch, transit, and delivery terms for wholefoods/grains, patio furniture, and electronics purchased on CeedMart.",
}

export default function Shipping() {
  return (
    <LegalPage title="Shipping Policy">
      <P>
        This Shipping Policy (&ldquo;Policy&rdquo;) of Ceedmart General
        Merchandise (&ldquo;Ceedmart,&rdquo; &ldquo;we,&rdquo;
        &ldquo;our,&rdquo; or &ldquo;us&rdquo;) governs the handling,
        dispatch, transit, and delivery of all products — specifically
        wholefoods/grains, patio furniture, and electronics — purchased
        within Nigeria via our website, sales agents, or commercial
        procurement channels.
      </P>
      <P>
        This Policy forms a legally binding agreement between Ceedmart and
        the purchaser, whether an individual retail consumer, a corporate
        procurement partner, a wholesaler, or a distributor (collectively
        &ldquo;Customer&rdquo; or &ldquo;Buyer&rdquo;).
      </P>

      <H2>1. Scope of Domestic Operations &amp; Handling</H2>
      <P>Our logistics and distribution framework covers:</P>
      <UL>
        <li>
          <strong>Wholefoods and Grains:</strong> handled as perishable or
          semi-perishable items. These require dry, climate-appropriate
          transit to prevent moisture or pest damage.
        </li>
        <li>
          <strong>Patio Furniture:</strong> categorised as oversized/heavy
          freight. Requires specialised haulage (flatbed or box trucks) and
          coordinated offloading.
        </li>
        <li>
          <strong>Electronics:</strong> categorised as fragile, high-value
          cargo requiring secure packaging, shock-resistant transit, and
          serial number tracking.
        </li>
      </UL>

      <H2>2. Delivery Locations &amp; Regional Restrictions</H2>
      <UL>
        <li>
          We ship to addresses within designated commercial and residential
          zones across Nigeria.
        </li>
        <li>
          We reserve the absolute right to refuse, restrict, or cancel
          deliveries to specific geographic areas or local government areas
          (LGAs) facing severe security challenges, civil unrest, or
          completely inaccessible road infrastructure. In such instances, we
          may coordinate with the Buyer to deliver to the nearest secure
          regional hub or carrier warehouse.
        </li>
      </UL>

      <H2>3. Processing &amp; Dispatch Timelines</H2>
      <P>
        &ldquo;Processing Time&rdquo; refers to the time it takes to verify
        payment, complete quality control checks, package the items, and hand
        them over to our internal logistics team or third-party carriers.
        Processing timelines are separate from transit times.
      </P>
      <div className="overflow-x-auto -mx-1 my-2">
        <table className="min-w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-grey-20 bg-grey-5">
              <th className="text-left font-semibold text-ui-fg-base px-3 py-2">
                Order Type
              </th>
              <th className="text-left font-semibold text-ui-fg-base px-3 py-2">
                Product Category
              </th>
              <th className="text-left font-semibold text-ui-fg-base px-3 py-2">
                Estimated Processing Time
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-grey-10">
              <td className="px-3 py-2">Standard Orders</td>
              <td className="px-3 py-2">Electronics &amp; Small Items</td>
              <td className="px-3 py-2">1–3 Business Days</td>
            </tr>
            <tr className="border-b border-grey-10">
              <td className="px-3 py-2">Oversized Freight</td>
              <td className="px-3 py-2">Patio Furniture</td>
              <td className="px-3 py-2">3–5 Business Days</td>
            </tr>
            <tr>
              <td className="px-3 py-2">Bulk / Tonnage</td>
              <td className="px-3 py-2">Wholefoods &amp; Grains</td>
              <td className="px-3 py-2">5–7 Business Days</td>
            </tr>
          </tbody>
        </table>
      </div>
      <P>
        Processing times may be extended during national public holidays,
        periods of severe fuel scarcity, or internal corporate audits for
        bulk purchases.
      </P>

      <H2>4. Transit Timelines &amp; Estimated Delivery SLAs</H2>
      <P>
        All delivery timelines are non-binding estimates. While we aim to
        deliver promptly, we do not guarantee exact delivery dates due to
        external infrastructural variables (road conditions, traffic
        congestion).
      </P>
      <UL>
        <li>
          <strong>Lagos Metropolitan Area:</strong> 1–3 Business Days.
        </li>
        <li>
          <strong>
            Major Regional Hubs (Abuja, Port Harcourt, Kano, Ibadan, Enugu):
          </strong>{" "}
          3–5 Business Days.
        </li>
        <li>
          <strong>Tier 2 Cities and Remote Locations:</strong> 5–10 Business
          Days.
        </li>
      </UL>

      <H2>5. Shipping Fees, Bulk Freight, &amp; Surcharges</H2>
      <UL>
        <li>
          <strong>Fee Calculation.</strong> Standard delivery fees are
          calculated based on deadweight, volumetric dimensions
          (Length×Width×Height), and the specific delivery zone.
        </li>
        <li>
          <strong>Bulk/Wholesale Logistics.</strong> Shipping fees calculated
          online for bulk/tonnage items (e.g. multiple metric tons of grain
          or commercial quantities of furniture) are provisional. Final
          freight rates will be locked in and issued via a formal Commercial
          Invoice.
        </li>
        <li>
          <strong>Ancillary Surcharges.</strong> The Buyer is responsible for
          any additional costs incurred during delivery, including:
          <UL>
            <li>
              <strong>Offloading Labour:</strong> Buyers must provide labour
              to offload heavy patio furniture or bulk grain bags from the
              delivery vehicle.
            </li>
            <li>
              <strong>Demurrage:</strong> Delays caused by the Buyer holding
              a delivery truck at their offloading site for more than two (2)
              hours will attract a daily delay fee.
            </li>
          </UL>
        </li>
      </UL>

      <H2>6. Transfer of Risk and Delivery Protocol</H2>
      <UL>
        <li>
          <strong>Verification upon Delivery.</strong> For high-value
          electronics and commercial bulk orders, goods will only be released
          to the named Buyer or an explicitly authorised representative. The
          recipient must present a valid government-issued photo ID or an
          official corporate stamp/sign-off.
        </li>
        <li>
          <strong>Transfer of Risk.</strong>
          <UL>
            <li>
              <strong>Company-Managed Delivery:</strong> risk of loss, theft,
              or damage transfers to the Buyer{" "}
              <em>immediately upon physical handover</em> at the designated
              address.
            </li>
            <li>
              <strong>Buyer-Managed / Self-Collection:</strong> if the Buyer
              uses their own preferred transport provider or dispatch rider,
              risk transfers to the Buyer{" "}
              <em>the exact moment the goods leave our warehouse gates</em>.
            </li>
          </UL>
        </li>
      </UL>

      <H2>7. Failed Delivery Attempts &amp; Storage Fees</H2>
      <P>
        If a delivery cannot be completed because the Buyer provided an
        incorrect address, is unreachable, or is absent during the agreed
        delivery window:
      </P>
      <UL>
        <li>
          The carrier will make a maximum of two (2) delivery attempts.
        </li>
        <li>
          If both attempts fail, goods will be returned to our nearest
          regional holding warehouse.
        </li>
        <li>
          The Buyer must pay a <strong>re-delivery fee</strong> before
          another attempt is scheduled.
        </li>
        <li>
          We reserve the right to charge a <strong>daily storage fee</strong>{" "}
          for items left uncollected at our warehouse for more than seven
          (7) calendar days. Perishable wholefoods left uncollected for more
          than fourteen (14) days may be sold or disposed of to recover
          costs, without any refund to the Buyer.
        </li>
      </UL>

      <H2>8. Inspection Standards &amp; Claims Cutoff</H2>
      <P>
        The Buyer must visually inspect all packaging and products before
        signing the Waybill or Delivery Note. Claims submitted outside the
        windows below will not be accepted.
      </P>

      <H3>8.1 Wholefoods and Grains</H3>
      <UL>
        <li>
          <strong>What to look for:</strong> moisture, pest infestation, or
          torn bags.
        </li>
        <li>
          <strong>Claim Window:</strong> must be noted on the Waybill{" "}
          <strong>at the point of delivery</strong> and reported to customer
          care within <strong>24 hours</strong>. We are not liable for
          spoilage or pest issues resulting from improper storage after
          delivery.
        </li>
      </UL>

      <H3>8.2 Patio Furniture</H3>
      <UL>
        <li>
          <strong>What to look for:</strong> structural damage, deep
          scratches, or missing structural parts.
        </li>
        <li>
          <strong>Claim Window:</strong> must be reported within{" "}
          <strong>48 hours</strong> of delivery.
        </li>
      </UL>

      <H3>8.3 Electronics</H3>
      <UL>
        <li>
          <strong>What to look for:</strong> outer box damage, signs of
          impact, or missing box contents.
        </li>
        <li>
          <strong>Claim Window:</strong> must be reported within{" "}
          <strong>48 hours</strong> of delivery. Claims are subject to serial
          number/IMEI verification to ensure the product matches the exact
          unit dispatched.
        </li>
      </UL>

      <H2>9. Limitation of Liability for Transit Delays</H2>
      <P>
        While Ceedmart may engage third-party delivery service providers, we
        are entirely separate from these transport providers and therefore
        not liable for any direct, indirect, or consequential losses
        (including loss of business profits, factory downtime, or
        operational penalties) resulting from transit delays caused by
        carrier operational issues, vehicle breakdowns, or local traffic
        authorities.
      </P>

      <H2>10. Force Majeure</H2>
      <P>
        Ceedmart is exempt from any liability for shipping delays or
        delivery failures caused by events entirely beyond our control. This
        includes acts of God, severe flooding, collapsed road infrastructure,
        fuel scarcities, sudden market trade union actions, labour strikes,
        civil unrest, curfews, or sudden regional regulatory bans on transit
        vehicles.
      </P>

      <H2>11. Amendments &amp; Contact Details</H2>
      <P>
        We reserve the right to modify this Shipping Policy at any time to
        reflect updated local logistics conditions or operational realities.
        Changes take effect immediately upon being published on our website.
      </P>

      <H2>12. Contact</H2>
      <P>
        For delivery updates, bulk haulage coordination, or damage claims,
        please contact us:
      </P>
      <ContactBlock />
    </LegalPage>
  )
}

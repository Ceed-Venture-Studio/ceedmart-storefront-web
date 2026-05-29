import { Metadata } from "next"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import LegalPage, {
  ContactBlock,
  H2,
  P,
  UL,
} from "@modules/legal/templates/legal-page"

export const metadata: Metadata = {
  title: "Terms of Use | CeedMart",
  description:
    "Terms of Use governing your access to the Ceedmart General Merchandise website, products, and services.",
}

export default function Terms() {
  return (
    <LegalPage title="Terms of Use">
      <P>
        These Terms of Use (&ldquo;Terms&rdquo;) apply to your use of Ceedmart
        General Merchandise&rsquo;s (&ldquo;Ceedmart,&rdquo; &ldquo;we,&rdquo;
        &ldquo;us,&rdquo; or &ldquo;our&rdquo;) website, products and services.
        You agree that by accessing the site, you have read, understood, and
        agreed to be bound by all of these Terms. If you do not agree with
        these Terms, then we ask that you not use this site.
      </P>
      <P>
        Our{" "}
        <LocalizedClientLink
          href="/legal/privacy"
          className="text-ceedmart-navy hover:underline"
        >
          Privacy Policy
        </LocalizedClientLink>{" "}
        explains how we collect and use your personal information. Our{" "}
        <LocalizedClientLink
          href="/legal/cookies"
          className="text-ceedmart-navy hover:underline"
        >
          Cookie Policy
        </LocalizedClientLink>{" "}
        explains how we use cookies on our site. Although these do not form
        part of these Terms, they are important documents that you should read.
      </P>

      <H2>Who We Are</H2>
      <P>
        At Ceedmart General Merchandise, our focus is on providing our
        customers with quality products at great prices. These include whole
        foods, electronics, solar systems, patio furniture, and more. We are
        registered in Nigeria, and have our registered office at{" "}
        <strong>
          Opposite Unity Oil and Gas, Chief G.U Ake Road, Eliozu, Port
          Harcourt.
        </strong>
      </P>

      <H2>Website Access</H2>
      <P>
        This site is intended for users who are at least 18 years old. By using
        our site, you represent that:
      </P>
      <UL>
        <li>You are 18 years old and above.</li>
        <li>
          All registration information you submit is true, accurate, and
          complete.
        </li>
        <li>
          You will not access the site through automated or non-human means,
          whether through a bot, script, or otherwise.
        </li>
        <li>You will not use the site for any illegal or unauthorised purpose.</li>
        <li>
          Your use of the site will not violate any applicable law or
          regulation.
        </li>
      </UL>
      <P>
        If you provide information that is untrue, inaccurate, not current, or
        incomplete, we have the right to suspend or terminate your account and
        refuse any current or future use of the site.
      </P>

      <H2>Intellectual Property</H2>
      <UL>
        <li>
          All content, trademarks, logos, and software provided on the
          platform are the Intellectual Property of Ceedmart General
          Merchandise. You may not copy, reproduce, alter, distribute, modify,
          or use any part of it without prior written consent from us.
        </li>
        <li>
          We own or are the licensor of all rights, titles, and interests in
          and to our Intellectual Property, including all rights under patents,
          copyrights, design rights, trade secrets, and other proprietary
          rights. Any unauthorised disassembling, decryption, extraction,
          re-use, re-engineering, reverse engineering, copying, reproduction,
          representation, transmission, or use, in part or in whole, is
          strictly prohibited and may result in legal action.
        </li>
        <li>
          If you believe our content infringes on your copyright, kindly
          contact us and we will take steps to remedy such a breach.
        </li>
      </UL>

      <H2>Website Management</H2>
      <P>Subject to our discretion, we may:</P>
      <UL>
        <li>Monitor the site for violations of these Terms.</li>
        <li>
          Take appropriate legal action against anyone who violates the law or
          these Terms, including reporting users to law enforcement
          authorities.
        </li>
        <li>
          Refuse, restrict, or disable access at our sole discretion.
        </li>
        <li>
          Otherwise manage the website in a manner designed to protect our
          rights and property and facilitate the proper functioning of the
          site.
        </li>
      </UL>

      <H2>Term &amp; Termination</H2>
      <P>
        These Terms shall continue to remain in full effect throughout your
        use of our site and services. The Intellectual Property clause shall
        survive the termination of these Terms and your use of our site.
      </P>
      <P>
        We reserve the right to terminate or suspend your access to all or
        part of the platform with or without notice, including where:
      </P>
      <UL>
        <li>You breached these Terms or any of our policies.</li>
        <li>We must do so to comply with the law.</li>
        <li>
          Your use of our services could cause risk or harm to us, our users,
          or anyone else.
        </li>
      </UL>
      <P>
        If you believe we have restricted your access in error, you can
        contact us at{" "}
        <a
          href="mailto:hello@ceedmart.com"
          className="text-ceedmart-navy hover:underline"
        >
          hello@ceedmart.com
        </a>
        .
      </P>

      <H2>Indemnity</H2>
      <P>
        You agree to defend, indemnify, and hold us harmless, including our
        subsidiaries, affiliates, officers, agents, partners, and employees,
        from any loss, damage, liability, claim, or demand, including
        reasonable legal fees, made by any third party due to or arising out
        of:
      </P>
      <UL>
        <li>Your use of the site.</li>
        <li>Breach of these Terms.</li>
        <li>
          Any breach of your representations and warranties set forth in
          these Terms.
        </li>
      </UL>

      <H2>Pricing &amp; Payment</H2>
      <UL>
        <li>
          <strong>Product Pricing</strong> — prices are displayed alongside
          products on the site. Prices may change to reflect current market
          value. At checkout, the total payable may change due to tax or
          shipping. Always confirm before checkout.
        </li>
        <li>
          <strong>Taxes and Fees</strong> — you are responsible for any
          applicable taxes, levies, or duties. Where we are obligated to
          collect tax, it will be added to your billing amount.
        </li>
        <li>
          <strong>Refund Policy</strong> — our{" "}
          <LocalizedClientLink
            href="/legal/refund"
            className="text-ceedmart-navy hover:underline"
          >
            Refund Policy
          </LocalizedClientLink>{" "}
          explains how we handle refunds.
        </li>
      </UL>

      <H2>Modifications &amp; Amendments</H2>
      <P>
        We reserve the right to make changes or modifications to these Terms
        at any time and for any reason. We will alert you by updating the
        &ldquo;Last updated&rdquo; date. Please check the Terms every time
        you use our site. Continued use of the site after a revision will be
        deemed acceptance of the revised Terms.
      </P>

      <H2>Interruptions</H2>
      <P>
        We cannot guarantee the site will be available at all times. We may
        experience hardware, software, or other problems or need to perform
        maintenance, resulting in interruptions, delays, or errors. We reserve
        the right to change, revise, update, suspend, discontinue, or
        otherwise modify the site at any time without notice. We have no
        liability for loss, damage, or inconvenience caused by your inability
        to access the site during downtime or discontinuance.
      </P>

      <H2>Dispute Resolution</H2>
      <P>
        <strong>Informal Resolution.</strong> Before initiating any formal
        legal proceedings, you and the Company agree to first attempt to
        resolve any dispute through good-faith informal negotiations.
        Negotiations will begin upon written notice and must continue for at
        least thirty (30) days before either party may initiate arbitration or
        court proceedings.
      </P>
      <P>
        <strong>Arbitration or Court Proceedings.</strong> If unresolved, the
        dispute shall be resolved through binding arbitration or court
        proceedings in Nigeria under the rules of the Lagos Court of
        Arbitration, in English. Where arbitration does not prove effective
        after ninety (90) days, both parties shall have recourse to a court of
        competent jurisdiction in Nigeria.
      </P>

      <H2>Limitation of Liability</H2>
      <UL>
        <li>
          To the extent permitted by law, Ceedmart shall not assume or bear
          liability for conditions, warranties, representations, or other
          terms which may otherwise apply to our services or any content on
          them, whether express or implied.
        </li>
        <li>
          We assume no responsibility for the content of websites linked to
          our services and are not liable for any loss or damage that may
          arise from your use of them.
        </li>
        <li>
          You agree to indemnify and hold us and our affiliates harmless from
          any demands, loss, liability, claims, or expenses (including
          attorneys&rsquo; fees) made against us by any third party due to or
          arising from your use or misuse of our services.
        </li>
      </UL>

      <H2>Governing Law</H2>
      <P>
        These Terms and any dispute or claim arising out of, or in connection
        with them, will be governed by and construed in accordance with the
        laws of the Federal Republic of Nigeria, without regard to its
        conflict of laws principles.
      </P>

      <H2>Contact Us</H2>
      <ContactBlock />
    </LegalPage>
  )
}

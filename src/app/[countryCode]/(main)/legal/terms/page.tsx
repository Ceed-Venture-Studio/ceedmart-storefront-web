import { Metadata } from "next"
import LegalPage, {
  H2,
  H3,
  Mail,
  P,
  PolicyLink,
  UL,
} from "@modules/legal/templates/legal-page"

// Text follows "Ceedmart Legal Documents" (revision of October 18, 2026)
// verbatim. Change the wording only from a revised source document.

export const metadata: Metadata = {
  title: "Terms of Use | CeedMart",
  description:
    "The terms that govern your use of the Ceedmart General Merchandise website, products and services.",
}

export default function Terms() {
  return (
    <LegalPage title="Terms of Use">
      <P>
        These Terms of Use (“Terms,”) apply to your use of Ceedmart General
        Merchandise’s (“Ceedmart,” “we,” “us,” or “our”) website, products
        &amp; services. You agree that by accessing the Site, you have read,
        understood, and agreed to be bound by all of these Terms of Use. If you
        do not agree with these Terms, then we ask that you not use this site.
      </P>
      <P>
        Our <PolicyLink href="/legal/privacy">Privacy Policy</PolicyLink>{" "}
        explains how we collect and use your personal information.
      </P>
      <P>
        Our <PolicyLink href="/legal/cookies">Cookie Policy</PolicyLink>{" "}
        explains how we use cookies on our site to improve our services to
        you. Although these do not form part of these Terms, they are important
        documents that you should read.
      </P>

      <H2>Who we are</H2>
      <P>
        At Ceedmart General Merchandise, our focus is on providing our
        customers with quality products at great prices. These include whole
        foods, electronics, solar systems, patio furniture amongst others. We
        are registered in Nigeria, and have our registered office at{" "}
        <strong>
          Opposite Unity Oil and Gas, Chief G.U Ake road, Eliozu road, Port
          Harcourt.
        </strong>
      </P>

      <H2>Website Access</H2>
      <P>
        This Site is intended for users who are at least 18 years old, and
        beyond. By using our Site, you represent that;
      </P>
      <UL>
        <li>You are 18 years old and above,</li>
        <li>
          All registration information you submit are true, accurate, and
          complete,
        </li>
        <li>
          You will not access the Site through automated or non-human means,
          whether through a bot, script, or otherwise,
        </li>
        <li>You will not use the Site for any illegal or unauthorized purpose,</li>
        <li>
          Your use of the Site will not violate any applicable law or
          regulation.
        </li>
        <li>
          If you provide any information that is untrue, inaccurate, not
          current, or incomplete, we have the right to suspend or terminate your
          account and refuse any and all current or future use of the Site (or
          any portion thereof).
        </li>
      </UL>

      <H2>Intellectual Property</H2>
      <UL>
        <li>
          All content, trademarks, logos, and software provided on the platform
          are the Intellectual Properties of Ceedmart General Merchandise. These
          rights are protected under applicable copyright laws and all such
          rights are reserved. You may not copy, reproduce, alter, distribute,
          modify, or use any part of it without prior written consent or a
          license to do so, from us.
        </li>
        <li>
          We own, and/or are the licensor of all rights, titles, interests in
          and to our Intellectual Properties, including all rights under
          patents, copyrights, design rights, trade secrets, and any and all
          other proprietary rights. Any disassembling, decryption, extraction,
          re-use, re-engineering, reverse engineering, copying or more
          generally any act of reproduction, representation, transmission, or
          use of any of these elements, in part or in whole, without the
          authorization of the company is strictly prohibited and may result in
          legal action.
        </li>
        <li>
          If you believe the content of our Platform may have infringed on your
          copyright in any manner, kindly contact us and we will immediately
          take steps to stop or remedy such a breach, after a thorough analysis
          and/or third party intervention.
        </li>
      </UL>

      <H2>Website Management</H2>
      <P>Subject to our discretion, we may;</P>
      <UL>
        <li>Monitor the Site for violations of these Terms of Use,</li>
        <li>
          Take appropriate legal action against anyone who, in our sole
          discretion, violates the law or these Terms of Use, including without
          limitation, reporting such user to law enforcement authorities;
        </li>
        <li>
          In our sole discretion and without limitation, refuse, restrict
          access to, limit the availability of, or disable (to the extent
          technologically feasible) any of your access.
        </li>
        <li>
          Otherwise manage the website in a manner designed to protect our
          rights and property and to facilitate the proper functioning of the
          website.
        </li>
      </UL>

      <H2>Term &amp; Termination</H2>
      <P>
        These terms shall continue to remain in full effect throughout your use
        of our site and services. The intellectual property clause shall
        however survive the termination of this Terms of use and your use of
        our site.
      </P>
      <P>
        We reserve the right to terminate or suspend your access to all or part
        of the Platform and the Services with or without notice and for any
        reason, including but not limited to the determination that;
      </P>
      <UL>
        <li>You breached these Terms or any of our policies.</li>
        <li>We must do so to comply with the law.</li>
        <li>
          Your use of our Services could cause risk or harm us, our users, or
          anyone else.
        </li>
      </UL>
      <P>
        If you believe we have restricted your access to our website in error,
        you can contact us at <Mail />
      </P>

      <H2>Indemnity</H2>
      <P>
        You agree to defend, indemnify, and hold us harmless, including our
        subsidiaries, affiliates, and all of our respective officers, agents,
        partners, and employees, from and against any loss, damage, liability,
        claim, or demand, including reasonable attorneys’ fees and expenses,
        made by any third party due to or arising out of:
      </P>
      <UL>
        <li>Your use of the Site,</li>
        <li>Breach of these Terms of Use,</li>
        <li>
          Any breach of your representations and warranties set forth in these
          Terms of Use
        </li>
      </UL>
      <P>
        Notwithstanding the foregoing, we reserve the right, at your expense,
        to assume the exclusive defense and control of any matter for which you
        are required to indemnify us, and you agree to cooperate, at your
        expense, with our defense of such claims. We will use reasonable
        efforts to notify you of any such claim, action, or proceeding which is
        subject to this indemnification upon becoming aware of it.
      </P>

      <H2>Pricing &amp; Payment</H2>
      <UL>
        <li>
          <strong>Product Pricing</strong>
          <br />
          Prices for each product are displayed alongside the products on our
          websites. However, bear in mind that these prices can change overtime
          to reflect their current market value. Where a product’s price has
          been adjusted, the current price will be displayed on the site. At
          checkout, the total amount payable for a product may change as a
          result of tax charges or shipping cost. Always ensure that you
          confirm before checkout.
        </li>
        <li>
          <strong>Taxes and Fees</strong>
          <br />
          You are responsible for any applicable taxes, levies, or duties
          imposed by taxing authorities. If we are obligated to collect or pay
          taxes for your use of the Services, those taxes will be added to your
          billing amount.
        </li>
        <li>
          <strong>Refund Policy</strong>
          <br />
          Our <PolicyLink href="/legal/refund">Refund Policy</PolicyLink>{" "}
          explains how we handle refunds of products on the website.
        </li>
      </UL>

      <H2>Modifications &amp; Amendments</H2>
      <P>
        Supplemental terms and conditions or documents that may be posted on
        the Site from time to time are hereby expressly incorporated herein by
        reference. We reserve the right, in our sole discretion, to make
        changes or modifications to these Terms of Use at any time and for any
        reason. We will alert you about any changes by updating the “Last
        updated” date of these Terms of Use, and you waive any right to receive
        specific notice of each such change. Please ensure that you check the
        applicable Terms every time you use our Site so that you understand
        which Terms apply. You will be subject to, and will be deemed to have
        been made aware of and to have accepted, the changes in any revised
        Terms of Use by your continued use of the Site after the date such
        revised Terms of Use are posted.
      </P>

      <H2>Interruptions</H2>
      <P>
        We cannot guarantee the Site will be available at all times. We may
        experience hardware, software, or other problems or need to perform
        maintenance related to the Site, resulting in interruptions, delays, or
        errors. We reserve the right to change, revise, update, suspend,
        discontinue, or otherwise modify the Site at any time or for any reason
        without notice to you. You agree that we have no liability whatsoever
        for any loss, damage, or inconvenience caused by your inability to
        access or use the Site during any downtime or discontinuance of the
        Site. Nothing in these Terms of Use will be construed to obligate us to
        maintain and support the Site or to supply any corrections, updates, or
        releases in connection therewith.
      </P>

      <H2>Dispute Resolution</H2>
      <H3>Informal Resolution</H3>
      <P>
        Before initiating any formal legal proceedings, you and the Company
        agree to first attempt to resolve any dispute, controversy, or claim
        (“Dispute”) related to these Terms or your use of our Services through
        good-faith informal negotiations. These negotiations will begin upon
        written notice from one party to the other and must continue for at
        least thirty (30) days before either party may initiate arbitration or
        court proceedings.
      </P>
      <H3>Arbitration or Court Proceedings</H3>
      <P>
        If the Parties are unable to resolve the Dispute informally, the
        Dispute shall be resolved through{" "}
        <strong>binding arbitration or court proceedings</strong> in Nigeria,
        and the Dispute shall be submitted to arbitration under the rules of
        the Lagos Court of Arbitration, and the language shall be English.
      </P>
      <P>
        Where Arbitration doesn’t prove to be effective after ninety (90) days,
        both parties shall have recourse to a court of competent jurisdiction
        in Nigeria.
      </P>

      <H2>Limitation of Liability</H2>
      <UL>
        <li>
          To the extent permitted by law, Ceedmart General Merchandise shall not
          assume nor bear the liability for conditions, warranties,
          representations, or other terms which may otherwise apply to our
          Services or any content on it, whether express or implied.
        </li>
        <li>
          We assume no responsibility for the content of websites linked to our
          Services. Such links should not be interpreted as an endorsement of
          any of those linked websites by us. We shall not be liable for any
          loss or damage that may arise from your use of them.
        </li>
        <li>
          You agree to indemnify and hold us and our affiliated parties harmless
          from any demands, loss, liability, claims, or expenses (including
          attorneys’ fees), made against us by any third party due to or
          arising out of, or in connection with your use and/or misuse of our
          application and Services.
        </li>
      </UL>

      <H2>Governing Law</H2>
      <P>
        This “T &amp; C” and any dispute or claim arising out of, or in
        connection with them will be governed by and construed in accordance
        with the laws of the Federal Republic of Nigeria, without regard to its
        conflict of laws principles.
      </P>

      <H2>Contact Us</H2>
      <P>If you have any questions or concerns, please contact us at:</P>
      <address className="not-italic text-sm small:text-base leading-relaxed">
        <p>
          <strong>Email:</strong> <Mail />
        </p>
        <p>
          <strong>Address:</strong> Opposite Unity Oil and Gas, Chief G.U Ake
          road, Eliozu road, Port Harcourt.
        </p>
      </address>
    </LegalPage>
  )
}

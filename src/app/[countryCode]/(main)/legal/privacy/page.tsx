import { Metadata } from "next"
import LegalPage, {
  ContactBlock,
  H2,
  P,
  UL,
} from "@modules/legal/templates/legal-page"

export const metadata: Metadata = {
  title: "Privacy Policy | CeedMart",
  description:
    "How Ceedmart General Merchandise collects, uses, stores and protects your personal information.",
}

export default function Privacy() {
  return (
    <LegalPage title="Privacy Policy">
      <P>
        Ceedmart General Merchandise (&ldquo;Ceedmart,&rdquo; &ldquo;we,&rdquo;
        &ldquo;our,&rdquo; or &ldquo;us&rdquo;) respects your privacy and is
        committed to keeping whatever information we receive from you secure.
        This Privacy Policy describes how and why we might collect, store, use,
        and/or share (&ldquo;process&rdquo;) your information when you use our
        website. We strongly advise that you read and understand this policy
        before accessing our website and our products.
      </P>

      <H2>1. Information We Collect</H2>
      <P>
        &ldquo;Personal Information&rdquo; refers to information whether
        processed alone, or in connection with other information, could be
        associated with an individual. The Personal Information we collect
        varies depending on our relationship and interactions with you.
      </P>
      <P>1.1 We collect the following personal information from you:</P>
      <UL>
        <li>
          Information that you voluntarily provide to us when you register on
          our platform.
        </li>
        <li>
          Information shared with us when you express an interest in knowing
          about us or our products and services.
        </li>
        <li>Information you share with us when you use our services.</li>
        <li>Any information you share with us when you contact us.</li>
        <li>
          Any other information that will enable us to provide our services
          effectively to you.
        </li>
      </UL>
      <P>
        The personal information that we collect depends on the context of your
        interactions with us, and may include your email address, name,
        location, etc.
      </P>

      <H2>2. How We Process Your Information</H2>
      <P>We may process or use Personal Data for the following purposes:</P>
      <UL>
        <li>
          <strong>Account creation and authentication</strong> — we process
          your information so you can create and log in to your account, and
          keep your account in working order.
        </li>
        <li>
          <strong>Respond to user inquiries / offer support</strong> — to
          respond to inquiries and solve any potential issues with the
          requested service.
        </li>
        <li>
          <strong>Request feedback</strong> — when necessary to request
          feedback and contact you about your use of our services.
        </li>
        <li>
          <strong>Marketing and promotional communications</strong> — in
          accordance with your marketing preferences. You may opt out at any
          time.
        </li>
        <li>
          <strong>Protect our services</strong> — including fraud monitoring
          and prevention.
        </li>
        <li>
          <strong>Identify usage trends</strong> — to better understand how
          our services are used so we can improve them.
        </li>
      </UL>

      <H2>3. Legal Basis For Processing Your Information</H2>
      <P>
        In compliance with the Nigeria Data Protection Act (NDPA), the legal
        bases on which we rely include:
      </P>
      <UL>
        <li>
          <strong>Consent</strong> — you may withdraw your consent at any time
          by contacting us at{" "}
          <a
            href="mailto:hello@ceedmart.com"
            className="text-ceedmart-navy hover:underline"
          >
            hello@ceedmart.com
          </a>
          .
        </li>
        <li>
          <strong>Performance of a Contract</strong> — to fulfil our
          contractual obligations to you.
        </li>
        <li>
          <strong>Legitimate Interests</strong> — to send special offers,
          analyse usage, diagnose problems, and improve user experience.
        </li>
        <li>
          <strong>Legal Obligations</strong> — to comply with law enforcement
          or regulatory requests, defend our legal rights, or as evidence in
          litigation.
        </li>
        <li>
          <strong>Vital Interests</strong> — to protect your vital interests
          or the vital interests of a third party.
        </li>
      </UL>

      <H2>4. Disclosure Of Personal Information</H2>
      <P>We may share your data in the following circumstances:</P>
      <UL>
        <li>
          With third-party vendors, service providers, contractors, or agents
          who perform services for us and require access to such information.
        </li>
        <li>
          For business-related purposes such as negotiations, mergers, sale of
          company assets, financing, or acquisition of all or a portion of our
          business.
        </li>
        <li>
          With our affiliates, which we require to honour this Privacy Policy.
        </li>
        <li>
          With any person or entity that requires access to conduct an audit,
          review, or assessment of our business, services, or personnel.
        </li>
        <li>
          With any regulatory authority, law enforcement agency, or court
          where required by law.
        </li>
      </UL>

      <H2>5. Information Retention</H2>
      <UL>
        <li>
          We retain your information for as long as necessary to provide our
          services, or for other essential purposes such as complying with
          legal obligations, resolving disputes, and enforcing our policies.
        </li>
        <li>
          When we have no ongoing legitimate business need to process your
          personal information, we delete or anonymise it, or where this is
          not possible, securely store and isolate it from further processing
          until deletion is possible.
        </li>
      </UL>

      <H2>6. Your Rights</H2>
      <P>
        Depending on your country of residence, you may have certain statutory
        rights, including the right to:
      </P>
      <UL>
        <li>
          Access your personal information and supplementary information that
          this Privacy Policy describes.
        </li>
        <li>
          Be informed about the lawful basis for which we are processing your
          information.
        </li>
        <li>
          Be informed about the recipients or any category of those who will
          receive your personal information.
        </li>
        <li>Be informed of the retention period of your personal data.</li>
        <li>
          Lodge a complaint with your local data protection
          authority/commission.
        </li>
        <li>Correct any mistakes in your information.</li>
        <li>Object to decisions being taken by automated means.</li>
        <li>
          Object in certain situations to our continued processing of your
          personal information.
        </li>
        <li>Transfer your Personal Data to a third party (data portability).</li>
      </UL>

      <H2>7. Data Security</H2>
      <P>
        We have implemented appropriate and reasonable technical and
        organisational security measures designed to protect the security of
        any personal information we process. However, despite our commitments
        and efforts, we do not guarantee a 100% safeguard from breach. Please
        only access our services within a secure environment.
      </P>

      <H2>8. Personal Data From Minors</H2>
      <P>
        We do not knowingly solicit data from, or market to, children under 18
        years of age. By using our services, you represent that you are at
        least 18, or that you are the parent/guardian of such a minor and
        consent to their use of our services. If we learn that personal
        information from users less than 18 years of age has been collected,
        we will deactivate the account and take reasonable measures to promptly
        delete that data. If you become aware of any data we may have collected
        from children under 18, please contact us at{" "}
        <a
          href="mailto:hello@ceedmart.com"
          className="text-ceedmart-navy hover:underline"
        >
          hello@ceedmart.com
        </a>
        .
      </P>

      <H2>9. Limitation of Liability</H2>
      <UL>
        <li>
          We comply with relevant laws governing your personal data. We will
          not be liable for any actions, violations, or infringements caused
          by third-party technologies, platforms, partners, or businesses,
          who retain your information without your consent or in violation of
          this Privacy Policy, after we have shared it for the purpose of
          providing our services.
        </li>
        <li>
          Save to the extent stipulated by law, we shall not bear any
          liability for loss, violations, or infringements of your rights or
          information arising from your misuse of our platform and services.
        </li>
      </UL>

      <H2>10. Changes To This Privacy Policy</H2>
      <P>
        We reserve the right to update this Privacy Policy from time to time.
        The updated version will be indicated by an updated &ldquo;Revised&rdquo;
        date and will be effective as soon as it is accessible. We may notify
        you of material changes by prominently posting a notice on any of our
        platforms or directly. Continued use of our website after these updates
        will be construed as acceptance of the updated policy.
      </P>

      <H2>11. Contact Us</H2>
      <P>
        If you have questions or comments regarding this Privacy Policy, please
        email us at{" "}
        <a
          href="mailto:hello@ceedmart.com"
          className="text-ceedmart-navy hover:underline"
        >
          hello@ceedmart.com
        </a>
        .
      </P>
      <ContactBlock />
    </LegalPage>
  )
}

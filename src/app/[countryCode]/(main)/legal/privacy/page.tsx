import { Metadata } from "next"
import LegalPage, {
  H2,
  Mail,
  OL,
  P,
  UL,
} from "@modules/legal/templates/legal-page"

// The approved legal text (October 18, 2026 revision). Change the wording
// only from a revised source document.

export const metadata: Metadata = {
  title: "Privacy Policy | CeedMart",
  description:
    "How Ceedmart General Merchandise collects, uses, stores and protects your personal information.",
}

export default function Privacy() {
  return (
    <LegalPage title="Privacy Policy">
      <P>
        Ceedmart General merchandise (“Ceedmart,” “We,” “Our,” or “Us”)
        respects your privacy and is committed to keeping whatever information
        we receive from you secure. This Privacy Policy describes how and why
        we might collect, store, use, and/or share (“process”) your
        information when you use our website. We strongly advise that you read
        and understand this policy before accessing our website and our
        products.
      </P>

      <H2>1. Information We Collect</H2>
      <P>
        “Personal Information” refers to information whether processed alone,
        or in connection with other information, could be associated with an
        individual. The Personal Information we collect varies depending on
        our relationship and interactions with you.
      </P>
      <P>1.1 We collect the following personal information from you;</P>
      <UL>
        <li>
          Information that you voluntarily provide to us when you register on
          our platform
        </li>
        <li>
          Information shared with us when you express an interest in knowing
          about us or our products and services,
        </li>
        <li>Information you share with us when you use our services,</li>
        <li>Any information you share with us when you contact us, or</li>
        <li>
          Any other information that will enable us to provide our services
          effectively to you.
        </li>
      </UL>
      <P>
        The personal information that we collect depends on the context of
        your interactions with us, and may include your email addresses,
        names, locations, etc.
      </P>

      <H2>2. How We Process Your Information</H2>
      <P>We may process or use Personal Data for the following purposes;</P>
      <UL>
        <li>
          To facilitate account creation and authentication and otherwise
          manage user accounts — We may process your information so you can
          create and log in to your account, as well as keep your account in
          working order.
        </li>
        <li>
          To respond to user inquiries/offer support to users — We may process
          your information to respond to your inquiries and solve any
          potential issues you might have with the requested service.
        </li>
        <li>
          To request feedback — We may process your information when necessary
          to request feedback and to contact you about your use of our
          Services.
        </li>
        <li>
          To send you marketing and promotional communications — We may
          process the personal information you send to us for our marketing
          purposes, if this is in accordance with your marketing preferences.
          You reserve the right to opt out of our marketing emails at any
          time.
        </li>
        <li>
          To protect our Services — We may process your information as part of
          our efforts to keep our Services safe and secure, including fraud
          monitoring and prevention.
        </li>
        <li>
          To identify usage trends. — We may process information about how you
          use our Services to better understand how they are being used so we
          can improve them.
        </li>
      </UL>

      <H2>3. Legal Basis For Processing Your Information</H2>
      <P>
        In compliance with the provisions of the Nigeria Data Protection Act
        (NDPA), the legal basis on which we rely on to process your personal
        information include the following;
      </P>
      <UL>
        <li>
          Consent — We may process your information with your consent. You
          reserve the right to withdraw your consent at any time, by contacting
          us at <Mail />
        </li>
        <li>
          Performance of a Contract — We may process your personal information
          when we believe it is necessary to fulfill our contractual
          obligations to you, including providing our Services or at your
          request prior to entering into a contract with you.
        </li>
        <li>
          Legitimate Interests — We may process your information when we
          believe it is reasonably necessary to achieve our legitimate business
          interests, without overriding on your interests and fundamental
          rights &amp; freedoms. For example, we may process your personal
          information for some of the purposes described in order to:
          <OL>
            <li>
              Send users information about special offers and discounts on our
              products and services
            </li>
            <li>
              Analyze how our Services are used so we can improve them to
              engage and retain users
            </li>
            <li>Diagnose problems and/or prevent fraudulent activities</li>
            <li>
              Understand how our users use our products and website so we can
              improve user experience
            </li>
          </OL>
        </li>
        <li>
          Legal Obligations. We may process your information where we believe
          it is necessary for compliance with our legal obligations, such as to
          cooperate with a law enforcement body or regulatory agency, exercise
          or defend our legal rights, or disclose your information as evidence
          in litigation in which we are involved.
        </li>
        <li>
          Vital Interests. We may process your information where we believe it
          is necessary to protect your vital interests or the vital interests
          of a third party, such as situations involving potential threats to
          the safety of any person.
        </li>
      </UL>

      <H2>4. Disclosure Of Personal Information</H2>
      <P>We may share your data in the following circumstances;</P>
      <UL>
        <li>
          With third-party vendors, service providers, contractors, or agents
          (“third parties”) who perform services for us or on our behalf and
          require access to such information to do that work.
        </li>
        <li>
          For business related purposes like during negotiations, mergers,
          sale of company assets, financing, or acquisition of all or a portion
          of our business to another company, and vice versa.
        </li>
        <li>
          With our affiliates, in which case we will require those affiliates
          to honor this privacy notice. Affiliates include any subsidiaries,
          joint venture partners, or other companies that we control or that
          are under common control with us.
        </li>
        <li>
          To any person or entity that requires access to your personal
          information to conduct an audit, review, or assessment of the
          quality, effectiveness, and performance of Ceedmart’s business,
          services, or personnel.
        </li>
        <li>
          To any regulatory authority, law enforcement agency, or court in the
          jurisdiction, to the extent we are required to do so by law or order,
          or if we have a good faith belief that the disclosure is necessary to
          prevent or respond to fraud, criminal acts, or violations of
          Ceedmart’s privacy policy or other policies.
        </li>
      </UL>

      <H2>5. Information Retention</H2>
      <UL>
        <li>
          We may retain your information for as long as is necessary to
          provide our services to you, or for other essential purposes such as
          complying with our legal obligations, resolving disputes, and
          enforcing our policies. We may retain your information for a
          reasonable period after you deactivate your account or stop using our
          services.
        </li>
        <li>
          When we have no ongoing legitimate business need to process your
          personal information, we may either delete or anonymize such
          information, or, if this is not possible (for example, because your
          personal information has been stored in backup archives), then we
          will securely store your personal information and isolate it from any
          further processing until deletion is possible.
        </li>
      </UL>

      <H2>6. Your Rights</H2>
      <P>
        Depending on your country of residence, you may have certain statutory
        rights in relation to your Personal Information as a data subject. For
        example, you may have the right to:
      </P>
      <UL>
        <li>
          Have access to your personal information and to certain other
          supplementary information that this Privacy policy has clearly spelt
          out.
        </li>
        <li>
          Be informed about the lawful basis for which we are processing your
          information.
        </li>
        <li>
          Be informed about the recipients or any category of those who will
          receive your personal information.
        </li>
        <li>
          Be informed of the retention period of your personal data as covered
          in this privacy policy.
        </li>
        <li>
          Lodge a complaint with your local data protection
          authority/commission.
        </li>
        <li>
          Correct, and/or require us to correct any mistakes in your
          information which you shared with us.
        </li>
        <li>Object to decisions being taken by automated means on our platform.</li>
        <li>
          Object in certain other situations, to our continued processing of
          your personal information.
        </li>
        <li>
          Transfer your Personal Data to a third party (right to data
          portability).
        </li>
      </UL>

      <H2>7. Data Security</H2>
      <P>
        We have implemented appropriate and reasonable technical and
        organizational security measures designed to protect the security of
        any personal information we process. However, despite our commitments
        and efforts to secure your data, we do not guarantee a 100% safeguard
        from breach. We strongly advise that you should only access our
        Services within a secure environment.
      </P>

      <H2>8. Personal Data From Minors</H2>
      <P>
        We do not knowingly solicit data from, or market to children under 13
        years of age. By using the Services, you represent that you are at
        least 13 years of age and, if you are under 18, that your parent or
        guardian consents to your use of our services. If we learn that
        personal information from users less than 13 years of age has been
        collected, we will deactivate the account and take reasonable measures
        to promptly delete such data from our records. If you become aware of
        any data we may have collected from children under age 13, please
        contact us at <Mail />
      </P>

      <H2>9. Limitation of Liability</H2>
      <UL>
        <li>
          Ceedmart General merchandise shall comply with the provisions of the
          relevant laws and regulations which govern the handling of your
          personal data and the information you share with us. However, we will
          not be liable for any actions, violations, or infringements of your
          right which may be caused by third party technologies, platforms,
          partners, or businesses, who retain your information for promotional,
          marketing, or whatever purposes without your consent, or in violation
          this privacy policy, after we have shared your personal information
          with them for the purpose of providing our services to you.
        </li>
        <li>
          Save to the extent stipulated by law, we shall not bear any liability
          for any loss, violations or infringements of your rights or
          information arising from your misuse of our platform and services.
        </li>
      </UL>

      <H2>10. Changes To This Privacy Policy</H2>
      <P>
        We reserve the right to update this Privacy Policy from time to time.
        The updated version will be indicated by an updated “Revised” date and
        the updated version will be effective as soon as it is accessible. If
        we make material changes to this privacy notice, we may notify you
        either by prominently posting a notice of such changes on any of our
        social media platforms, website, apps, or by directly sending you a
        notification. We encourage you to review this privacy notice
        frequently to be informed of how we are protecting your information.
      </P>
      <P>
        Notwithstanding, where you continue to use our website after these
        updates, we will construe such usage as an acceptance of our privacy
        policy.
      </P>

      <H2>11. Contact Us</H2>
      <P>
        If you have questions or comments regarding this privacy policy, you
        may email us at <Mail />
      </P>
    </LegalPage>
  )
}

import { Metadata } from "next"
import LegalPage, {
  ContactBlock,
  H2,
  H3,
  P,
  UL,
} from "@modules/legal/templates/legal-page"

export const metadata: Metadata = {
  title: "Cookie Policy | CeedMart",
  description:
    "How Ceedmart General Merchandise uses cookies and similar technologies on its website.",
}

export default function Cookies() {
  return (
    <LegalPage title="Cookie Policy">
      <P>
        This Cookie Policy explains how Ceedmart General Merchandise
        (&ldquo;Ceedmart,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or
        &ldquo;our&rdquo;) uses cookies and similar technologies when you
        visit our website. By continuing to use our services, you agree to
        the use of cookies as described in this policy.
      </P>

      <H2>About Us</H2>
      <P>
        At Ceedmart General Merchandise, our focus is on providing our
        customers with quality products at great prices. These include whole
        foods, electronics, solar systems, patio furniture, and more.
      </P>

      <H2>What Are Cookies?</H2>
      <P>
        Cookies are small text files stored on your device (computer, tablet,
        or phone) when you visit our website. They help our website remember
        things about you — such as:
      </P>
      <UL>
        <li>
          Your <strong>login status</strong>, so you don&rsquo;t have to sign
          in every time.
        </li>
        <li>
          Your <strong>preferences</strong>, like language or region.
        </li>
        <li>
          Pages you&rsquo;ve visited or items you&rsquo;ve clicked, which
          helps the site improve your experience.
        </li>
        <li>
          How you use the site, which helps us analyse traffic and improve
          our services.
        </li>
      </UL>
      <P>
        Cookies also help us improve functionality, collect information about
        your interaction with the site for analytics and advertising
        purposes, and build a profile of our users. Some of this data is
        aggregated or statistical, which means we will not be able to identify
        you individually.
      </P>

      <H2>Types of Cookies We Use</H2>
      <H3>Strictly Necessary Cookies</H3>
      <P>
        Essential for the operation of our services. Without them, some parts
        of our site may not function properly. These cookies do not collect
        personal information for marketing or tracking. We use them to:
      </P>
      <UL>
        <li>Maintain session info, so you stay logged in across pages.</li>
        <li>Remember privacy or cookie settings you&rsquo;ve chosen.</li>
        <li>Enable navigation and access to protected areas of the site.</li>
      </UL>

      <H3>Performance and Analytics Cookies</H3>
      <P>
        These cookies collect information about how you use our website (such
        as which pages you visit most often). They do not collect personally
        identifiable information. All information collected is aggregated and
        anonymous, and is only used to improve how our website works.
      </P>

      <H3>Functionality Cookies</H3>
      <P>
        These cookies allow our website to remember the choices you make
        (such as your user name, language, last action, search preferences,
        or region) and to provide more enhanced and personalised features.
        The information collected is anonymous and cannot track your browsing
        activity on other websites.
      </P>

      <H3>Targeting and Advertising Cookies</H3>
      <P>
        We may use these cookies to deliver relevant ads and measure the
        effectiveness of our marketing campaigns. They may be set through our
        site by third-party advertising partners.
      </P>

      <H2>Third-Party Cookies</H2>
      <P>
        In addition to the cookies we place directly on your device, our
        services may allow third-party service providers to set their own
        cookies when you interact with our platform. These are called{" "}
        <strong>third-party cookies</strong>.
      </P>

      <H3>Who Sets Third-Party Cookies and Why?</H3>
      <P>
        Third-party cookies are placed by companies or organisations other
        than Ceedmart General Merchandise. We partner with these third
        parties to help us provide certain features or improve the
        functionality of our services. Common examples include:
      </P>
      <UL>
        <li>
          Analytics providers — to measure how users interact with our
          services, identify usage trends, and improve user experience.
        </li>
        <li>
          Advertising and marketing partners — to deliver personalised ads,
          track ad performance, and show relevant content across the
          internet.
        </li>
        <li>
          Social media platforms — that may use cookies to enable content
          sharing and for their own data collection purposes.
        </li>
        <li>
          Payment processors or customer support tools that embed
          functionality such as secure transactions or live chat support.
        </li>
      </UL>
      <P>These third parties may collect information such as:</P>
      <UL>
        <li>Your IP address.</li>
        <li>Browser type and device information.</li>
        <li>Pages viewed and time spent on the site.</li>
        <li>Interaction data (clicks, scrolls, and preferences).</li>
        <li>Referral URLs (the site you came from).</li>
      </UL>

      <H3>How Third-Party Cookies Are Used</H3>
      <P>Third-party cookies can be used to:</P>
      <UL>
        <li>
          Provide services like fraud prevention, secure logins, and content
          delivery.
        </li>
        <li>
          Understand your behaviour on our platform and other sites you visit.
        </li>
        <li>
          Build a profile of your interests to show you relevant ads
          elsewhere online.
        </li>
        <li>
          Deliver cross-platform experiences (e.g. continuing your session
          across devices).
        </li>
      </UL>

      <H3>Your Choices Regarding Third-Party Cookies</H3>
      <P>
        We do not control the cookies that third parties set. Their use of
        cookies is governed by their own privacy and cookie policies, which
        we encourage you to read. You can usually manage or disable
        third-party cookies by:
      </P>
      <UL>
        <li>Changing your browser settings to block or delete cookies.</li>
        <li>
          Using cookie consent tools or banners we provide to opt out of
          certain categories.
        </li>
        <li>Visiting the third parties&rsquo; opt-out pages.</li>
      </UL>
      <P>
        Please note that disabling third-party cookies may affect your
        experience on our services and limit some features.
      </P>

      <H3>Transparency and Compliance</H3>
      <P>
        We select third-party partners carefully and aim to work with vendors
        who adhere to strong privacy and data protection standards. We aim to
        maintain transparency and accountability in how data is processed —
        whether by us or on our behalf.
      </P>

      <H2>Managing Cookies</H2>
      <P>
        Where required by law, we will provide a cookie banner allowing you
        to accept or reject non-essential cookies. While we do not respond to
        &ldquo;Do Not Track&rdquo; signals at this time, you can manage ad
        preferences in your device settings.
      </P>
      <P>
        If you do not want to accept cookies, you can change your browser
        settings so that cookies are not accepted. If you do this, please be
        aware that you may lose some of the functionality of this website.
      </P>

      <H2>Children&rsquo;s Data</H2>
      <P>
        Our services are not directed to children under the age of 13, or
        under the local age of digital consent where applicable. We do not
        knowingly collect, store, or use personal information from children
        via cookies, tracking technologies, or other data collection methods.
        Our platforms are designed for adults and businesses, and we do not
        target or promote our services to children.
      </P>
      <P>
        If we become aware that we have inadvertently collected personal data
        from a child without the appropriate consent (such as verifiable
        parental or guardian consent when required), we will:
      </P>
      <UL>
        <li>Promptly delete such data from our systems.</li>
        <li>Restrict further access to any associated accounts.</li>
        <li>Notify the relevant guardian or authority if legally required.</li>
      </UL>
      <P>
        We encourage parents and guardians to actively monitor their
        children&rsquo;s online activities. If you believe your child has
        provided us with personal information without your consent, please
        contact us at{" "}
        <a
          href="mailto:hello@ceedmart.com"
          className="text-ceedmart-navy hover:underline"
        >
          hello@ceedmart.com
        </a>{" "}
        and we will take appropriate actions in accordance with applicable
        laws.
      </P>

      <H2>Updates to This Cookie Policy</H2>
      <P>
        We may update this policy from time to time to reflect changes in
        technology, law, or our business operations. We will notify you of
        any material changes by posting the updated policy and updating the{" "}
        <strong>&ldquo;Effective Date&rdquo;</strong> at the top.
      </P>

      <H2>Contact Us</H2>
      <P>
        If you have questions about this Cookie Policy or how we use cookies,
        please contact us:
      </P>
      <ContactBlock />
    </LegalPage>
  )
}

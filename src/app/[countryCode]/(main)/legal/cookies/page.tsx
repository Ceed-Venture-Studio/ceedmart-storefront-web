import { Metadata } from "next"
import LegalPage, {
  ContactBlock,
  H2,
  H3,
  Mail,
  P,
  UL,
} from "@modules/legal/templates/legal-page"

// Text follows "Ceedmart Legal Documents" (revision of October 18, 2026)
// verbatim. Change the wording only from a revised source document.

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
        (“Ceedmart,” “we,” “us,” or “our”) uses cookies and similar
        technologies when you visit our website.
      </P>
      <P>
        By continuing to use our Services, you agree to the use of cookies as
        described in this policy.
      </P>

      <H2>About Us</H2>
      <P>
        At Ceedmart General Merchandise, our focus is on providing our
        customers with quality products at great prices. These include whole
        foods, electronics, solar systems, patio furniture amongst others.
      </P>

      <H2>What Are Cookies?</H2>
      <P>
        Cookies are small text files stored on your device (computer, tablet,
        or phones, etc) when you visit our website. They help our website
        remember things about you—such as:
      </P>
      <UL>
        <li>
          Your <strong>login status,</strong> so you don’t have to sign in
          every time
        </li>
        <li>
          Your <strong>preferences</strong>, like language or region
        </li>
        <li>
          Pages you’ve visited or items you’ve clicked, which helps the site
          improve your experience
        </li>
        <li>
          How you use the site, which helps the company analyze traffic and
          improve their services
        </li>
      </UL>
      <P>
        Cookies also help us improve functionality, collect information about
        your interaction with the site for analytics and advertising purposes,
        and build a profile of our users. Some of this data will be aggregated
        or statistical, which means that we will not be able to identify you
        individually.
      </P>

      <H2>Types of Cookies We Use</H2>
      <P>We use the following types of cookies:</P>

      <H3>Strictly Necessary Cookies</H3>
      <P>
        These cookies are essential for the operation of our Services. Without
        them, some parts of our site may not function properly. These cookies
        do not collect your personal information for marketing or tracking,
        but are only used to make the website or service function properly.
        Enable secure login and account authentication. We use strictly
        necessary cookies to;
      </P>
      <UL>
        <li>Maintain session info, so you stay logged in as you move between pages</li>
        <li>Remember privacy or cookie settings you’ve chosen</li>
        <li>Enable navigation and access to protected areas of the site</li>
      </UL>

      <H3>Performance and Analytics Cookies</H3>
      <P>
        These cookies collect information about how you use our website, for
        instance, which pages you go to most often. These cookies do not
        collect personally identifiable information about you. All information
        collected by these cookies is aggregated and anonymous, and is only
        used to improve how our website works, measure site traffic, and
        improve user experience.
      </P>

      <H3>Functionality Cookies</H3>
      <P>
        These cookies allow our website to remember the choices you make (such
        as your user name, language, last action and search preferences, or
        region,) and to provide more enhanced and personalized features for
        you. The information collected by these cookies is anonymous and cannot
        track your browsing activity on other websites
      </P>

      <H3>Targeting and Advertising Cookies</H3>
      <P>
        We may use these cookies to deliver relevant ads to you and to measure
        the effectiveness of our marketing campaigns. These cookies may be set
        through our site by third-party advertising partners.
      </P>

      <H2>Third-Party Cookies</H2>
      <P>
        In addition to the cookies we place directly on your device, our
        Services may allow third-party service providers to set their own
        cookies when you interact with our platform. These are called{" "}
        <strong>third-party cookies</strong>.
      </P>

      <H3>Who Sets Third-Party Cookies and Why?</H3>
      <P>
        Third-party cookies are placed by companies or organizations other than
        Ceedmart General Merchandise. We partner with these third parties to
        help us provide certain features or improve the functionality of our
        Services. Common examples include:
      </P>
      <UL>
        <li>
          Analytics providers- to measure how users interact with our services,
          identify usage trends, and improve user experience.
        </li>
        <li>
          Advertising and marketing partners - to deliver personalized ads,
          track ad performance, and show relevant content to users across the
          internet.
        </li>
        <li>
          Social media platforms - that may use cookies to enable content
          sharing and for their own data collection purposes.
        </li>
        <li>
          Payment processors or customer support tools that embed functionality
          such as secure transactions or live chat support.
        </li>
      </UL>
      <P>These third parties may collect information such as:</P>
      <UL>
        <li>Your IP address</li>
        <li>Browser type and device information</li>
        <li>Pages viewed and time spent on the site</li>
        <li>Interaction data (clicks, scrolls, and preferences)</li>
        <li>Referral URLs (the site you came from)</li>
      </UL>

      <H3>How Third-Party Cookies Are Used</H3>
      <P>Third-party cookies can be used to:</P>
      <UL>
        <li>
          Provide services like fraud prevention, secure logins, and content
          delivery
        </li>
        <li>Understand your behavior on our platform and other sites you visit</li>
        <li>Build a profile of your interests to show you relevant ads elsewhere online</li>
        <li>
          Deliver cross-platform experiences (e.g., continuing your session
          across devices)
        </li>
      </UL>

      <H3>Your Choices Regarding Third-Party Cookies</H3>
      <P>
        We do not control the cookies that third parties set. Their use of
        cookies is governed by their own privacy and cookie policies, which we
        encourage you to read. You can usually manage or disable third-party
        cookies by:
      </P>
      <UL>
        <li>Changing your browser settings to block or delete cookies</li>
        <li>
          Using cookie consent tools or banners we provide to opt out of
          certain categories of cookies
        </li>
        <li>Visiting the third parties’ opt-out pages</li>
      </UL>
      <P>
        Please note that disabling third-party cookies may affect your
        experience on our Services and limit some features.
      </P>

      <H3>Transparency and Compliance</H3>
      <P>
        We select third-party partners carefully and aim to work with vendors
        who adhere to strong privacy and data protection standards. We aim to
        maintain transparency and accountability in how data is
        processed—whether by us or on our behalf.
      </P>

      <H2>Managing Cookies</H2>
      <P>
        Where required by law, we will provide a cookie banner or pop-up
        allowing you to accept or reject non-essential cookies. While we do not
        respond to “Do Not Track” signals at this time, you can manage ad
        preferences on your device settings.
      </P>
      <P>
        If you do not want to accept cookies, you can change your browser
        settings so that cookies are not accepted. If you do this, please be
        aware that you may lose some of the functionality of this website.
      </P>

      <H2>Children’s Data</H2>
      <P>
        Our Services are not directed to children under the age of 13, or under
        the local age of digital consent, where applicable. This includes any
        jurisdictions where the age of consent may be higher. We do not
        knowingly collect, store, or use personal information from children via
        cookies, tracking technologies, or other data collection methods. Our
        platforms are designed for adults and businesses, and we do not target
        or promote our services to children.
      </P>
      <P>
        If we become aware that we have inadvertently collected personal data
        from a child without the appropriate consent (such as verifiable
        parental or guardian consent when required), we will:
      </P>
      <UL>
        <li>Promptly delete such data from our systems</li>
        <li>Restrict further access to any associated accounts</li>
        <li>Notify the relevant guardian or authority if legally required</li>
      </UL>
      <P>
        We encourage parents and guardians to actively monitor their
        children’s online activities. If you believe your child has provided us
        with personal information without your consent, please contact us at{" "}
        <Mail />, and we will take appropriate actions in accordance with
        applicable laws.
      </P>

      <H2>Updates to This Cookie Policy</H2>
      <P>
        We may update this policy from time to time to reflect changes in
        technology, law, or our business operations. We will notify you of any
        material changes by posting the updated policy and updating the{" "}
        <strong>“Effective Date”</strong> at the top.
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

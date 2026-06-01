import { Metadata } from "next"
import Link from "next/link"
import { listOpenRequisitions } from "@lib/data/requisitions"

export const metadata: Metadata = {
  title: "Careers | CeedMart",
  description:
    "Build the future of commerce, distribution and energy access in Nigeria. Join the team at Ceedmart General Merchandise — quality products at great prices.",
}

const CAREERS_EMAIL = "hello@ceedmart.com"
const WHATSAPP_URL =
  "https://wa.me/2347087502195?text=" +
  encodeURIComponent(
    "Hello CeedMart, I'd like to enquire about open roles on the team."
  )

const MAILTO = `mailto:${CAREERS_EMAIL}?subject=${encodeURIComponent(
  "Careers — Application"
)}&body=${encodeURIComponent(
  "Hello CeedMart,\n\nI'd like to be considered for a role at Ceedmart.\n\n- Name:\n- Role you're interested in:\n- Years of experience:\n- LinkedIn / portfolio:\n\nMy CV is attached.\n\nThank you."
)}`

type IconProps = { className?: string }

const BuildIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
    <path
      d="M6 26h20M9 22V14l7-7 7 7v8M14 22v-5h4v5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const TargetIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
    <circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth="2" />
    <circle cx="16" cy="16" r="5" stroke="currentColor" strokeWidth="2" />
    <circle cx="16" cy="16" r="1.5" fill="currentColor" />
  </svg>
)

const GrowthIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
    <path
      d="M5 26h22M8 22V14m6 8V10m6 12v-6m6 6V6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
)

const HeartIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
    <path
      d="M16 27s-9-6-9-13a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 7-9 13-9 13z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
)

const TrophyIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
    <path
      d="M10 6h12v6a6 6 0 0 1-12 0V6zM7 8H5a3 3 0 0 0 5 3M25 8h2a3 3 0 0 1-5 3M12 22h8M14 22v4h4v-4M11 26h10"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const ShieldIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
    <path
      d="M16 4l11 4v9c0 6-5 10-11 12-6-2-11-6-11-12V8l11-4z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M11 16l4 4 6-7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const StarIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
    <path
      d="M16 3l3.8 8.8 9.7 1-7.4 6.4 2.2 9.5L16 23.5 7.7 28.7l2.2-9.5L2.5 12.8l9.7-1L16 3z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
)

const FlagIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
    <path
      d="M7 28V4M7 6h17l-3 6 3 6H7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const BulbIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
    <path
      d="M16 3a9 9 0 0 0-5 16.5V23h10v-3.5A9 9 0 0 0 16 3zM13 26h6M14 29h4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const TeamIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
    <circle cx="11" cy="11" r="4" stroke="currentColor" strokeWidth="2" />
    <circle cx="21" cy="11" r="4" stroke="currentColor" strokeWidth="2" />
    <path
      d="M4 26c0-4 3-7 7-7s7 3 7 7M14 26c0-4 3-7 7-7s7 3 7 7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
)

const ArrowRight = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.4}
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
    />
  </svg>
)

const WhatsAppIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

type Card = {
  title: string
  body: string
  Icon: React.ComponentType<IconProps>
}

const WHY_JOIN: Card[] = [
  {
    title: "Build Something Meaningful",
    body: "You won’t be maintaining an existing system. You’ll be helping build a fast-growing company from the ground up.",
    Icon: BuildIcon,
  },
  {
    title: "Own Outcomes",
    body: "We value people who take responsibility, make decisions, and drive measurable results.",
    Icon: TargetIcon,
  },
  {
    title: "Grow With The Business",
    body: "As Ceedmart grows, our team members grow with us through increased responsibility, leadership opportunities, and career advancement.",
    Icon: GrowthIcon,
  },
  {
    title: "Impact Customers Directly",
    body: "Every role contributes directly to improving how individuals and businesses buy products, access power solutions, and receive reliable service.",
    Icon: HeartIcon,
  },
  {
    title: "Performance-Driven Culture",
    body: "We reward execution, accountability, teamwork, innovation, and customer obsession.",
    Icon: TrophyIcon,
  },
]

const CORE_VALUES: Card[] = [
  {
    title: "Customer First",
    body: "Every decision starts with the customer.",
    Icon: HeartIcon,
  },
  {
    title: "Ownership",
    body: "We take responsibility for outcomes and results.",
    Icon: FlagIcon,
  },
  {
    title: "Excellence",
    body: "Good enough is not good enough.",
    Icon: StarIcon,
  },
  {
    title: "Integrity",
    body: "We build trust through honesty, transparency, and reliability.",
    Icon: ShieldIcon,
  },
  {
    title: "Innovation",
    body: "We continuously improve how we operate and serve customers.",
    Icon: BulbIcon,
  },
  {
    title: "Teamwork",
    body: "We win together.",
    Icon: TeamIcon,
  },
]

const TEAMS = [
  "Operations",
  "Sales",
  "Marketing",
  "Customer Service",
  "Procurement",
  "Logistics",
  "Technology",
  "Business Development",
]

type CareersProps = {
  params: Promise<{ countryCode: string }>
}

export default async function Careers({ params }: CareersProps) {
  const { countryCode } = await params
  const requisitions = await listOpenRequisitions()

  return (
    <div className="flex flex-col bg-white">
      {/* Hero */}
      <section className="relative w-full bg-gradient-to-br from-ceedmart-navy via-ceedmart-navy-light to-ceedmart-blue overflow-hidden px-6 py-16 small:py-24">
        <div
          className="absolute -top-32 -right-32 w-96 h-96 bg-ceedmart-gold/15 rounded-full blur-3xl pointer-events-none"
          aria-hidden
        />
        <div
          className="absolute -bottom-40 -left-32 w-96 h-96 bg-ceedmart-blue/25 rounded-full blur-3xl pointer-events-none"
          aria-hidden
        />

        <div className="relative content-container max-w-5xl mx-auto text-center flex flex-col items-center gap-5 small:gap-7">
          <span className="inline-block px-4 py-1.5 rounded-full bg-ceedmart-gold/20 text-ceedmart-gold text-xs font-bold uppercase tracking-widest border border-ceedmart-gold/30">
            Careers at Ceedmart
          </span>
          <h1 className="text-white text-3xl small:text-5xl medium:text-6xl font-extrabold leading-[1.08] drop-shadow-md max-w-4xl">
            Build the Future of{" "}
            <span className="text-ceedmart-gold">Commerce</span>,{" "}
            <span className="text-ceedmart-gold">Distribution</span> &{" "}
            <span className="text-ceedmart-gold">Energy Access</span> in Nigeria
          </h1>
          <p className="text-white/90 text-base small:text-lg max-w-2xl leading-relaxed">
            At Ceedmart, we are building more than a store. We are creating a
            trusted distribution and commerce network that helps homes,
            businesses, installers, contractors, retailers, and project owners
            access quality products at competitive prices.
          </p>
          <div className="flex flex-col xsmall:flex-row gap-3 mt-2">
            <a
              href={requisitions.length > 0 ? "#open-roles" : MAILTO}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-ceedmart-gold text-ceedmart-navy font-semibold text-sm small:text-base hover:brightness-95 transition-colors shadow-md"
            >
              {requisitions.length > 0
                ? `View ${requisitions.length} open role${
                    requisitions.length === 1 ? "" : "s"
                  }`
                : "Apply now"}{" "}
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/10 text-white border border-white/40 font-semibold text-sm small:text-base hover:bg-white/15 transition-colors"
            >
              <WhatsAppIcon className="w-5 h-5" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Mission band */}
      <section className="bg-white py-12 small:py-16 px-6 border-b border-grey-10">
        <div className="content-container max-w-4xl mx-auto text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-ceedmart-navy/70 mb-3">
            Our mission
          </p>
          <p className="text-2xl small:text-3xl medium:text-4xl font-bold text-ceedmart-navy leading-snug">
            Make quality products more accessible, affordable, and reliable
            across Nigeria.
          </p>
          <p className="mt-5 text-sm small:text-base text-grey-60 max-w-2xl mx-auto">
            From solar power systems and renewable energy solutions to
            electronics, security systems, household essentials, and business
            supplies — we&rsquo;re expanding fast in Port Harcourt and beyond,
            and we&rsquo;re looking for ambitious people who want to build,
            lead, solve problems, and create impact.
          </p>
        </div>
      </section>

      {/* Why Join Ceedmart */}
      <section className="bg-grey-5 py-16 small:py-24 px-6">
        <div className="content-container max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10 small:mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-ceedmart-navy mb-2">
              Why Ceedmart
            </p>
            <h2 className="text-3xl small:text-4xl font-extrabold text-ui-fg-base">
              Why join Ceedmart?
            </h2>
          </div>
          <div className="grid grid-cols-1 small:grid-cols-2 medium:grid-cols-3 gap-4 small:gap-6">
            {WHY_JOIN.map((c) => (
              <article
                key={c.title}
                className="flex flex-col bg-white rounded-rounded border border-grey-10 p-6 small:p-7 hover:shadow-lg hover:border-ceedmart-navy/20 transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-ceedmart-navy/10 text-ceedmart-navy flex items-center justify-center mb-4">
                  <c.Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-ui-fg-base mb-2">
                  {c.title}
                </h3>
                <p className="text-sm small:text-base text-grey-60 leading-relaxed">
                  {c.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Our Core Values */}
      <section className="bg-white py-16 small:py-24 px-6">
        <div className="content-container max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10 small:mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-ceedmart-navy mb-2">
              How we operate
            </p>
            <h2 className="text-3xl small:text-4xl font-extrabold text-ui-fg-base">
              Our core values
            </h2>
            <p className="mt-3 text-sm small:text-base text-grey-60">
              The principles we use to make decisions, hire, and serve our
              customers every day.
            </p>
          </div>
          <div className="grid grid-cols-1 small:grid-cols-2 medium:grid-cols-3 gap-3 small:gap-4">
            {CORE_VALUES.map((c, i) => {
              const accent = i % 3
              const accentBg =
                accent === 0
                  ? "bg-ceedmart-navy text-white"
                  : accent === 1
                    ? "bg-ceedmart-gold text-ceedmart-navy"
                    : "bg-ceedmart-blue text-white"
              return (
                <article
                  key={c.title}
                  className="flex items-start gap-4 bg-white rounded-rounded border border-grey-10 p-5 small:p-6 hover:shadow-md transition-shadow"
                >
                  <div
                    className={`shrink-0 w-12 h-12 rounded-rounded flex items-center justify-center ${accentBg}`}
                  >
                    <c.Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-ui-fg-base mb-1">
                      {c.title}
                    </h3>
                    <p className="text-sm text-grey-60 leading-relaxed">
                      {c.body}
                    </p>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* Working at Ceedmart */}
      <section className="bg-ceedmart-navy py-16 small:py-24 px-6 relative overflow-hidden">
        <div
          className="absolute -top-24 -right-24 w-96 h-96 bg-ceedmart-blue/20 rounded-full blur-3xl pointer-events-none"
          aria-hidden
        />
        <div className="relative content-container max-w-5xl mx-auto">
          <div className="grid grid-cols-1 medium:grid-cols-[1.1fr_1fr] gap-10 small:gap-14 items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-ceedmart-gold mb-2">
                Working at Ceedmart
              </p>
              <h2 className="text-3xl small:text-4xl font-extrabold text-white leading-tight">
                Clear goals.
                <br />
                Measurable results.
              </h2>
              <p className="mt-5 text-base small:text-lg text-white/85 leading-relaxed">
                Most roles at Ceedmart are tied to clear business objectives
                and measurable performance targets. We believe every team
                member should understand what success looks like and the
                impact they create for customers.
              </p>
            </div>

            <ul className="flex flex-col gap-3">
              {[
                "What success looks like",
                "How performance is measured",
                "How their work contributes to company growth",
                "The impact they create for customers",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-rounded p-4"
                >
                  <span className="shrink-0 w-6 h-6 rounded-full bg-ceedmart-gold text-ceedmart-navy flex items-center justify-center text-xs font-bold">
                    ✓
                  </span>
                  <span className="text-white text-sm small:text-base font-medium">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-12 pt-10 border-t border-white/10">
            <p className="text-sm font-semibold uppercase tracking-widest text-white/60 mb-4">
              Teams we&rsquo;re building
            </p>
            <div className="flex flex-wrap gap-2">
              {TEAMS.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm font-medium"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Open Roles — only renders when at least one requisition is open */}
      {requisitions.length > 0 && (
        <section
          id="open-roles"
          className="bg-white py-16 small:py-24 px-6 border-t border-grey-10"
        >
          <div className="content-container max-w-5xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-10 small:mb-14">
              <p className="text-xs font-bold uppercase tracking-widest text-ceedmart-navy mb-2">
                Open roles
              </p>
              <h2 className="text-3xl small:text-4xl font-extrabold text-ui-fg-base">
                Positions we&rsquo;re hiring for
              </h2>
              <p className="mt-3 text-sm small:text-base text-grey-60">
                See a role that fits? Click apply to send us your details. We
                read every application.
              </p>
            </div>

            <ul className="flex flex-col gap-4 small:gap-5">
              {requisitions.map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/${countryCode}/careers/${r.id}`}
                    className="group flex flex-col xsmall:flex-row xsmall:items-center xsmall:justify-between gap-3 xsmall:gap-6 bg-white border border-grey-10 rounded-rounded p-6 small:p-7 hover:shadow-lg hover:border-ceedmart-navy/20 transition-all"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg small:text-xl font-bold text-ceedmart-navy group-hover:text-ceedmart-blue transition-colors">
                        {r.title}
                      </h3>
                      {r.salary && (
                        <p className="mt-1 text-sm text-grey-60">{r.salary}</p>
                      )}
                    </div>
                    <span className="shrink-0 inline-flex items-center gap-2 text-sm font-semibold text-ceedmart-navy group-hover:text-ceedmart-blue transition-colors">
                      View role
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-gradient-to-br from-ceedmart-gold via-yellow-400 to-amber-500 py-16 small:py-20 px-6">
        <div className="content-container max-w-3xl mx-auto text-center">
          <h2 className="text-3xl small:text-4xl font-extrabold text-ceedmart-navy leading-tight">
            Ready to build with us?
          </h2>
          <p className="mt-3 text-ceedmart-navy/85 text-base small:text-lg">
            Send your CV and a short note about the kind of role you&rsquo;d
            like to play. We read every application.
          </p>
          <div className="mt-7 flex flex-col xsmall:flex-row gap-3 justify-center items-center">
            <a
              href={MAILTO}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-ceedmart-navy text-white font-semibold text-sm small:text-base hover:bg-ceedmart-navy-light transition-colors shadow-md"
            >
              Email {CAREERS_EMAIL}
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white text-ceedmart-navy border border-ceedmart-navy/20 font-semibold text-sm small:text-base hover:bg-grey-5 transition-colors"
            >
              <WhatsAppIcon className="w-5 h-5 text-[#25D366]" />
              Reach out on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

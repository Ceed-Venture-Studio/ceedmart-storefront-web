import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getRequisition } from "@lib/data/requisitions"

type Props = {
  params: Promise<{ countryCode: string; id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const requisition = await getRequisition(id)
  if (!requisition) {
    return { title: "Role not found | Ceedmart Careers" }
  }
  return {
    title: `${requisition.title} | Ceedmart Careers`,
    description: requisition.salary
      ? `${requisition.title} — ${requisition.salary}. Apply now at Ceedmart.`
      : `${requisition.title} role at Ceedmart. Apply now.`,
  }
}

const ArrowLeft = ({ className }: { className?: string }) => (
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
      d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
    />
  </svg>
)

const ArrowRight = ({ className }: { className?: string }) => (
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

export default async function RequisitionDetailPage({ params }: Props) {
  const { countryCode, id } = await params
  const requisition = await getRequisition(id)

  if (!requisition) {
    notFound()
  }

  return (
    <div className="flex flex-col bg-white">
      {/* Hero */}
      <section className="relative w-full bg-gradient-to-br from-ceedmart-navy via-ceedmart-navy-light to-ceedmart-blue overflow-hidden px-6 py-14 small:py-20">
        <div
          className="absolute -top-32 -right-32 w-96 h-96 bg-ceedmart-gold/15 rounded-full blur-3xl pointer-events-none"
          aria-hidden
        />
        <div
          className="absolute -bottom-40 -left-32 w-96 h-96 bg-ceedmart-blue/25 rounded-full blur-3xl pointer-events-none"
          aria-hidden
        />

        <div className="relative content-container max-w-4xl mx-auto flex flex-col gap-5 small:gap-6">
          <Link
            href={`/${countryCode}/careers#open-roles`}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            All open roles
          </Link>

          <span className="inline-block px-4 py-1.5 rounded-full bg-ceedmart-gold/20 text-ceedmart-gold text-xs font-bold uppercase tracking-widest border border-ceedmart-gold/30 w-fit">
            Open role
          </span>

          <h1 className="text-white text-3xl small:text-4xl medium:text-5xl font-extrabold leading-tight drop-shadow-md">
            {requisition.title}
          </h1>

          {requisition.salary && (
            <p className="text-white/90 text-base small:text-lg font-medium">
              {requisition.salary}
            </p>
          )}

          <div className="flex flex-col xsmall:flex-row gap-3 mt-2">
            <a
              href={requisition.apply_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-ceedmart-gold text-ceedmart-navy font-semibold text-sm small:text-base hover:brightness-95 transition-colors shadow-md"
            >
              Apply now <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="bg-white py-12 small:py-16 px-6">
        <div className="content-container max-w-3xl mx-auto">
          {requisition.description ? (
            <div
              className="prose prose-sm max-w-none text-grey-70 leading-snug prose-headings:text-ceedmart-navy prose-headings:font-bold prose-headings:mt-5 prose-headings:mb-2 prose-h2:text-lg prose-h3:text-base prose-p:my-2 prose-a:text-ceedmart-blue prose-strong:text-ceedmart-navy prose-ul:my-2 prose-ol:my-2 prose-li:my-0 prose-li:leading-snug prose-li:marker:text-ceedmart-navy/60"
              // Authored by admins through the requisitions editor — trusted source.
              dangerouslySetInnerHTML={{ __html: requisition.description }}
            />
          ) : (
            <p className="text-grey-60 italic">
              No description provided. Click apply to send us your details.
            </p>
          )}
        </div>
      </section>

      {/* Apply CTA */}
      <section className="bg-gradient-to-br from-ceedmart-gold via-yellow-400 to-amber-500 py-14 small:py-20 px-6">
        <div className="content-container max-w-3xl mx-auto text-center">
          <h2 className="text-2xl small:text-3xl font-extrabold text-ceedmart-navy leading-tight">
            Ready to apply?
          </h2>
          <p className="mt-3 text-ceedmart-navy/85 text-base">
            Send your application through the link below. We read every one.
          </p>
          <div className="mt-6 flex flex-col xsmall:flex-row gap-3 justify-center">
            <a
              href={requisition.apply_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-ceedmart-navy text-white font-semibold text-sm small:text-base hover:bg-ceedmart-navy-light transition-colors shadow-md"
            >
              Apply for {requisition.title}
              <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              href={`/${countryCode}/careers#open-roles`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white text-ceedmart-navy border border-ceedmart-navy/20 font-semibold text-sm small:text-base hover:bg-grey-5 transition-colors"
            >
              See other roles
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

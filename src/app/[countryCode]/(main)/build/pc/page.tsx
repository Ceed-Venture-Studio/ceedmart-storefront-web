import { redirect } from "next/navigation"

type Props = {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ type?: string }>
}

// /build/pc used to be a second destination alongside /build. They are one
// feature with two modes (BRD §7.1), so this redirects rather than 404s —
// the URL has been linked from the nav and may sit in someone's history.
export default async function BuildPcRedirect(props: Props) {
  const { countryCode } = await props.params
  const { type } = await props.searchParams
  redirect(`/${countryCode}/build${type ? `?type=${type}` : ""}`)
}

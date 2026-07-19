import { redirect } from "next/navigation"

// The /store/tech route was retired when the home page split Solar and
// CCTV into two cards. Solar is the closest match to the old combined
// page so we send old links there; anyone landing here can still get to
// CCTV & Access Control via the home page or a direct link.
type Params = {
  params: Promise<{ countryCode: string }>
}

export default async function TechRedirect({ params }: Params) {
  const { countryCode } = await params
  redirect(`/${countryCode}/store/solar-energy-power`)
}

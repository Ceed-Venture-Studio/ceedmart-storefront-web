import { Metadata } from "next"
import ResetPassword from "@modules/account/components/reset-password"

export const metadata: Metadata = {
  title: "Set a new password",
  description: "Choose a new password for your Ceedmart account.",
}

// Outside the account layout on purpose: this page is reached by someone who
// cannot sign in, so it must not sit behind anything that expects a session.
export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams

  return (
    <div className="flex justify-center py-12 px-8">
      <ResetPassword token={token ?? ""} />
    </div>
  )
}

"use client"

import { resetPassword } from "@lib/data/customer"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Text } from "@medusajs/ui"
import { useActionState } from "react"

const ResetPassword = ({ token }: { token: string }) => {
  const [state, formAction, isPending] = useActionState(resetPassword, null)

  // Say so before they type two passwords and lose them to a dead link.
  if (!token) {
    return (
      <div className="max-w-sm w-full flex flex-col gap-4" data-testid="reset-password-page">
        <h1 className="text-large-semi uppercase">Link not valid</h1>
        <Text className="txt-medium text-ui-fg-subtle">
          This page needs the link from your reset email. Open that link
          directly, or request a new one.
        </Text>
        <LocalizedClientLink href="/account" className="underline w-fit">
          Back to sign in
        </LocalizedClientLink>
      </div>
    )
  }

  if (state?.ok) {
    return (
      <div className="max-w-sm w-full flex flex-col gap-4" data-testid="reset-password-page">
        <h1 className="text-large-semi uppercase">Password updated</h1>
        <Text className="txt-medium text-ui-fg-subtle" data-testid="reset-success-message">
          {state.message}
        </Text>
        <LocalizedClientLink
          href="/account"
          className="underline w-fit"
          data-testid="reset-sign-in-link"
        >
          Sign in
        </LocalizedClientLink>
      </div>
    )
  }

  return (
    <div className="max-w-sm w-full flex flex-col items-center" data-testid="reset-password-page">
      <h1 className="text-large-semi uppercase mb-6">Set a new password</h1>
      <form className="w-full" action={formAction}>
        {/* The token authenticates the change — Medusa reads the account
            from it — so there is no email field to get wrong or to point
            somewhere else. */}
        <input type="hidden" name="token" value={token} />
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label="New password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            data-testid="new-password-input"
          />
          <Input
            label="Confirm new password"
            name="confirm_password"
            type="password"
            autoComplete="new-password"
            required
            data-testid="confirm-password-input"
          />
        </div>
        <ErrorMessage
          error={state?.ok === false ? state.message : null}
          data-testid="reset-password-error"
        />
        <SubmitButton
          className="w-full mt-6"
          isLoading={isPending}
          pendingText="Saving…"
          data-testid="save-password-button"
        >
          Save new password
        </SubmitButton>
      </form>
    </div>
  )
}

export default ResetPassword

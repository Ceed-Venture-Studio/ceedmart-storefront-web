"use client"

import { requestPasswordReset } from "@lib/data/customer"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import { Text } from "@medusajs/ui"
import { useActionState } from "react"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const ForgotPassword = ({ setCurrentView }: Props) => {
  const [state, formAction, isPending] = useActionState(
    requestPasswordReset,
    null
  )

  return (
    <div
      className="max-w-sm w-full flex flex-col items-center"
      data-testid="forgot-password-page"
    >
      <h1 className="text-large-semi uppercase mb-6">Reset your password</h1>
      <p className="text-center text-base-regular text-ui-fg-base mb-8">
        Tell us the email you signed up with and we&apos;ll send a link to set
        a new password.
      </p>

      {/* The confirmation replaces the form rather than sitting under it.
          Leaving the form up invites a second submission from someone who is
          not sure whether the first one worked. */}
      {state?.ok ? (
        <div className="w-full flex flex-col gap-4">
          <Text
            className="txt-medium text-ui-fg-base"
            data-testid="reset-requested-message"
          >
            {state.message}
          </Text>
          <button
            onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
            className="underline text-ui-fg-base w-fit"
            data-testid="back-to-sign-in"
          >
            Back to sign in
          </button>
        </div>
      ) : (
        <form className="w-full" action={formAction}>
          <div className="flex flex-col w-full gap-y-2">
            <Input
              label="Email"
              name="email"
              type="email"
              title="Enter a valid email address."
              autoComplete="email"
              required
              data-testid="forgot-email-input"
            />
          </div>
          <ErrorMessage
            error={state?.ok === false ? state.message : null}
            data-testid="forgot-password-error"
          />
          <SubmitButton
            className="w-full mt-6"
            isLoading={isPending}
            pendingText="Sending…"
            data-testid="send-reset-button"
          >
            Send reset link
          </SubmitButton>
        </form>
      )}

      <span className="text-center text-ui-fg-base text-small-regular mt-6">
        Remembered it?{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
          className="underline"
          data-testid="cancel-reset-button"
        >
          Sign in
        </button>
      </span>
    </div>
  )
}

export default ForgotPassword

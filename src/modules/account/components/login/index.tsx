import { login } from "@lib/data/customer"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import { useActionState } from "react"
import { useSearchParams } from "next/navigation"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Login = ({ setCurrentView }: Props) => {
  const [message, formAction, isPending] = useActionState(login, null)
  // Set when the customer was sent here from somewhere that needed them
  // signed in — checkout, today. Validated server-side before it is used.
  const redirectTo = useSearchParams().get("redirect")

  return (
    <div
      className="max-w-sm w-full flex flex-col items-center"
      data-testid="login-page"
    >
      <h1 className="text-large-semi uppercase mb-6">Welcome back</h1>
      <p className="text-center text-base-regular text-ui-fg-base mb-8">
        Sign in to access wholesale pricing and manage bulk orders.
      </p>
      <form className="w-full" action={formAction}>
        {redirectTo && (
          <input type="hidden" name="redirect_to" value={redirectTo} />
        )}
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label="Email"
            name="email"
            type="email"
            title="Enter a valid email address."
            autoComplete="email"
            required
            data-testid="email-input"
          />
          <Input
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            data-testid="password-input"
          />
        </div>
        {/* Under the password field, where someone realises they have
            forgotten it — not at the bottom after the submit button. */}
        <button
          type="button"
          onClick={() => setCurrentView(LOGIN_VIEW.FORGOT_PASSWORD)}
          className="text-ui-fg-subtle text-small-regular underline mt-2 w-fit"
          data-testid="forgot-password-button"
        >
          Forgot your password?
        </button>
        <ErrorMessage error={message} data-testid="login-error-message" />
        <SubmitButton
          data-testid="sign-in-button"
          className="w-full mt-6"
          isLoading={isPending}
          pendingText="Signing in…"
        >
          Sign in
        </SubmitButton>
      </form>
      <span className="text-center text-ui-fg-base text-small-regular mt-6">
        Not a member?{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
          className="underline"
          data-testid="register-link"
        >
          Join us
        </button>
        .
      </span>
    </div>
  )
}

export default Login

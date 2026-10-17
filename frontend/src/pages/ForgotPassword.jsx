import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, MailCheck, ShieldCheck } from 'lucide-react'
import { requestPasswordReset } from '../services/api'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const result = await requestPasswordReset({ email: email.trim().toLowerCase() })
      setSuccess(
        result?.message ||
        'If an account exists for this email, password-reset instructions will be sent.'
      )
    } catch (requestError) {
      const status = requestError.response?.status
      if (status === 404 || status === 405) {
        setError('Password recovery is not enabled on the backend yet. The frontend is ready, but the FastAPI recovery endpoint must be added.')
      } else {
        setError(
          requestError.response?.data?.detail ||
          'We could not submit the request. Please check the server connection and try again.'
        )
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)] px-5 py-10 text-[var(--text-primary)] transition-colors duration-200">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center justify-center gap-2 text-2xl font-bold text-[var(--text-primary)]">
            <ShieldCheck className="text-[var(--accent)]" size={26} />
            CapTax <span className="text-[var(--accent)]">AI</span>
          </Link>
          <h1 className="mt-7 text-3xl font-bold tracking-tight">Forgot password?</h1>
          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
            Enter the email address associated with your account. If recovery is enabled, we’ll send instructions to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-[var(--border-primary)] bg-[var(--surface-primary)] p-6 shadow-sm">
          {error && <div role="alert" className="mb-5 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-300">{error}</div>}
          {success && (
            <div role="status" className="mb-5 flex items-start gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">
              <MailCheck size={19} className="mt-0.5 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <label htmlFor="reset-email" className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">Email address</label>
          <input
            id="reset-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
            className="w-full rounded-lg border border-[var(--border-primary)] bg-[var(--surface-secondary)] px-4 py-3 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/30"
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-5 w-full rounded-lg bg-[var(--text-primary)] px-4 py-3 font-semibold text-[var(--bg-primary)] transition hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Submitting request…' : 'Send reset instructions'}
          </button>

          <Link to="/login" className="mt-6 inline-flex w-full items-center justify-center gap-2 text-sm font-medium text-[var(--accent)] hover:opacity-80">
            <ArrowLeft size={15} /> Back to sign in
          </Link>
        </form>
      </div>
    </main>
  )
}

export default ForgotPassword

import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ShieldCheck } from 'lucide-react'
import { submitPasswordReset } from '../services/api'

function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token') || ''
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!token) {
      setError('This reset link is missing its token. Request a new password-reset email.')
      return
    }
    if (password.length < 8) {
      setError('Your new password must contain at least 8 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('The passwords do not match.')
      return
    }

    setLoading(true)
    try {
      const result = await submitPasswordReset({ token, new_password: password })
      setSuccess(result?.message || 'Password updated. You can now sign in.')
      window.setTimeout(() => navigate('/login', { replace: true }), 1200)
    } catch (requestError) {
      setError(
        requestError.response?.data?.detail ||
        'We could not reset the password. Please request a new reset link.'
      )
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
          <h1 className="mt-7 text-3xl font-bold tracking-tight">Set a new password</h1>
          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
            Choose a new password for your CapTax AI account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-[var(--border-primary)] bg-[var(--surface-primary)] p-6 shadow-sm">
          {error && <div role="alert" className="mb-5 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-300">{error}</div>}
          {success && <div role="status" className="mb-5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">{success}</div>}

          <label htmlFor="new-password" className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">New password</label>
          <input id="new-password" type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" minLength={8} maxLength={128} required className="w-full rounded-lg border border-[var(--border-primary)] bg-[var(--surface-secondary)] px-4 py-3 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/30" />

          <label htmlFor="confirm-password" className="mb-2 mt-4 block text-sm font-medium text-[var(--text-secondary)]">Confirm new password</label>
          <input id="confirm-password" type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Re-enter your password" minLength={8} maxLength={128} required className="w-full rounded-lg border border-[var(--border-primary)] bg-[var(--surface-secondary)] px-4 py-3 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/30" />

          <button type="submit" disabled={loading} className="mt-5 w-full rounded-lg bg-[var(--text-primary)] px-4 py-3 font-semibold text-[var(--bg-primary)] transition hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? 'Updating password…' : 'Update password'}
          </button>

          <Link to="/login" className="mt-6 inline-flex w-full items-center justify-center gap-2 text-sm font-medium text-[var(--accent)] hover:opacity-80">
            <ArrowLeft size={15} /> Back to sign in
          </Link>
        </form>
      </div>
    </main>
  )
}

export default ResetPassword

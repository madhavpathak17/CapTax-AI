import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login({
        email,
        password,
      })

      navigate('/dashboard')
    } catch (error) {
      setError(
        error.response?.data?.detail ||
        'Login failed. Please check your credentials.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)] px-6 text-[var(--text-primary)] transition-colors duration-200">

      <div className="w-full max-w-md">

        <div className="mb-8 text-center">

          <Link
            to="/"
            className="text-2xl font-bold text-[var(--text-primary)]"
          >
            CapTax{' '}
            <span className="text-[var(--accent)]">
              AI
            </span>
          </Link>


          <h1 className="mt-6 text-3xl font-bold text-[var(--text-primary)]">
            Welcome back
          </h1>


          <p className="mt-2 text-[var(--text-secondary)]">
            Sign in to continue to your CapTax AI workspace.
          </p>

        </div>


        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-[var(--border-primary)] bg-[var(--surface-primary)] p-6 shadow-sm transition-colors duration-200"
        >

          {error && (
            <div className="mb-5 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-300">
              {error}
            </div>
          )}


          <div className="space-y-4">

            <div>

              <label className="mb-2 block text-sm text-[var(--text-secondary)]">
                Email
              </label>


              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-lg border border-[var(--border-primary)] bg-[var(--surface-secondary)] px-4 py-3 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/30"
              />

            </div>


            <div>

              <label className="mb-2 block text-sm text-[var(--text-secondary)]">
                Password
              </label>


              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full rounded-lg border border-[var(--border-primary)] bg-[var(--surface-secondary)] px-4 py-3 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/30"
              />

            </div>

            <div className="flex justify-end -mt-1">
              <Link to="/forgot-password" className="text-sm font-medium text-[var(--accent)] transition hover:opacity-80">
                Forgot password?
              </Link>
            </div>

          </div>


          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-lg bg-[var(--text-primary)] px-4 py-3 font-semibold text-[var(--bg-primary)] transition hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? 'Signing in...'
              : 'Sign in'}
          </button>


          <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
            Don't have an account?{' '}

            <Link
              to="/register"
              className="font-medium text-[var(--accent)] transition hover:opacity-80"
            >
              Create one
            </Link>

          </p>

        </form>

      </div>

    </div>
  )
}

export default Login
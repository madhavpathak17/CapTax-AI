import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [mobile, setMobile] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await register({
        name: name.trim(),
        username: username.trim(),
        mobile: mobile.trim(),
        email: email.trim().toLowerCase(),
        password,
      })

      navigate('/login')
    } catch (error) {
      setError(
        error.response?.data?.detail ||
        'Registration failed. Please try again.'
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
            Create your account
          </h1>


          <p className="mt-2 text-[var(--text-secondary)]">
            Start managing your tax data with CapTax AI.
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
                Full name
              </label>


              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
                className="w-full rounded-lg border border-[var(--border-primary)] bg-[var(--surface-secondary)] px-4 py-3 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/30"
              />

            </div>

            <div>
              <label className="mb-2 block text-sm text-[var(--text-secondary)]">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.replace(/\s/g, ''))}
                placeholder="Choose a username"
                minLength={3}
                maxLength={30}
                autoComplete="username"
                required
                className="w-full rounded-lg border border-[var(--border-primary)] bg-[var(--surface-secondary)] px-4 py-3 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/30"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-[var(--text-secondary)]">Mobile number</label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/[^0-9+() -]/g, ''))}
                placeholder="Enter mobile number"
                minLength={10}
                maxLength={16}
                autoComplete="tel"
                required
                className="w-full rounded-lg border border-[var(--border-primary)] bg-[var(--surface-secondary)] px-4 py-3 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/30"
              />
            </div>

            <div>

              <label className="mb-2 block text-sm text-[var(--text-secondary)]">
                Email
              </label>


              <input
                type="email"
                autoComplete="email"
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
                placeholder="Minimum 8 characters"
                minLength={8}
                required
                className="w-full rounded-lg border border-[var(--border-primary)] bg-[var(--surface-secondary)] px-4 py-3 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/30"
              />

            </div>

          </div>


          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-lg bg-[var(--text-primary)] px-4 py-3 font-semibold text-[var(--bg-primary)] transition hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? 'Creating account...'
              : 'Create account'}
          </button>


          <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
            Already have an account?{' '}

            <Link
              to="/login"
              className="font-medium text-[var(--accent)] transition hover:opacity-80"
            >
              Sign in
            </Link>

          </p>

        </form>

      </div>

    </div>
  )
}

export default Register 
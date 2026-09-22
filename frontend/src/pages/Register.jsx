import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
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
        name,
        email,
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
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="text-2xl font-bold">
            CapTax <span className="text-emerald-400">AI</span>
          </Link>

          <h1 className="mt-6 text-3xl font-bold">
            Create your account
          </h1>

          <p className="mt-2 text-slate-400">
            Start managing your tax data with CapTax AI.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"
        >
          {error && (
            <div className="mb-5 rounded-lg border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Full name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
                className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-emerald-400/50"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-emerald-400/50"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                minLength={8}
                required
                className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-emerald-400/50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-lg bg-white px-4 py-3 font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>

          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-emerald-400 hover:text-emerald-300"
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
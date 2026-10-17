import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  BarChart3,
  ChevronDown,
  FileSpreadsheet,
  Globe2,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  TrendingUp,
  UserRound,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const navigation = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Transactions', path: '/transactions', icon: FileSpreadsheet },
  { label: 'Capital Gains', path: '/capital-gains', icon: TrendingUp },
  { label: 'Foreign Assets', path: '/foreign-assets', icon: Globe2 },
  { label: 'Tax Analytics', path: '/tax-analytics', icon: BarChart3 },
]

export default function AuthenticatedLayout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const candidateNames = [user?.name, user?.full_name, user?.username]
    .map((value) => (typeof value === 'string' ? value.trim() : ''))
    .filter((value) => value && !['string', 'null', 'undefined', 'name', 'user'].includes(value.toLowerCase()))
  const email = typeof user?.email === 'string' ? user.email.trim() : ''
  const displayName = candidateNames[0] || (email ? email.split('@')[0] : 'Account')
  const initials = displayName
    .split(/[ @._-]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('') || 'U'

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
    navigate('/login', { replace: true, state: { message: 'You have been logged out successfully.' } })
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[var(--border-primary)] bg-[var(--surface-primary)]/95 backdrop-blur-xl">
        <div className="mx-auto flex min-h-[68px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="flex shrink-0 items-center gap-2.5 rounded-lg text-left"
            aria-label="Go to CapTax AI dashboard"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border-primary)] bg-[var(--surface-secondary)] text-[var(--accent)]">
              <ShieldCheck size={19} />
            </span>
            <span className="text-base font-semibold tracking-tight text-[var(--text-primary)]">
              CapTax <span className="text-[var(--accent)]">AI</span>
              <span className="mt-0.5 hidden text-[9px] font-medium uppercase tracking-[0.18em] text-[var(--text-muted)] sm:block">
                Investment tax workspace
              </span>
            </span>
          </button>

          <nav className="hidden items-center gap-1 xl:flex" aria-label="Main navigation">
            {navigation.map(({ label, path, icon: Icon }) => {
              const active = location.pathname === path
              return (
                <button
                  key={path}
                  type="button"
                  onClick={() => navigate(path)}
                  className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition ${
                    active
                      ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <Icon size={15} />
                  {label}
                </button>
              )
            })}
          </nav>

          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              className="flex items-center gap-2 rounded-xl border border-[var(--border-primary)] bg-[var(--surface-secondary)] px-2.5 py-2 transition hover:bg-[var(--surface-hover)] sm:px-3"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent-soft)] text-xs font-semibold text-[var(--accent)]">
                {initials}
              </span>
              <span className="hidden max-w-36 text-left sm:block">
                <span className="block max-w-36 truncate text-xs font-semibold text-[var(--text-primary)]">{displayName}</span>
                <span className="block text-[10px] text-[var(--text-muted)]">Signed in</span>
              </span>
              <ChevronDown size={14} className="text-[var(--text-muted)]" />
            </button>

            {menuOpen && (
              <>
                <button
                  type="button"
                  aria-label="Close account menu"
                  className="fixed inset-0 z-40 cursor-default"
                  onClick={() => setMenuOpen(false)}
                />
                <div role="menu" className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-[var(--border-primary)] bg-[var(--surface-primary)] p-2 shadow-xl">
                  <div className="border-b border-[var(--border-primary)] px-3 py-3">
                    <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                      <UserRound size={15} />
                      <span className="text-xs font-medium">Current account</span>
                    </div>
                    <p className="mt-1 truncate text-sm font-semibold text-[var(--text-primary)]">{displayName}</p>
                    <p className="mt-0.5 truncate text-xs text-[var(--text-muted)]">{user?.email || ''}</p>
                  </div>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    className="mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-500/10 dark:text-red-300"
                  >
                    <LogOut size={16} />
                    Log out / Switch account
                  </button>
                  <p className="px-3 pb-1 pt-2 text-[10px] leading-4 text-[var(--text-muted)]">
                    Your saved data stays in your account when you log out.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        <nav className="flex gap-1 overflow-x-auto border-t border-[var(--border-secondary)] px-3 py-2 xl:hidden" aria-label="Mobile navigation">
          {navigation.map(({ label, path, icon: Icon }) => {
            const active = location.pathname === path
            return (
              <button
                key={path}
                type="button"
                onClick={() => navigate(path)}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition ${
                  active
                    ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]'
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            )
          })}
        </nav>
      </header>
      {children}
    </>
  )
}

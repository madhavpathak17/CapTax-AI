import { ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#08090b]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        <div className="flex flex-col gap-10 py-12 md:flex-row md:items-center md:justify-between">

          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-400/20 bg-emerald-400/[0.05]">
              <ShieldCheck
                size={17}
                className="text-emerald-400"
              />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-200">
                CapTax <span className="text-emerald-400">AI</span>
              </p>

              <p className="mt-0.5 text-[9px] uppercase tracking-[0.2em] text-slate-600">
                Investment tax intelligence
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-wrap gap-x-7 gap-y-3 text-sm text-slate-500">

            <a
              href="#platform"
              className="transition hover:text-slate-200"
            >
              Platform
            </a>

            <a
              href="#how-it-works"
              className="transition hover:text-slate-200"
            >
              Workflow
            </a>

            <a
              href="#ai-assistant"
              className="transition hover:text-slate-200"
            >
              AI Assistant
            </a>

            <Link
              to="/login"
              className="transition hover:text-slate-200"
            >
              Sign in
            </Link>

          </nav>
        </div>

        <div className="border-t border-white/[0.07] py-7">

          <div className="flex flex-col gap-3 text-xs leading-5 text-slate-600 md:flex-row md:items-center md:justify-between">

            <p className="max-w-3xl">
              CapTax AI is an academic software prototype developed for
              educational purposes. It is not a substitute for professional
              tax, legal, accounting, or financial advice.
            </p>

            <p className="shrink-0">
              © 2026 CapTax AI
            </p>

          </div>

        </div>
      </div>
    </footer>
  )
}

export default Footer
import { ArrowUpRight, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto max-w-7xl px-6 pt-5 lg:px-8">
        <div className="flex h-16 items-center justify-between rounded-2xl border border-white/[0.10] bg-[#0b0d0f]/90 px-5 shadow-2xl backdrop-blur-xl">

          {/* Brand */}
          <Link to="/" className="group flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.06] transition group-hover:border-emerald-400/30">
              <ShieldCheck
                size={18}
                strokeWidth={1.8}
                className="text-emerald-400"
              />
            </div>

            <div className="leading-none">
              <div className="text-[15px] font-semibold tracking-[-0.02em] text-white">
                CapTax <span className="text-emerald-400">AI</span>
              </div>

              <div className="mt-1 text-[9px] font-medium uppercase tracking-[0.18em] text-slate-600">
                Tax intelligence
              </div>
            </div>
          </Link>

          {/* Navigation */}
          <div className="hidden items-center gap-8 lg:flex">
            <a
              href="#platform"
              className="text-[13px] font-medium text-slate-300 transition hover:text-white"
            >
              Platform
            </a>

            <a
              href="#how-it-works"
              className="text-[13px] font-medium text-slate-300 transition hover:text-white"
            >
              How it works
            </a>

            <a
              href="#ai-assistant"
              className="text-[13px] font-medium text-slate-300 transition hover:text-white"
            >
              AI Assistant
            </a>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden text-[13px] font-medium text-slate-300 transition hover:text-white sm:block"
            >
              Sign in
            </Link>

            <Link
              to="/register"
              className="group inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2.5 text-[13px] font-semibold text-[#080a0c] shadow-lg shadow-black/20 transition duration-200 hover:bg-slate-100"
            >
              <span className="text-[#080a0c]">
                Get started
              </span>

              <ArrowUpRight
                size={14}
                strokeWidth={2}
                className="text-[#080a0c] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>

        </div>
      </div>
    </nav>
  )
}

export default Navbar
import {
  ArrowRight,
  ChevronDown,
  Layers3,
  Calculator,
  Globe2,
  TrendingUp,
  BarChart3,
  Database,
} from 'lucide-react'
import { Link } from 'react-router-dom'

const platforms = [
  'Zerodha',
  'Interactive Brokers',
  'E*TRADE',
  'Crypto Exchanges',
]

function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#08090b] pt-32">

      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
          backgroundSize: '46px 46px',
        }}
      />

      {/* Soft emerald glow */}
      <div className="pointer-events-none absolute right-[12%] top-24 h-[520px] w-[520px] rounded-full bg-emerald-400/[0.045] blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">

        {/* Main hero */}
        <div className="grid items-center gap-14 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12 lg:py-24">

          {/* LEFT */}
          <div className="max-w-2xl">

            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.28em] text-emerald-400">
              Investment tax intelligence
            </p>

            <h1 className="text-5xl font-semibold leading-[0.98] tracking-[-0.05em] text-white sm:text-6xl lg:text-7xl">
              Turn investment data
              <br />
              into{' '}
              <span className="text-emerald-400">
                tax clarity.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-7 text-slate-400 sm:text-lg">
              Consolidate transactions across brokers, calculate capital
              gains, organize foreign assets, and understand your tax
              position through one intelligent platform.
            </p>

            {/* Buttons */}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">

              <Link
                to="/register"
                className="group inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3.5 text-sm font-semibold text-[#080a0c] shadow-xl shadow-white/[0.06] transition duration-200 hover:bg-slate-100"
              >
                <span className="text-[#080a0c]">
                  Start with your portfolio
                </span>

                <ArrowRight
                  size={16}
                  strokeWidth={2}
                  className="text-[#080a0c] transition-transform group-hover:translate-x-1"
                />
              </Link>

              <a
                href="#platform"
                className="group inline-flex items-center justify-center gap-2 rounded-lg border border-white/[0.14] bg-[#0c1012] px-6 py-3.5 text-sm font-medium text-slate-200 transition hover:border-white/[0.25] hover:bg-[#111618]"
              >
                Explore the platform

                <ChevronDown
                  size={15}
                  className="text-slate-400 transition-transform group-hover:translate-y-0.5"
                />
              </a>

            </div>

            {/* Capabilities */}
            <div className="mt-10 grid max-w-2xl border-y border-white/[0.08] sm:grid-cols-3">

              <div className="flex items-center gap-3 border-b border-white/[0.08] py-4 sm:border-b-0 sm:border-r sm:pr-5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-emerald-400/20 bg-emerald-400/[0.06]">
                  <Layers3
                    size={17}
                    className="text-emerald-400"
                  />
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-200">
                    Multi-broker
                  </p>

                  <p className="text-xs text-slate-500">
                    Data integration
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 border-b border-white/[0.08] py-4 sm:border-b-0 sm:border-r sm:px-5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-emerald-400/20 bg-emerald-400/[0.06]">
                  <Calculator
                    size={17}
                    className="text-emerald-400"
                  />
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-200">
                    FIFO / LIFO
                  </p>

                  <p className="text-xs text-slate-500">
                    Matching engine
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 py-4 sm:pl-5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-emerald-400/20 bg-emerald-400/[0.06]">
                  <Globe2
                    size={17}
                    className="text-emerald-400"
                  />
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-200">
                    Multi-currency
                  </p>

                  <p className="text-xs text-slate-500">
                    FX processing
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT — Dashboard */}
          <div className="relative">

            {/* Glow behind dashboard */}
            <div className="pointer-events-none absolute -inset-6 rounded-3xl bg-emerald-400/[0.035] blur-3xl" />

            <div className="relative overflow-hidden rounded-2xl border border-emerald-400/25 bg-[#0c1012] shadow-2xl shadow-black/40">

              {/* Dashboard header */}
              <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4">

                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-400/20 bg-emerald-400/[0.06]">
                    <ShieldIcon />
                  </div>

                  <span className="text-sm font-semibold text-slate-100">
                    CapTax <span className="text-emerald-400">AI</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="text-xs text-slate-400">
                    Live data
                  </span>
                </div>

              </div>

              {/* Dashboard body */}
              <div className="grid lg:grid-cols-[135px_1fr]">

                {/* Sidebar */}
                <div className="hidden border-r border-white/[0.08] p-4 lg:block">

                  <p className="mb-5 text-[9px] uppercase tracking-[0.2em] text-slate-600">
                    Workspace
                  </p>

                  <div className="space-y-1.5">

                    <div className="rounded-lg bg-emerald-400/[0.08] px-3 py-2.5 text-xs font-medium text-emerald-300">
                      Overview
                    </div>

                    <div className="px-3 py-2.5 text-xs text-slate-600">
                      Transactions
                    </div>

                    <div className="px-3 py-2.5 text-xs text-slate-600">
                      Capital Gains
                    </div>

                    <div className="px-3 py-2.5 text-xs text-slate-600">
                      Foreign Assets
                    </div>

                    <div className="px-3 py-2.5 text-xs text-slate-600">
                      AI Assistant
                    </div>

                  </div>
                </div>

                {/* Dashboard content */}
                <div className="p-5 sm:p-6">

                  <div className="flex items-start justify-between">

                    <div>
                      <p className="text-[9px] uppercase tracking-[0.2em] text-slate-600">
                        Portfolio overview
                      </p>

                      <p className="mt-2 text-2xl font-semibold text-white">
                        ₹8,42,500
                      </p>

                      <p className="mt-1 text-[11px] text-slate-600">
                        Consolidated across 3 platforms
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[9px] uppercase tracking-[0.2em] text-slate-600">
                        Realized gains
                      </p>

                      <p className="mt-2 text-sm font-semibold text-emerald-400">
                        +₹1,24,350
                      </p>
                    </div>

                  </div>

                  {/* Chart */}
                  <div className="mt-6 rounded-xl border border-white/[0.08] bg-[#090c0e] p-4">

                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-slate-300">
                        Portfolio performance
                      </p>

                      <div className="flex gap-2 text-[9px] text-slate-600">
                        <span>1M</span>
                        <span className="rounded bg-emerald-400/10 px-2 py-1 text-emerald-400">
                          6M
                        </span>
                        <span>1Y</span>
                      </div>
                    </div>

                    <div className="relative mt-5 h-44 overflow-hidden">

                      <div className="absolute inset-x-0 top-0 border-t border-white/[0.05]" />
                      <div className="absolute inset-x-0 top-1/3 border-t border-white/[0.05]" />
                      <div className="absolute inset-x-0 top-2/3 border-t border-white/[0.05]" />
                      <div className="absolute inset-x-0 bottom-0 border-t border-white/[0.05]" />

                      <svg
                        viewBox="0 0 700 200"
                        preserveAspectRatio="none"
                        className="absolute inset-0 h-full w-full"
                      >
                        <path
                          d="M0 165 C65 150 80 135 135 145 C190 155 215 115 275 125 C330 135 360 80 420 105 C475 128 505 75 555 85 C610 96 640 45 700 58"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          className="text-emerald-400"
                        />

                        <path
                          d="M0 165 C65 150 80 135 135 145 C190 155 215 115 275 125 C330 135 360 80 420 105 C475 128 505 75 555 85 C610 96 640 45 700 58 L700 200 L0 200 Z"
                          fill="currentColor"
                          className="text-emerald-400/[0.06]"
                        />
                      </svg>

                      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[9px] text-slate-600">
                        <span>Jan</span>
                        <span>Feb</span>
                        <span>Mar</span>
                        <span>Apr</span>
                        <span>May</span>
                        <span>Jun</span>
                      </div>

                    </div>
                  </div>

                  {/* Dashboard metrics */}
                  <div className="mt-3 grid grid-cols-3 gap-2">

                    <Metric
                      label="Short-term"
                      value="₹38,200"
                    />

                    <Metric
                      label="Long-term"
                      value="₹86,150"
                    />

                    <Metric
                      label="Transactions"
                      value="248"
                    />

                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Supported platforms */}
        <div className="mb-10 overflow-hidden rounded-xl border border-white/[0.09] bg-[#0b0e10]">

          <div className="flex flex-wrap items-center justify-center divide-y divide-white/[0.07] sm:flex-nowrap sm:divide-x sm:divide-y-0">

            <div className="w-full px-6 py-5 sm:w-auto">
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-600">
                Supported platforms
              </span>
            </div>

            {platforms.map((platform) => (
              <div
                key={platform}
                className="w-1/2 px-6 py-5 text-center sm:w-auto sm:flex-1"
              >
                <span className="text-sm font-medium text-slate-400">
                  {platform}
                </span>
              </div>
            ))}

            <div className="w-1/2 px-6 py-5 text-center sm:w-auto sm:flex-1">
              <span className="text-sm text-slate-600">
                + More coming soon
              </span>
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}

function Metric({ label, value }) {
  return (
    <div className="border border-white/[0.08] bg-[#090c0e] p-3">
      <p className="text-[9px] text-slate-600">
        {label}
      </p>

      <p className="mt-1.5 text-sm font-semibold text-slate-200">
        {value}
      </p>
    </div>
  )
}

function ShieldIcon() {
  return (
    <div className="relative h-4 w-4">
      <div className="absolute inset-0 rounded-b-md border-2 border-emerald-400" />
      <div className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full border border-emerald-400 bg-[#0c1012]" />
    </div>
  )
}

export default Hero
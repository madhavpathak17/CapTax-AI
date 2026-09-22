import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

function CTA() {
  return (
    <section className="border-t border-white/[0.08] bg-[#090b0d]">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">

        <div className="relative overflow-hidden rounded-2xl border border-emerald-400/25 bg-[#0d1513] px-6 py-16 text-center shadow-2xl shadow-emerald-950/10 sm:px-10 lg:py-20">

          <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[550px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/[0.08] blur-3xl" />

          <div className="relative">

            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-400">
              CapTax AI
            </p>

            <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-white sm:text-5xl">
              Make your investment data work for you.
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-400">
              Build a clearer picture of your transactions, capital gains,
              and foreign assets in one place.
            </p>

            <Link
              to="/register"
              className="group mt-9 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3.5 text-sm font-semibold text-[#080a0c] shadow-xl shadow-white/[0.08] transition duration-200 hover:bg-slate-100"
            >
              <span className="text-[#080a0c]">
                Get started
              </span>

              <ArrowRight
                size={16}
                strokeWidth={2}
                className="text-[#080a0c] transition-transform group-hover:translate-x-1"
              />
            </Link>

          </div>
        </div>
      </div>
    </section>
  )
}

export default CTA
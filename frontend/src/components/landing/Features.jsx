import {
  Layers3,
  Calculator,
  Globe2,
  FileText,
  Sparkles,
  ShieldCheck,
} from 'lucide-react'

const features = [
  {
    number: '01',
    icon: Layers3,
    title: 'Multi-broker data layer',
    description:
      'Consolidate transactions from different investment platforms into a single normalized portfolio.',
  },
  {
    number: '02',
    icon: Calculator,
    title: 'Capital gains engine',
    description:
      'Match purchases and sales chronologically and calculate realized gains and losses using configurable rules.',
  },
  {
    number: '03',
    icon: Globe2,
    title: 'Foreign asset intelligence',
    description:
      'Organize foreign securities, accounts, dividends, and currency-denominated holdings.',
  },
  {
    number: '04',
    icon: FileText,
    title: 'Statement processing',
    description:
      'Extract transaction data from supported CSV, Excel, and PDF broker statements.',
  },
  {
    number: '05',
    icon: Sparkles,
    title: 'Context-aware AI',
    description:
      'Ask questions about your portfolio and receive explanations grounded in your processed data.',
  },
  {
    number: '06',
    icon: ShieldCheck,
    title: 'Compliance insights',
    description:
      'Surface missing information and potential disclosure considerations before preparing your tax records.',
  },
]

function Features() {
  return (
    <section
      id="platform"
      className="border-t border-white/[0.08] bg-[#090b0d]"
    >
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-28">

        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">

          {/* Intro */}
          <div className="max-w-xl">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-emerald-400">
              The platform
            </p>

            <h2 className="text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-white sm:text-5xl">
              Built for the complexity behind modern investing.
            </h2>

            <p className="mt-7 max-w-lg text-base leading-7 text-slate-400">
              CapTax AI brings fragmented investment data, calculation
              workflows, and intelligent analysis into one system.
            </p>
          </div>

          {/* Features */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

            {features.map((feature) => {
              const Icon = feature.icon

              return (
                <div
                  key={feature.number}
                  className="group relative min-h-[225px] rounded-xl border border-white/[0.10] bg-[#0d1113] p-6 transition duration-300 hover:-translate-y-0.5 hover:border-emerald-400/25 hover:bg-[#111618]"
                >

                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-400/20 bg-emerald-400/[0.06]">
                      <Icon
                        size={18}
                        strokeWidth={1.7}
                        className="text-emerald-400"
                      />
                    </div>

                    <span className="text-[10px] tracking-widest text-slate-600">
                      {feature.number}
                    </span>
                  </div>

                  <div className="mt-7">
                    <h3 className="text-[16px] font-semibold text-slate-100">
                      {feature.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-slate-400">
                      {feature.description}
                    </p>
                  </div>

                  <div className="absolute bottom-0 left-6 h-px w-0 bg-emerald-400 transition-all duration-500 group-hover:w-12" />

                </div>
              )
            })}

          </div>
        </div>
      </div>
    </section>
  )
}

export default Features
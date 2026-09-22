import {
  Layers3,
  ArrowRight,
  Database,
  BarChart3,
  Globe2,
  Sparkles,
} from 'lucide-react'

const brokers = [
  {
    name: 'Zerodha',
    short: 'Z',
  },
  {
    name: 'Interactive Brokers',
    short: 'IB',
  },
  {
    name: 'E*TRADE',
    short: 'E',
  },
  {
    name: 'Crypto Exchange',
    short: 'C',
  },
]

const outputs = [
  {
    icon: BarChart3,
    title: 'Capital Gains',
  },
  {
    icon: Globe2,
    title: 'Foreign Assets',
  },
  {
    icon: Sparkles,
    title: 'AI Analysis',
  },
]

function BrokerSection() {
  return (
    <section
      id="brokers"
      className="border-t border-white/[0.08] bg-[#080a0c]"
    >
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">

        {/* Header */}
        <div className="grid gap-8 lg:grid-cols-[0.9fr_0.65fr] lg:items-end">
          <div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-emerald-400">
              Multi-broker integration
            </p>

            <h2 className="max-w-2xl text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-white sm:text-5xl">
              Multiple brokers.
              <br />
              One source of truth.
            </h2>
          </div>

          <p className="max-w-md text-base leading-7 text-slate-400 lg:justify-self-end">
            Investment data lives across different platforms and formats.
            CapTax AI brings it together before performing any analysis.
          </p>
        </div>

        {/* Integration diagram */}
        <div className="relative mt-16 overflow-hidden rounded-2xl border border-white/[0.10] bg-[#0c0f11]">

          {/* Background grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
              backgroundSize: '42px 42px',
            }}
          />

          <div className="relative grid min-h-[430px] items-center gap-12 p-8 lg:grid-cols-[1fr_0.8fr_1fr] lg:p-12">

            {/* Broker inputs */}
            <div className="space-y-3">
              <p className="mb-5 text-xs uppercase tracking-[0.22em] text-slate-600">
                Data sources
              </p>

              {brokers.map((broker) => (
                <div
                  key={broker.name}
                  className="group flex items-center gap-4 rounded-lg border border-white/[0.09] bg-[#111518] px-4 py-3.5 transition duration-300 hover:border-emerald-400/25 hover:bg-[#14191b]"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-md border border-white/[0.08] bg-[#0b0e10] text-xs font-semibold text-slate-400 transition group-hover:border-emerald-400/20 group-hover:text-emerald-400">
                    {broker.short}
                  </div>

                  <span className="text-sm font-medium text-slate-300">
                    {broker.name}
                  </span>

                  <ArrowRight
                    size={15}
                    className="ml-auto text-slate-600 transition group-hover:translate-x-1 group-hover:text-emerald-400"
                  />
                </div>
              ))}
            </div>

            {/* Center data layer */}
            <div className="relative flex flex-col items-center">

              {/* Connection glow */}
              <div className="absolute h-40 w-40 rounded-full bg-emerald-400/[0.05] blur-3xl" />

              <div className="relative flex h-28 w-28 items-center justify-center rounded-2xl border border-emerald-400/30 bg-[#101719] shadow-lg shadow-emerald-950/20">
                <Layers3
                  size={34}
                  strokeWidth={1.4}
                  className="text-emerald-400"
                />
              </div>

              <h3 className="mt-6 text-base font-semibold text-slate-100">
                CapTax Data Layer
              </h3>

              <p className="mt-2 text-center text-xs text-slate-500">
                Normalize · Validate · Enrich
              </p>

              {/* Decorative lines */}
              <div className="absolute -left-12 top-14 hidden h-px w-12 bg-emerald-400/20 lg:block" />
              <div className="absolute -right-12 top-14 hidden h-px w-12 bg-emerald-400/20 lg:block" />
            </div>

            {/* Outputs */}
            <div className="space-y-3">
              <p className="mb-5 text-xs uppercase tracking-[0.22em] text-slate-600">
                Intelligence layer
              </p>

              {outputs.map((output) => {
                const Icon = output.icon

                return (
                  <div
                    key={output.title}
                    className="group flex items-center gap-4 rounded-lg border border-white/[0.09] bg-[#111518] px-4 py-4 transition duration-300 hover:border-emerald-400/25 hover:bg-[#14191b]"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-md border border-emerald-400/15 bg-emerald-400/[0.05]">
                      <Icon
                        size={17}
                        strokeWidth={1.6}
                        className="text-emerald-400"
                      />
                    </div>

                    <span className="text-sm font-medium text-slate-300">
                      {output.title}
                    </span>

                    <ArrowRight
                      size={15}
                      className="ml-auto text-slate-600 transition group-hover:translate-x-1 group-hover:text-emerald-400"
                    />
                  </div>
                )
              })}
            </div>
          </div>

          {/* Bottom explanation */}
          <div className="relative border-t border-white/[0.08] px-8 py-5 lg:px-12">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <Database
                  size={15}
                  className="text-emerald-400"
                />

                <span className="text-xs font-medium text-slate-400">
                  Unified transaction pipeline
                </span>
              </div>

              <span className="text-xs text-slate-600">
                Multiple formats → One normalized dataset
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

export default BrokerSection
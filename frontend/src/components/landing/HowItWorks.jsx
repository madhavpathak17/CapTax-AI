import {
  Upload,
  Database,
  Calculator,
  BarChart3,
  ArrowRight,
} from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: Upload,
    title: 'Import',
    description:
      'Bring in transaction statements from your investment platforms.',
  },
  {
    number: '02',
    icon: Database,
    title: 'Normalize',
    description:
      'Different broker formats are converted into a consistent transaction structure.',
  },
  {
    number: '03',
    icon: Calculator,
    title: 'Calculate',
    description:
      'The calculation engine matches transactions and determines gains and losses.',
  },
  {
    number: '04',
    icon: BarChart3,
    title: 'Understand',
    description:
      'Explore your results through analytics and the CapTax AI assistant.',
  },
]

function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="border-t border-white/[0.08] bg-[#080a0c]"
    >
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">

        {/* Header */}
        <div className="grid gap-8 lg:grid-cols-[1fr_0.65fr] lg:items-end">
          <div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-emerald-400">
              Workflow
            </p>

            <h2 className="max-w-3xl text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-white sm:text-5xl">
              From raw transactions
              <br />
              to a clear tax picture.
            </h2>
          </div>

          <p className="max-w-md text-base leading-7 text-slate-400 lg:justify-self-end">
            A structured workflow designed to make complex investment data
            easier to process, analyze, and understand.
          </p>
        </div>

        {/* Workflow */}
        <div className="relative mt-20">

          {/* Connecting line */}
          <div className="absolute left-[8%] right-[8%] top-7 hidden h-px bg-white/[0.10] lg:block" />

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => {
              const Icon = step.icon

              return (
                <div
                  key={step.number}
                  className="group relative rounded-xl border border-white/[0.10] bg-[#0d1012] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/30 hover:bg-[#111517]"
                >
                  {/* Step number */}
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-emerald-400/30 bg-[#0d1012]">
                      <Icon
                        size={21}
                        strokeWidth={1.7}
                        className="text-emerald-400"
                      />
                    </div>

                    <span className="text-xs font-medium tracking-[0.2em] text-slate-600">
                      {step.number}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-slate-100">
                      {step.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-slate-400">
                      {step.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  {step.number !== '04' && (
                    <div className="absolute -right-3 top-7 z-20 hidden h-6 w-6 items-center justify-center rounded-full border border-white/[0.10] bg-[#080a0c] lg:flex">
                      <ArrowRight
                        size={12}
                        className="text-slate-500"
                      />
                    </div>
                  )}

                  {/* Hover accent */}
                  <div className="absolute bottom-0 left-6 h-px w-0 bg-emerald-400 transition-all duration-500 group-hover:w-20" />
                </div>
              )
            })}
          </div>
        </div>

        {/* Technical flow */}
        <div className="mt-10 rounded-xl border border-white/[0.08] bg-[#0b0e10] px-6 py-5">
          <div className="flex flex-col gap-4 text-sm sm:flex-row sm:items-center sm:justify-center">

            <span className="text-slate-300">
              Broker statements
            </span>

            <ArrowRight
              size={16}
              className="hidden text-emerald-400 sm:block"
            />

            <span className="text-slate-300">
              Normalized transactions
            </span>

            <ArrowRight
              size={16}
              className="hidden text-emerald-400 sm:block"
            />

            <span className="text-emerald-400">
              CapTax Engine
            </span>

            <ArrowRight
              size={16}
              className="hidden text-emerald-400 sm:block"
            />

            <span className="text-slate-300">
              Tax insights
            </span>

          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
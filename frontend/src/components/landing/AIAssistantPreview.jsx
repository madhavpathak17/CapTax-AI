import {
  Sparkles,
  CheckCircle2,
  ArrowUpRight,
  MessageSquare,
} from 'lucide-react'

function AIAssistantPreview() {
  return (
    <section
      id="ai-assistant"
      className="border-t border-white/[0.08] bg-[#090b0d]"
    >
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">

        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">

          {/* AI conversation */}
          <div className="overflow-hidden rounded-2xl border border-white/[0.10] bg-[#0d1012] shadow-2xl shadow-black/20">

            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-400/25 bg-emerald-400/[0.07]">
                  <Sparkles
                    size={17}
                    className="text-emerald-400"
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-100">
                    CapTax AI
                  </p>

                  <div className="mt-0.5 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span className="text-[11px] text-slate-500">
                      Online
                    </span>
                  </div>
                </div>
              </div>

              <MessageSquare
                size={16}
                className="text-slate-600"
              />
            </div>

            {/* Conversation */}
            <div className="space-y-6 p-6">

              {/* User message */}
              <div className="flex justify-end">
                <div className="max-w-[82%] rounded-xl border border-white/[0.08] bg-[#171b1e] px-4 py-3 text-sm leading-6 text-slate-200">
                  Why is my AAPL gain classified as short-term?
                </div>
              </div>

              {/* AI response */}
              <div className="flex gap-3">
                <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-emerald-400/10">
                  <Sparkles
                    size={14}
                    className="text-emerald-400"
                  />
                </div>

                <div className="max-w-[88%]">
                  <p className="text-sm leading-7 text-slate-300">
                    The sale was matched with purchase lots whose holding
                    period falls within the short-term category.
                  </p>

                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    I can show you the exact purchase lots used in the
                    calculation and how the gain was derived.
                  </p>
                </div>
              </div>

              {/* Suggested action */}
              <button className="ml-10 inline-flex items-center gap-2 rounded-lg border border-emerald-400/25 bg-emerald-400/[0.06] px-3.5 py-2 text-xs font-medium text-emerald-300 transition hover:border-emerald-400/40 hover:bg-emerald-400/[0.10]">
                Show matched lots
                <ArrowUpRight size={13} />
              </button>

            </div>

            {/* Input */}
            <div className="border-t border-white/[0.08] p-4">
              <div className="flex items-center gap-3 rounded-lg border border-white/[0.08] bg-[#090b0d] px-4 py-3">
                <MessageSquare
                  size={15}
                  className="text-slate-600"
                />

                <span className="flex-1 text-sm text-slate-600">
                  Ask about your portfolio...
                </span>

                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-400">
                  <ArrowUpRight
                    size={14}
                    className="text-[#06100c]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Explanation */}
          <div className="max-w-xl">

            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-emerald-400">
              AI assistant
            </p>

            <h2 className="text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-white sm:text-5xl">
              Ask your portfolio anything.
            </h2>

            <p className="mt-7 text-base leading-7 text-slate-400">
              CapTax AI is designed to understand your transaction history
              and provide explanations grounded in your processed data,
              instead of simply showing numbers.
            </p>

            {/* Benefits */}
            <div className="mt-9 space-y-4">

              <div className="flex items-start gap-3">
                <CheckCircle2
                  size={18}
                  className="mt-0.5 shrink-0 text-emerald-400"
                />

                <div>
                  <p className="text-sm font-medium text-slate-200">
                    Answers grounded in your data
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Uses processed transactions and portfolio information
                    as context.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2
                  size={18}
                  className="mt-0.5 shrink-0 text-emerald-400"
                />

                <div>
                  <p className="text-sm font-medium text-slate-200">
                    Explains calculations step by step
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Understand how transactions were matched and gains were
                    calculated.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2
                  size={18}
                  className="mt-0.5 shrink-0 text-emerald-400"
                />

                <div>
                  <p className="text-sm font-medium text-slate-200">
                    Helps identify missing information
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Surface data gaps that may require attention before
                    preparing reports.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default AIAssistantPreview
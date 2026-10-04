import { useEffect, useState } from 'react'
import {
  ArrowRight,
  BarChart3,
  FileSpreadsheet,
  Globe2,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  WalletCards,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import api from '../services/api'


function Dashboard() {
  const navigate = useNavigate()

  const [data, setData] = useState(null)

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')


  const loadDashboard = async () => {

    try {

      setLoading(true)
      setError('')

      const response =
        await api.get(
          '/dashboard/summary'
        )

      setData(response.data)

    } catch (error) {

      console.error(
        'Failed to load dashboard:',
        error
      )

      setError(
        error.response?.data?.detail ||
        'Unable to load dashboard data.'
      )

    } finally {

      setLoading(false)

    }
  }


  useEffect(() => {
    loadDashboard()
  }, [])


  return (
    <div className="min-h-screen bg-[#080a0c] px-6 py-10 text-white lg:px-10">

      <div className="mx-auto max-w-7xl">

        {/* Header */}

        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

          <div>

            <p className="text-sm font-medium text-emerald-400">
              Overview
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Dashboard
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Monitor your portfolio, capital gains and foreign assets.
            </p>

          </div>


          <button
            onClick={loadDashboard}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-300 transition hover:bg-white/[0.08] disabled:opacity-60"
          >

            <RefreshCw
              size={15}
              className={
                loading
                  ? 'animate-spin'
                  : ''
              }
            />

            Refresh

          </button>

        </div>


        {error && (
          <div className="mt-6 rounded-xl border border-red-400/20 bg-red-400/10 px-5 py-4 text-sm text-red-300">
            {error}
          </div>
        )}


        {/* Primary Statistics */}

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">

          <StatCard
            label="Total Transactions"
            value={
              data?.total_transactions ?? 0
            }
            icon={
              <FileSpreadsheet
                size={18}
              />
            }
          />

          <StatCard
            label="Net Capital Gain"
            value={
              formatAmount(
                data?.net_gain_loss
              )
            }
            icon={
              data?.net_gain_loss >= 0
                ? <TrendingUp size={18} />
                : <TrendingDown size={18} />
            }
            accent={
              data?.net_gain_loss >= 0
                ? 'positive'
                : 'negative'
            }
          />

          <StatCard
            label="Foreign Assets"
            value={
              data?.foreign_asset_count ?? 0
            }
            icon={
              <Globe2 size={18} />
            }
          />

          <StatCard
            label="Remaining Holdings"
            value={
              data?.remaining_holdings ?? 0
            }
            icon={
              <WalletCards size={18} />
            }
          />

        </div>


        {/* Secondary Statistics */}

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">

          <MiniCard
            label="Buy Orders"
            value={
              data?.buy_transactions ?? 0
            }
          />

          <MiniCard
            label="Sell Orders"
            value={
              data?.sell_transactions ?? 0
            }
          />

          <MiniCard
            label="Total Gains"
            value={
              formatAmount(
                data?.total_gain
              )
            }
            positive
          />

          <MiniCard
            label="Total Losses"
            value={
              formatAmount(
                data?.total_loss
              )
            }
            negative
          />

        </div>


        {/* Analytics */}

        <div className="mt-8 grid gap-6 lg:grid-cols-2">

          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-slate-300">
                  Capital Gains
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Current FIFO-based gain distribution.
                </p>

              </div>

              <BarChart3
                size={19}
                className="text-emerald-400"
              />

            </div>


            <div className="mt-7 space-y-5">

              <ProgressRow
                label="Short-Term Gains"
                value={
                  data?.short_term_gain ?? 0
                }
                total={
                  data?.total_gain ?? 0
                }
              />

              <ProgressRow
                label="Long-Term Gains"
                value={
                  data?.long_term_gain ?? 0
                }
                total={
                  data?.total_gain ?? 0
                }
              />

            </div>


            <button
              onClick={() =>
                navigate(
                  '/capital-gains'
                )
              }
              className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-emerald-400 transition hover:text-emerald-300"
            >

              View Capital Gains

              <ArrowRight size={15} />

            </button>

          </section>


          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-slate-300">
                  Foreign Asset Exposure
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Values recorded in their original currencies.
                </p>

              </div>

              <Globe2
                size={19}
                className="text-emerald-400"
              />

            </div>


            <div className="mt-7 grid grid-cols-2 gap-5">

              <Metric
                label="Current Value"
                value={
                  formatAmount(
                    data?.foreign_current_value
                  )
                }
              />

              <Metric
                label="Peak Value"
                value={
                  formatAmount(
                    data?.foreign_peak_value
                  )
                }
              />

              <Metric
                label="Dividends"
                value={
                  formatAmount(
                    data?.foreign_dividend_income
                  )
                }
              />

              <Metric
                label="Foreign Tax Paid"
                value={
                  formatAmount(
                    data?.foreign_tax_paid
                  )
                }
              />

            </div>


            <button
              onClick={() =>
                navigate(
                  '/foreign-assets'
                )
              }
              className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-emerald-400 transition hover:text-emerald-300"
            >

              Manage Foreign Assets

              <ArrowRight size={15} />

            </button>

          </section>

        </div>


        {/* Quick Actions */}

        <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">

          <div>

            <p className="font-semibold">
              Quick Actions
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Continue managing your CapTax AI workspace.
            </p>

          </div>


          <div className="mt-6 grid gap-3 md:grid-cols-3">

            <ActionButton
              icon={
                <FileSpreadsheet
                  size={17}
                />
              }
              title="Transactions"
              description="Upload and review broker transactions."
              onClick={() =>
                navigate(
                  '/transactions'
                )
              }
            />

            <ActionButton
              icon={
                <TrendingUp
                  size={17}
                />
              }
              title="Capital Gains"
              description="Review FIFO matching and realized gains."
              onClick={() =>
                navigate(
                  '/capital-gains'
                )
              }
            />

            <ActionButton
              icon={
                <Globe2
                  size={17}
                />
              }
              title="Foreign Assets"
              description="Manage foreign investment disclosures."
              onClick={() =>
                navigate(
                  '/foreign-assets'
                )
              }
            />

          </div>

        </section>

      </div>

    </div>
  )
}


function StatCard({
  label,
  value,
  icon,
  accent,
}) {

  let valueClass =
    'text-white'

  if (accent === 'positive') {
    valueClass =
      'text-emerald-400'
  }

  if (accent === 'negative') {
    valueClass =
      'text-red-400'
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

      <div className="flex items-center justify-between">

        <p className="text-sm text-slate-500">
          {label}
        </p>

        <div className="text-slate-500">
          {icon}
        </div>

      </div>

      <p
        className={`mt-4 text-3xl font-semibold tracking-tight ${valueClass}`}
      >
        {value}
      </p>

    </div>
  )
}


function MiniCard({
  label,
  value,
  positive,
  negative,
}) {

  let valueClass =
    'text-white'

  if (positive) {
    valueClass =
      'text-emerald-400'
  }

  if (negative) {
    valueClass =
      'text-red-400'
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

      <p className="text-sm text-slate-500">
        {label}
      </p>

      <p
        className={`mt-3 text-2xl font-semibold ${valueClass}`}
      >
        {value}
      </p>

    </div>
  )
}


function ProgressRow({
  label,
  value,
  total,
}) {

  const percentage =
    total > 0
      ? Math.min(
          100,
          Math.max(
            0,
            (value / total) * 100
          )
        )
      : 0

  return (
    <div>

      <div className="flex items-center justify-between">

        <span className="text-sm text-slate-400">
          {label}
        </span>

        <span className="text-sm font-medium text-slate-300">
          {formatAmount(value)}
        </span>

      </div>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">

        <div
          className="h-full rounded-full bg-emerald-400 transition-all duration-500"
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>

    </div>
  )
}


function Metric({
  label,
  value,
}) {

  return (
    <div>

      <p className="text-xs uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-lg font-semibold text-white">
        {value}
      </p>

    </div>
  )
}


function ActionButton({
  icon,
  title,
  description,
  onClick,
}) {

  return (
    <button
      onClick={onClick}
      className="group flex items-start gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-4 text-left transition hover:border-white/20 hover:bg-white/[0.05]"
    >

      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-emerald-400">
        {icon}
      </div>

      <div>

        <p className="text-sm font-medium text-white">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>

      </div>

    </button>
  )
}


function formatAmount(value) {

  if (
    value === undefined ||
    value === null
  ) {
    return '0.00'
  }

  return Number(value).toFixed(2)
}


export default Dashboard
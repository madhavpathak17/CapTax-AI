import { useEffect, useState } from 'react'

import {
  ArrowLeft,
  BarChart3,
  Calculator,
  CircleDollarSign,
  Clock3,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  WalletCards,
} from 'lucide-react'

import { useNavigate } from 'react-router-dom'

import api from '../services/api'


function TaxAnalytics() {
  const navigate = useNavigate()

  const [analytics, setAnalytics] =
    useState(null)

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')


  const loadAnalytics = async () => {
    try {
      setLoading(true)
      setError('')

      const response =
        await api.get(
          '/tax-analytics/summary'
        )

      setAnalytics(response.data)

    } catch (error) {
      console.error(
        'Failed to load tax analytics:',
        error
      )

      setError(
        error.response?.data?.detail ||
        'Unable to load tax analytics.'
      )

    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    loadAnalytics()
  }, [])


  const formatINR = (value) => {
    const number =
      Number(value || 0)

    return `₹${number.toLocaleString(
      'en-IN',
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`
  }


  const currencySymbols = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    AUD: 'A$',
    CAD: 'C$',
    SGD: 'S$',
    CHF: 'CHF ',
  }

  const formatCurrency = (value, currency = 'USD') => {
    const symbol = currencySymbols[currency] ?? `${currency} `
    return `${symbol}${Number(value || 0).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }

  const formatCurrencyBreakdown = (field) => {
    const totals = analytics?.foreign_currency_totals || []

    if (totals.length === 0) {
      return '—'
    }

    return totals
      .map((item) => formatCurrency(item[field], item.currency))
      .join(' · ')
  }

  const formatNumber = (value) => {
    return Number(value || 0).toLocaleString(
      'en-IN',
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )
  }


  const getGainClass = (value) => {
    const number =
      Number(value || 0)

    if (number > 0) {
      return 'text-emerald-600 dark:text-emerald-400'
    }

    if (number < 0) {
      return 'text-red-600 dark:text-red-400'
    }

    return 'text-[var(--text-secondary)]'
  }


  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] px-6 py-10 text-[var(--text-primary)] transition-colors duration-200 lg:px-10">

        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center">

          <div className="text-center">

            <RefreshCw
              size={28}
              className="mx-auto animate-spin text-[var(--text-muted)]"
            />

            <p className="mt-4 text-sm text-[var(--text-secondary)]">
              Calculating tax analytics...
            </p>

            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Applying FIFO matching and historical FX rates
            </p>

          </div>

        </div>

      </div>
    )
  }


  if (error) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] px-6 py-10 text-[var(--text-primary)] transition-colors duration-200 lg:px-10">

        <div className="mx-auto max-w-7xl">

          <button
            onClick={() =>
              navigate('/dashboard')
            }
            className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
          >
            <ArrowLeft size={16} />

            Back to Dashboard
          </button>


          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-8 text-center">

            <TrendingDown
              size={32}
              className="mx-auto text-red-500 dark:text-red-400"
            />

            <h2 className="mt-4 text-lg font-semibold text-[var(--text-primary)]">
              Unable to Load Tax Analytics
            </h2>

            <p className="mx-auto mt-2 max-w-lg text-sm text-red-600/80 dark:text-red-300/80">
              {error}
            </p>


            <button
              onClick={loadAnalytics}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[var(--text-primary)] px-5 py-2.5 text-sm font-semibold text-[var(--bg-primary)] transition hover:opacity-85"
            >
              <RefreshCw size={15} />

              Try Again
            </button>

          </div>

        </div>

      </div>
    )
  }


  const matches =
    analytics?.matches || []


  const netGain =
    Number(
      analytics?.net_gain_loss_inr || 0
    )


  return (
    <div className="min-h-screen bg-[var(--bg-primary)] px-6 py-10 text-[var(--text-primary)] transition-colors duration-200 lg:px-10">

      <div className="mx-auto max-w-7xl">

        {/* Header */}

        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

          <div>

            <button
              onClick={() =>
                navigate('/dashboard')
              }
              className="mb-5 inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
            >
              <ArrowLeft size={16} />

              Back to Dashboard
            </button>


            <p className="text-sm font-medium text-[var(--accent)]">
              Tax Intelligence
            </p>


            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
              Tax Analytics
            </h1>


            <p className="mt-2 max-w-2xl text-sm text-[var(--text-secondary)]">
              Analyze realized capital gains using FIFO matching and historical foreign-exchange rates.
            </p>

          </div>


          <button
            onClick={loadAnalytics}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-primary)] bg-[var(--surface-secondary)] px-4 py-3 text-sm font-medium text-[var(--text-secondary)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)] disabled:opacity-60"
          >

            <RefreshCw
              size={15}
              className={
                loading
                  ? 'animate-spin'
                  : ''
              }
            />

            Refresh Analysis

          </button>

        </div>


        {/* Primary Metrics */}

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">

          <MetricCard
            label="Net Gain / Loss"
            value={formatINR(
              analytics?.net_gain_loss_inr
            )}
            icon={
              netGain >= 0
                ? TrendingUp
                : TrendingDown
            }
            valueClass={getGainClass(
              netGain
            )}
            description={
              netGain >= 0
                ? 'Realized net gain'
                : 'Realized net loss'
            }
          />


          <MetricCard
            label="Total Cost Basis"
            value={formatINR(
              analytics?.total_cost_basis_inr
            )}
            icon={WalletCards}
            description="INR value at purchase dates"
          />


          <MetricCard
            label="Total Sale Value"
            value={formatINR(
              analytics?.total_sale_value_inr
            )}
            icon={CircleDollarSign}
            description="INR value at sale dates"
          />


          <MetricCard
            label="Matched Transactions"
            value={
              analytics?.matched_transactions ??
              0
            }
            icon={Calculator}
            description="FIFO realized matches"
          />

        </div>


        {/* Secondary Metrics */}

        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">

          <MetricCard
            label="Short-Term Gain"
            value={formatINR(
              analytics?.short_term_gain_inr
            )}
            icon={Clock3}
            valueClass="text-emerald-600 dark:text-emerald-400"
            description="Short-term realized gains"
          />


          <MetricCard
            label="Long-Term Gain"
            value={formatINR(
              analytics?.long_term_gain_inr
            )}
            icon={TrendingUp}
            valueClass="text-emerald-600 dark:text-emerald-400"
            description="Long-term realized gains"
          />


          <MetricCard
            label="Foreign Dividend"
            value={formatCurrencyBreakdown('dividend_income')}
            icon={CircleDollarSign}
            description="Recorded foreign dividend income"
          />


          <MetricCard
            label="Foreign Tax Paid"
            value={formatCurrencyBreakdown('foreign_tax_paid')}
            icon={Calculator}
            description="Recorded foreign tax paid"
          />

        </div>


        {/* Gain / Loss Overview */}

        <div className="mt-8 grid gap-6 lg:grid-cols-3">

          <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--surface-primary)] p-6 shadow-sm transition-colors duration-200 lg:col-span-2">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-primary)] bg-[var(--surface-secondary)]">

                <BarChart3
                  size={18}
                  className="text-[var(--accent)]"
                />

              </div>


              <div>

                <h2 className="font-semibold text-[var(--text-primary)]">
                  Gain / Loss Overview
                </h2>

                <p className="mt-1 text-sm text-[var(--text-muted)]">
                  Realized gains and losses calculated in INR.
                </p>

              </div>

            </div>


            <div className="mt-8 space-y-6">

              <AnalysisBar
                label="Total Gains"
                value={
                  analytics?.total_gains_inr
                }
                max={
                  Math.max(
                    Number(
                      analytics?.total_gains_inr ||
                      0
                    ),
                    Number(
                      analytics?.total_losses_inr ||
                      0
                    ),
                    1
                  )
                }
                type="gain"
              />


              <AnalysisBar
                label="Total Losses"
                value={
                  analytics?.total_losses_inr
                }
                max={
                  Math.max(
                    Number(
                      analytics?.total_gains_inr ||
                      0
                    ),
                    Number(
                      analytics?.total_losses_inr ||
                      0
                    ),
                    1
                  )
                }
                type="loss"
              />


              <div className="grid gap-4 border-t border-[var(--border-primary)] pt-6 sm:grid-cols-2">

                <div>

                  <p className="text-xs uppercase tracking-wider text-[var(--text-muted)]">
                    Short-Term
                  </p>

                  <p className="mt-2 text-lg font-semibold text-[var(--text-primary)]">
                    {formatINR(
                      analytics?.short_term_gain_inr
                    )}
                  </p>

                </div>


                <div>

                  <p className="text-xs uppercase tracking-wider text-[var(--text-muted)]">
                    Long-Term
                  </p>

                  <p className="mt-2 text-lg font-semibold text-[var(--text-primary)]">
                    {formatINR(
                      analytics?.long_term_gain_inr
                    )}
                  </p>

                </div>

              </div>

            </div>

          </div>


          {/* Analysis Summary */}

          <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--surface-primary)] p-6 shadow-sm transition-colors duration-200">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-primary)] bg-[var(--surface-secondary)]">

                <Calculator
                  size={18}
                  className="text-[var(--accent)]"
                />

              </div>


              <div>

                <h2 className="font-semibold text-[var(--text-primary)]">
                  Analysis Summary
                </h2>

                <p className="mt-1 text-sm text-[var(--text-muted)]">
                  Calculation methodology
                </p>

              </div>

            </div>


            <div className="mt-6 space-y-4">

              <SummaryRow
                label="Matching Method"
                value="FIFO"
              />


              <SummaryRow
                label="Currency Basis"
                value="INR"
              />


              <SummaryRow
                label="FX Treatment"
                value="Historical"
              />


              <SummaryRow
                label="Realized Matches"
                value={
                  analytics?.matched_transactions ??
                  0
                }
              />


              <SummaryRow
                label="Net Result"
                value={formatINR(
                  analytics?.net_gain_loss_inr
                )}
                valueClass={getGainClass(
                  netGain
                )}
              />

            </div>

          </div>

        </div>


        {/* Detailed Transactions */}

        <div className="mt-8 overflow-hidden rounded-2xl border border-[var(--border-primary)] bg-[var(--surface-primary)] shadow-sm transition-colors duration-200">

          <div className="flex flex-col justify-between gap-4 border-b border-[var(--border-primary)] px-6 py-5 md:flex-row md:items-center">

            <div>

              <h2 className="font-semibold text-[var(--text-primary)]">
                FX-Adjusted Realized Transactions
              </h2>

              <p className="mt-1 text-sm text-[var(--text-muted)]">
                Each purchase and sale is converted using its respective historical FX rate.
              </p>

            </div>


            <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--surface-secondary)] px-3 py-2 text-xs text-[var(--text-secondary)]">
              {matches.length} realized matches
            </div>

          </div>


          {matches.length === 0 ? (

            <div className="px-6 py-20 text-center">

              <Calculator
                size={34}
                className="mx-auto text-[var(--text-muted)]"
              />

              <p className="mt-4 text-[var(--text-secondary)]">
                No realized transactions available.
              </p>

              <p className="mt-2 text-sm text-[var(--text-muted)]">
                Upload transactions containing both BUY and SELL records to generate tax analytics.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1350px] text-left text-sm">

                <thead className="border-b border-[var(--border-primary)] bg-[var(--surface-secondary)]">

                  <tr className="text-xs uppercase tracking-wider text-[var(--text-muted)]">

                    <th className="px-6 py-4">
                      Asset
                    </th>

                    <th className="px-6 py-4">
                      Buy Date
                    </th>

                    <th className="px-6 py-4">
                      Sell Date
                    </th>

                    <th className="px-6 py-4">
                      Qty
                    </th>

                    <th className="px-6 py-4">
                      Buy FX
                    </th>

                    <th className="px-6 py-4">
                      Sell FX
                    </th>

                    <th className="px-6 py-4">
                      INR Cost
                    </th>

                    <th className="px-6 py-4">
                      INR Sale
                    </th>

                    <th className="px-6 py-4">
                      Gain / Loss
                    </th>

                    <th className="px-6 py-4">
                      Holding
                    </th>

                    <th className="px-6 py-4">
                      Type
                    </th>

                  </tr>

                </thead>


                <tbody className="divide-y divide-[var(--border-secondary)]">

                  {matches.map(
                    (match, index) => {

                      const gain =
                        Number(
                          match.gain_loss_inr ||
                          0
                        )


                      return (
                        <tr
                          key={`${match.symbol}-${match.buy_date}-${match.sell_date}-${index}`}
                          className="transition hover:bg-[var(--surface-hover)]"
                        >

                          <td className="px-6 py-4">

                            <div>

                              <p className="font-semibold text-[var(--text-primary)]">
                                {match.symbol}
                              </p>

                              <p className="mt-1 text-xs text-[var(--text-muted)]">
                                {match.currency}
                              </p>

                            </div>

                          </td>


                          <td className="px-6 py-4 text-[var(--text-secondary)]">
                            {formatDate(
                              match.buy_date
                            )}
                          </td>


                          <td className="px-6 py-4 text-[var(--text-secondary)]">
                            {formatDate(
                              match.sell_date
                            )}
                          </td>


                          <td className="px-6 py-4 text-[var(--text-secondary)]">
                            {formatNumber(
                              match.quantity
                            )}
                          </td>


                          <td className="px-6 py-4">

                            <div>

                              <p className="font-medium text-[var(--text-secondary)]">
                                {formatNumber(
                                  match.buy_fx_rate
                                )}
                              </p>

                              <p className="mt-1 text-xs text-[var(--text-muted)]">
                                {match.buy_fx_source}
                              </p>

                            </div>

                          </td>


                          <td className="px-6 py-4">

                            <div>

                              <p className="font-medium text-[var(--text-secondary)]">
                                {formatNumber(
                                  match.sell_fx_rate
                                )}
                              </p>

                              <p className="mt-1 text-xs text-[var(--text-muted)]">
                                {match.sell_fx_source}
                              </p>

                            </div>

                          </td>


                          <td className="px-6 py-4 font-medium text-[var(--text-primary)]">
                            {formatINR(
                              match.cost_basis_inr
                            )}
                          </td>


                          <td className="px-6 py-4 font-medium text-[var(--text-primary)]">
                            {formatINR(
                              match.sale_value_inr
                            )}
                          </td>


                          <td
                            className={`px-6 py-4 font-semibold ${getGainClass(
                              gain
                            )}`}
                          >
                            {formatINR(gain)}
                          </td>


                          <td className="px-6 py-4 text-[var(--text-secondary)]">

                            <p>
                              {match.holding_days} days
                            </p>

                          </td>


                          <td className="px-6 py-4">

                            <span
                              className={
                                match.classification ===
                                'LONG_TERM'
                                  ? 'inline-flex rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-600 dark:text-blue-300'
                                  : 'inline-flex rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-600 dark:text-amber-300'
                              }
                            >
                              {match.classification ===
                              'LONG_TERM'
                                ? 'LONG TERM'
                                : 'SHORT TERM'}
                            </span>

                          </td>

                        </tr>
                      )
                    }
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>


        {/* Notes */}

        {analytics?.notes?.length > 0 && (

          <div className="mt-8 rounded-2xl border border-[var(--border-primary)] bg-[var(--surface-secondary)] p-6">

            <h2 className="font-semibold text-[var(--text-primary)]">
              Analysis Notes
            </h2>


            <div className="mt-4 space-y-3">

              {analytics.notes.map(
                (note, index) => (

                  <div
                    key={index}
                    className="flex gap-3 text-sm text-[var(--text-secondary)]"
                  >

                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />

                    <p>
                      {note}
                    </p>

                  </div>

                )
              )}

            </div>

          </div>

        )}


        {/* Disclaimer */}

        <div className="mt-6 pb-8 text-center text-xs text-[var(--text-muted)]">

          CapTax AI provides tax-analysis assistance for informational and academic purposes. It does not constitute professional tax, legal, or financial advice.

        </div>

      </div>

    </div>
  )
}


/* -------------------------------------------------- */
/* Reusable Components                                */
/* -------------------------------------------------- */


function MetricCard({
  label,
  value,
  icon: Icon,
  description,
  valueClass = 'text-[var(--text-primary)]',
}) {

  return (
    <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--surface-primary)] p-5 shadow-sm transition-colors duration-200">

      <div className="flex items-start justify-between gap-4">

        <div>

          <p className="text-sm text-[var(--text-muted)]">
            {label}
          </p>

          <p
            className={`mt-3 text-2xl font-semibold tracking-tight ${valueClass}`}
          >
            {value}
          </p>

          <p className="mt-2 text-xs text-[var(--text-muted)]">
            {description}
          </p>

        </div>


        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--border-primary)] bg-[var(--surface-secondary)]">

          <Icon
            size={18}
            className="text-[var(--accent)]"
          />

        </div>

      </div>

    </div>
  )
}


function AnalysisBar({
  label,
  value,
  max,
  type,
}) {

  const numericValue =
    Number(value || 0)


  const percentage =
    max > 0
      ? Math.min(
          (numericValue / max) * 100,
          100
        )
      : 0


  return (
    <div>

      <div className="flex items-center justify-between">

        <span className="text-sm text-[var(--text-secondary)]">
          {label}
        </span>


        <span
          className={
            type === 'gain'
              ? 'text-sm font-semibold text-emerald-600 dark:text-emerald-400'
              : 'text-sm font-semibold text-red-600 dark:text-red-400'
          }
        >
          ₹
          {numericValue.toLocaleString(
            'en-IN',
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }
          )}
        </span>

      </div>


      <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/10 dark:bg-white/[0.05]">

        <div
          className={`h-full rounded-full transition-all duration-700 ${
            type === 'gain'
              ? 'bg-emerald-500 dark:bg-emerald-400'
              : 'bg-red-500 dark:bg-red-400'
          }`}
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>

    </div>
  )
}


function SummaryRow({
  label,
  value,
  valueClass = 'text-[var(--text-primary)]',
}) {

  return (
    <div className="flex items-center justify-between gap-4 border-b border-[var(--border-secondary)] pb-3">

      <span className="text-sm text-[var(--text-muted)]">
        {label}
      </span>


      <span
        className={`text-sm font-medium ${valueClass}`}
      >
        {value}
      </span>

    </div>
  )
}


function formatDate(value) {

  if (!value) {
    return '-'
  }


  const parts =
    String(value)
      .slice(0, 10)
      .split('-')


  if (parts.length !== 3) {
    return value
  }


  return `${parts[2]}-${parts[1]}-${parts[0]}`
}


export default TaxAnalytics
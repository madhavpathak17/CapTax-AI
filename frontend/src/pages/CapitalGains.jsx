import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  RefreshCw,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import api from '../services/api'


function CapitalGains() {
  const navigate = useNavigate()

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')


  const loadCapitalGains = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await api.get(
        '/capital-gains/summary'
      )

      setData(response.data)

    } catch (error) {

      console.error(
        'Failed to load capital gains:',
        error
      )

      setError(
        error.response?.data?.detail ||
        'Unable to calculate capital gains.'
      )

    } finally {

      setLoading(false)

    }
  }


  useEffect(() => {
    loadCapitalGains()
  }, [])


  if (loading) {

    return (
      <div className="min-h-screen bg-[#080a0c] px-6 py-10 text-white lg:px-10">

        <div className="mx-auto max-w-7xl">

          <div className="flex min-h-[70vh] items-center justify-center">

            <div className="text-center">

              <RefreshCw
                size={24}
                className="mx-auto animate-spin text-slate-500"
              />

              <p className="mt-4 text-sm text-slate-500">
                Calculating capital gains...
              </p>

            </div>

          </div>

        </div>

      </div>
    )
  }


  if (error) {

    return (
      <div className="min-h-screen bg-[#080a0c] px-6 py-10 text-white lg:px-10">

        <div className="mx-auto max-w-7xl">

          <button
            onClick={() => navigate('/dashboard')}
            className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={16} />

            Back to Dashboard
          </button>

          <div className="rounded-2xl border border-red-400/20 bg-red-400/10 px-6 py-5 text-red-300">
            {error}
          </div>

        </div>

      </div>
    )
  }


  return (
    <div className="min-h-screen bg-[#080a0c] px-6 py-10 text-white lg:px-10">

      <div className="mx-auto max-w-7xl">

        {/* Header */}

        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

          <div>

            <button
              onClick={() => navigate('/dashboard')}
              className="mb-5 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
            >
              <ArrowLeft size={16} />

              Back to Dashboard
            </button>

            <p className="text-sm font-medium text-emerald-400">
              Tax Intelligence
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Capital Gains
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              FIFO-based capital gains analysis from your imported transactions.
            </p>

          </div>


          <button
            onClick={loadCapitalGains}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-300 transition hover:bg-white/[0.08]"
          >

            <RefreshCw size={15} />

            Recalculate

          </button>

        </div>


        {/* Summary Cards */}

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">

          <SummaryCard
            label="Net Gain / Loss"
            value={data?.net_gain_loss}
            positive={
              data?.net_gain_loss >= 0
            }
          />

          <SummaryCard
            label="Total Gains"
            value={data?.total_gain}
            positive
          />

          <SummaryCard
            label="Total Losses"
            value={data?.total_loss}
            positive={false}
          />

          <SummaryCard
            label="Matched Transactions"
            value={data?.matched_transactions}
            isCount
          />

        </div>


        {/* ST / LT */}

        <div className="mt-8 grid gap-4 md:grid-cols-2">

          <GainCard
            title="Short-Term"
            gain={data?.short_term_gain}
            loss={data?.short_term_loss}
          />

          <GainCard
            title="Long-Term"
            gain={data?.long_term_gain}
            loss={data?.long_term_loss}
          />

        </div>


        {/* FIFO Matches */}

        <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">

          <div className="border-b border-white/10 px-6 py-5">

            <h2 className="font-semibold">
              FIFO Matching Results
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Each sale is matched against the earliest available purchase lot.
            </p>

          </div>


          {data?.matches?.length === 0 ? (

            <div className="px-6 py-20 text-center">

              <p className="text-slate-300">
                No completed sales found.
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Upload BUY and SELL transactions to calculate capital gains.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1050px] text-left text-sm">

                <thead className="border-b border-white/10 bg-white/[0.02]">

                  <tr className="text-xs uppercase tracking-wider text-slate-500">

                    <th className="px-6 py-4">
                      Symbol
                    </th>

                    <th className="px-6 py-4">
                      Buy Date
                    </th>

                    <th className="px-6 py-4">
                      Sell Date
                    </th>

                    <th className="px-6 py-4">
                      Quantity
                    </th>

                    <th className="px-6 py-4">
                      Cost Basis
                    </th>

                    <th className="px-6 py-4">
                      Sale Value
                    </th>

                    <th className="px-6 py-4">
                      Gain / Loss
                    </th>

                    <th className="px-6 py-4">
                      Holding
                    </th>

                    <th className="px-6 py-4">
                      Classification
                    </th>

                  </tr>

                </thead>


                <tbody className="divide-y divide-white/[0.06]">

                  {data.matches.map(
                    (match, index) => (

                      <tr
                        key={`${match.sell_transaction_id}-${index}`}
                        className="transition hover:bg-white/[0.025]"
                      >

                        <td className="px-6 py-4 font-semibold text-white">
                          {match.symbol}
                        </td>

                        <td className="px-6 py-4 text-slate-400">
                          {formatDate(match.buy_date)}
                        </td>

                        <td className="px-6 py-4 text-slate-400">
                          {formatDate(match.sell_date)}
                        </td>

                        <td className="px-6 py-4 text-slate-300">
                          {match.quantity}
                        </td>

                        <td className="px-6 py-4 text-slate-300">
                          {match.currency} {match.cost_basis.toFixed(2)}
                        </td>

                        <td className="px-6 py-4 text-slate-300">
                          {match.currency} {match.sale_value.toFixed(2)}
                        </td>

                        <td
                          className={
                            match.gain_loss >= 0
                              ? 'px-6 py-4 font-semibold text-emerald-400'
                              : 'px-6 py-4 font-semibold text-red-400'
                          }
                        >
                          {match.currency}{' '}
                          {match.gain_loss.toFixed(2)}
                        </td>

                        <td className="px-6 py-4 text-slate-400">
                          {match.holding_days} days
                        </td>

                        <td className="px-6 py-4">

                          <span
                            className={
                              match.classification === 'LONG_TERM'
                                ? 'rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300'
                                : 'rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1 text-xs font-medium text-blue-300'
                            }
                          >
                            {formatClassification(
                              match.classification
                            )}
                          </span>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>


        {/* Remaining Holdings */}

        <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">

          <div className="border-b border-white/10 px-6 py-5">

            <h2 className="font-semibold">
              Remaining Holdings
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Unmatched BUY lots remaining after FIFO processing.
            </p>

          </div>


          {data?.remaining_holdings?.length === 0 ? (

            <div className="px-6 py-12 text-center text-sm text-slate-500">
              No remaining holdings.
            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[750px] text-left text-sm">

                <thead className="border-b border-white/10">

                  <tr className="text-xs uppercase tracking-wider text-slate-500">

                    <th className="px-6 py-4">
                      Symbol
                    </th>

                    <th className="px-6 py-4">
                      Buy Date
                    </th>

                    <th className="px-6 py-4">
                      Quantity
                    </th>

                    <th className="px-6 py-4">
                      Buy Price
                    </th>

                    <th className="px-6 py-4">
                      Currency
                    </th>

                    <th className="px-6 py-4">
                      Cost Basis
                    </th>

                  </tr>

                </thead>


                <tbody className="divide-y divide-white/[0.06]">

                  {data.remaining_holdings.map(
                    (holding, index) => (

                      <tr
                        key={`${holding.transaction_id}-${index}`}
                        className="hover:bg-white/[0.025]"
                      >

                        <td className="px-6 py-4 font-semibold text-white">
                          {holding.symbol}
                        </td>

                        <td className="px-6 py-4 text-slate-400">
                          {formatDate(holding.buy_date)}
                        </td>

                        <td className="px-6 py-4 text-slate-300">
                          {holding.quantity}
                        </td>

                        <td className="px-6 py-4 text-slate-300">
                          {holding.buy_price}
                        </td>

                        <td className="px-6 py-4 text-slate-400">
                          {holding.currency}
                        </td>

                        <td className="px-6 py-4 font-medium text-slate-300">
                          {holding.currency}{' '}
                          {holding.cost_basis.toFixed(2)}
                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </div>
  )
}


function SummaryCard({
  label,
  value,
  positive,
  isCount = false,
}) {

  return (

    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

      <p className="text-sm text-slate-500">
        {label}
      </p>

      <div className="mt-3 flex items-center gap-2">

        {positive !== undefined && !isCount && (
          positive
            ? <TrendingUp
                size={18}
                className="text-emerald-400"
              />
            : <TrendingDown
                size={18}
                className="text-red-400"
              />
        )}

        <p
          className={
            isCount
              ? 'text-3xl font-semibold tracking-tight'
              : positive
                ? 'text-3xl font-semibold tracking-tight text-emerald-400'
                : 'text-3xl font-semibold tracking-tight text-red-400'
          }
        >
          {isCount
            ? value
            : formatAmount(value)
          }
        </p>

      </div>

    </div>
  )
}


function GainCard({
  title,
  gain,
  loss,
}) {

  return (

    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

      <p className="text-sm font-medium text-slate-300">
        {title}
      </p>

      <div className="mt-5 grid grid-cols-2 gap-5">

        <div>

          <p className="text-xs uppercase tracking-wider text-slate-500">
            Gains
          </p>

          <p className="mt-2 text-xl font-semibold text-emerald-400">
            {formatAmount(gain)}
          </p>

        </div>


        <div>

          <p className="text-xs uppercase tracking-wider text-slate-500">
            Losses
          </p>

          <p className="mt-2 text-xl font-semibold text-red-400">
            {formatAmount(loss)}
          </p>

        </div>

      </div>

    </div>
  )
}


function formatAmount(value) {

  if (value === undefined || value === null) {
    return '0.00'
  }

  return Number(value).toFixed(2)
}


function formatDate(date) {

  if (!date) {
    return '—'
  }

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return date
  }

  return parsedDate.toLocaleDateString(
    'en-IN',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }
  )
}


function formatClassification(
  classification
) {

  if (classification === 'LONG_TERM') {
    return 'Long Term'
  }

  if (classification === 'SHORT_TERM') {
    return 'Short Term'
  }

  return classification
}


export default CapitalGains
import { useEffect, useRef, useState } from 'react'

import {
  ArrowLeft,
  FileSpreadsheet,
  RefreshCw,
  Upload,
} from 'lucide-react'

import { useNavigate } from 'react-router-dom'

import api from '../services/api'


function Transactions() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')


  const loadTransactions = async () => {
    try {
      setLoading(true)
      setError('')

      const response =
        await api.get('/transactions/')

      setTransactions(response.data || [])

    } catch (error) {
      console.error(
        'Failed to load transactions:',
        error
      )

      setError(
        error.response?.data?.detail ||
        'Unable to load transactions.'
      )

    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    loadTransactions()
  }, [])


  const handleUpload = async (event) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    setUploading(true)
    setError('')
    setMessage('')

    try {
      const formData = new FormData()

      formData.append('file', file)

      const response =
        await api.post(
          '/transactions/upload',
          formData,
          {
            headers: {
              'Content-Type':
                'multipart/form-data',
            },
          }
        )

      setMessage(
        `${response.data.message} ${response.data.inserted_count} transactions imported.`
      )

      await loadTransactions()

    } catch (error) {
      console.error(
        'Upload failed:',
        error
      )

      setError(
        error.response?.data?.detail ||
        'Transaction upload failed.'
      )

    } finally {
      setUploading(false)

      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }


  const totalTransactions =
    transactions.length

  const buyTransactions =
    transactions.filter(
      (transaction) =>
        transaction.transaction_type === 'BUY'
    ).length

  const sellTransactions =
    transactions.filter(
      (transaction) =>
        transaction.transaction_type === 'SELL'
    ).length


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
              Portfolio
            </p>


            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
              Transactions
            </h1>


            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Review and manage your imported broker transactions.
            </p>

          </div>


          <div>

            <button
              onClick={() =>
                fileInputRef.current?.click()
              }
              disabled={uploading}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--text-primary)] px-5 py-3 text-sm font-semibold text-[var(--bg-primary)] transition hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60"
            >

              <Upload size={16} />

              {uploading
                ? 'Uploading...'
                : 'Upload Transactions'
              }

            </button>


            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleUpload}
              className="hidden"
            />

          </div>

        </div>


        {/* Messages */}

        {message && (
          <div className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-600 dark:text-emerald-300">
            {message}
          </div>
        )}


        {error && (
          <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-600 dark:text-red-300">
            {error}
          </div>
        )}


        {/* Statistics */}

        <div className="mt-8 grid gap-4 md:grid-cols-3">

          <StatCard
            label="Total Transactions"
            value={totalTransactions}
          />

          <StatCard
            label="Buy Orders"
            value={buyTransactions}
          />

          <StatCard
            label="Sell Orders"
            value={sellTransactions}
          />

        </div>


        {/* Transaction Table */}

        <div className="mt-8 overflow-hidden rounded-2xl border border-[var(--border-primary)] bg-[var(--surface-primary)] shadow-sm transition-colors duration-200">

          <div className="flex items-center justify-between border-b border-[var(--border-primary)] px-6 py-5">

            <div>

              <h2 className="font-semibold text-[var(--text-primary)]">
                Transaction History
              </h2>

              <p className="mt-1 text-sm text-[var(--text-muted)]">
                All transactions imported into CapTax AI
              </p>

            </div>


            <button
              onClick={loadTransactions}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-primary)] bg-[var(--surface-secondary)] px-3 py-2 text-sm text-[var(--text-secondary)] transition hover:bg-[var(--surface-hover)] disabled:opacity-60"
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


          {loading ? (

            <div className="px-6 py-20 text-center">

              <RefreshCw
                size={22}
                className="mx-auto animate-spin text-[var(--text-muted)]"
              />

              <p className="mt-3 text-sm text-[var(--text-muted)]">
                Loading transactions...
              </p>

            </div>

          ) : transactions.length === 0 ? (

            <div className="px-6 py-20 text-center">

              <FileSpreadsheet
                size={34}
                className="mx-auto text-[var(--text-muted)]"
              />

              <p className="mt-4 text-[var(--text-secondary)]">
                No transactions found.
              </p>

              <p className="mt-2 text-sm text-[var(--text-muted)]">
                Upload a CSV or Excel broker statement to get started.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[900px] text-left text-sm">

                <thead className="border-b border-[var(--border-primary)] bg-[var(--surface-secondary)]">

                  <tr className="text-xs uppercase tracking-wider text-[var(--text-muted)]">

                    <th className="px-6 py-4">
                      Date
                    </th>

                    <th className="px-6 py-4">
                      Symbol
                    </th>

                    <th className="px-6 py-4">
                      Asset
                    </th>

                    <th className="px-6 py-4">
                      Type
                    </th>

                    <th className="px-6 py-4">
                      Quantity
                    </th>

                    <th className="px-6 py-4">
                      Price
                    </th>

                    <th className="px-6 py-4">
                      Currency
                    </th>

                    <th className="px-6 py-4">
                      Broker
                    </th>

                    <th className="px-6 py-4">
                      Total
                    </th>

                  </tr>

                </thead>


                <tbody className="divide-y divide-[var(--border-secondary)]">

                  {transactions.map(
                    (transaction) => (

                      <tr
                        key={transaction.id}
                        className="transition hover:bg-[var(--surface-hover)]"
                      >

                        <td className="whitespace-nowrap px-6 py-4 text-[var(--text-secondary)]">

                          {formatDate(
                            transaction.date
                          )}

                        </td>


                        <td className="px-6 py-4 font-semibold text-[var(--text-primary)]">

                          {transaction.symbol}

                        </td>


                        <td className="px-6 py-4 text-[var(--text-secondary)]">

                          {transaction.asset_type}

                        </td>


                        <td className="px-6 py-4">

                          <span
                            className={
                              transaction.transaction_type === 'BUY'
                                ? 'font-medium text-emerald-600 dark:text-emerald-400'
                                : 'font-medium text-red-600 dark:text-red-400'
                            }
                          >
                            {transaction.transaction_type}
                          </span>

                        </td>


                        <td className="px-6 py-4 text-[var(--text-secondary)]">

                          {transaction.quantity}

                        </td>


                        <td className="px-6 py-4 text-[var(--text-secondary)]">

                          {transaction.price}

                        </td>


                        <td className="px-6 py-4 text-[var(--text-secondary)]">

                          {transaction.currency}

                        </td>


                        <td className="px-6 py-4 text-[var(--text-secondary)]">

                          {transaction.broker}

                        </td>


                        <td className="px-6 py-4 font-medium text-[var(--text-primary)]">

                          {transaction.total_value}

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


function StatCard({
  label,
  value,
}) {

  return (
    <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--surface-primary)] p-5 shadow-sm transition-colors duration-200">

      <p className="text-sm text-[var(--text-muted)]">
        {label}
      </p>

      <p className="mt-3 text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
        {value}
      </p>

    </div>
  )
}


function formatDate(date) {

  if (!date) {
    return '—'
  }

  const parsedDate =
    new Date(date)

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
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


export default Transactions
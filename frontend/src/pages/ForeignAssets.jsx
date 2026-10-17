import { useEffect, useState } from 'react'

import {
  ArrowLeft,
  Building2,
  Globe2,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
} from 'lucide-react'

import { useNavigate } from 'react-router-dom'

import api from '../services/api'


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

const formatAssetCurrency = (value, currency = 'USD') => {
  const symbol = currencySymbols[currency] ?? `${currency} `

  return `${symbol}${Number(value ?? 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}


const initialForm = {
  asset_name: '',
  asset_type: 'FOREIGN STOCK',
  country: 'United States',
  institution: '',
  currency: 'USD',
  acquisition_date: '',
  peak_value: '',
  current_value: '',
  dividend_income: '',
  foreign_tax_paid: '',
}


function ForeignAssets() {
  const navigate = useNavigate()

  const [assets, setAssets] = useState([])
  const [summary, setSummary] = useState(null)

  const [form, setForm] =
    useState(initialForm)

  const [editingId, setEditingId] =
    useState(null)

  const [showForm, setShowForm] =
    useState(false)

  const [loading, setLoading] =
    useState(true)

  const [saving, setSaving] =
    useState(false)

  const [error, setError] =
    useState('')

  const [message, setMessage] =
    useState('')


  const loadAssets = async () => {
    try {
      setLoading(true)
      setError('')

      const response =
        await api.get(
          '/foreign-assets/summary'
        )

      setAssets(
        response.data.assets || []
      )

      setSummary(response.data)

    } catch (error) {
      console.error(
        'Failed to load foreign assets:',
        error
      )

      setError(
        error.response?.data?.detail ||
        'Unable to load foreign assets.'
      )

    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    loadAssets()
  }, [])


  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target

    setForm(
      (current) => ({
        ...current,
        [name]: value,
      })
    )
  }


  const resetForm = () => {
    setForm(initialForm)
    setEditingId(null)
    setShowForm(false)
  }


  const handleSubmit = async (
    event
  ) => {
    event.preventDefault()

    setSaving(true)
    setError('')
    setMessage('')

    try {
      const payload = {
        asset_name: form.asset_name,
        asset_type: form.asset_type,
        country: form.country,
        institution: form.institution,
        currency: form.currency,
        acquisition_date:
          form.acquisition_date,
        peak_value:
          Number(form.peak_value),
        current_value:
          Number(form.current_value),
        dividend_income:
          Number(
            form.dividend_income || 0
          ),
        foreign_tax_paid:
          Number(
            form.foreign_tax_paid || 0
          ),
      }


      if (editingId) {
        await api.put(
          `/foreign-assets/${editingId}`,
          payload
        )

        setMessage(
          'Foreign asset updated successfully.'
        )

      } else {
        await api.post(
          '/foreign-assets/',
          payload
        )

        setMessage(
          'Foreign asset added successfully.'
        )
      }


      resetForm()

      await loadAssets()

    } catch (error) {
      console.error(
        'Failed to save foreign asset:',
        error
      )

      setError(
        error.response?.data?.detail ||
        'Unable to save foreign asset.'
      )

    } finally {
      setSaving(false)
    }
  }


  const handleEdit = (asset) => {
    setEditingId(asset.id)

    setForm({
      asset_name:
        asset.asset_name,

      asset_type:
        asset.asset_type,

      country:
        asset.country,

      institution:
        asset.institution,

      currency:
        asset.currency,

      acquisition_date:
        asset.acquisition_date
          ? asset.acquisition_date.slice(
              0,
              10
            )
          : '',

      peak_value:
        String(asset.peak_value),

      current_value:
        String(asset.current_value),

      dividend_income:
        String(
          asset.dividend_income
        ),

      foreign_tax_paid:
        String(
          asset.foreign_tax_paid
        ),
    })

    setShowForm(true)

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }


  const handleDelete = async (
    assetId
  ) => {
    const confirmed =
      window.confirm(
        'Delete this foreign asset?'
      )

    if (!confirmed) {
      return
    }

    try {
      setError('')
      setMessage('')

      await api.delete(
        `/foreign-assets/${assetId}`
      )

      setMessage(
        'Foreign asset deleted successfully.'
      )

      await loadAssets()

    } catch (error) {
      setError(
        error.response?.data?.detail ||
        'Unable to delete foreign asset.'
      )
    }
  }


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
              Compliance
            </p>


            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
              Foreign Assets
            </h1>


            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Track foreign investments and disclosure-related information.
            </p>

          </div>


          <button
            onClick={() => {
              setEditingId(null)
              setForm(initialForm)
              setShowForm(true)
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--text-primary)] px-5 py-3 text-sm font-semibold text-[var(--bg-primary)] transition hover:opacity-85"
          >
            <Plus size={16} />

            Add Foreign Asset
          </button>

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


        {/* Add / Edit Form */}

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mt-8 rounded-2xl border border-[var(--border-primary)] bg-[var(--surface-primary)] p-6 shadow-sm transition-colors duration-200"
          >

            <div className="flex items-center justify-between">

              <div>

                <h2 className="font-semibold text-[var(--text-primary)]">
                  {editingId
                    ? 'Edit Foreign Asset'
                    : 'Add Foreign Asset'}
                </h2>

                <p className="mt-1 text-sm text-[var(--text-muted)]">
                  Enter the asset information used for your compliance analysis.
                </p>

              </div>

            </div>


            <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

              <Input
                label="Asset Name"
                name="asset_name"
                value={form.asset_name}
                onChange={handleChange}
                placeholder="Apple Inc."
                required
              />


              <Select
                label="Asset Type"
                name="asset_type"
                value={form.asset_type}
                onChange={handleChange}
                options={[
                  'FOREIGN STOCK',
                  'RSU',
                  'FOREIGN BANK ACCOUNT',
                  'FOREIGN BROKERAGE',
                  'FOREIGN MUTUAL FUND',
                  'OTHER',
                ]}
              />


              <Input
                label="Country"
                name="country"
                value={form.country}
                onChange={handleChange}
                placeholder="United States"
                required
              />


              <Input
                label="Institution / Broker"
                name="institution"
                value={form.institution}
                onChange={handleChange}
                placeholder="Interactive Brokers"
                required
              />


              <Input
                label="Currency"
                name="currency"
                value={form.currency}
                onChange={handleChange}
                placeholder="USD"
                required
              />


              <Input
                label="Acquisition Date"
                name="acquisition_date"
                type="date"
                value={form.acquisition_date}
                onChange={handleChange}
                required
              />


              <Input
                label="Peak Value"
                name="peak_value"
                type="number"
                min="0"
                step="0.01"
                value={form.peak_value}
                onChange={handleChange}
                placeholder="5000"
                required
              />


              <Input
                label="Current Value"
                name="current_value"
                type="number"
                min="0"
                step="0.01"
                value={form.current_value}
                onChange={handleChange}
                placeholder="4500"
                required
              />


              <Input
                label="Dividend Income"
                name="dividend_income"
                type="number"
                min="0"
                step="0.01"
                value={form.dividend_income}
                onChange={handleChange}
                placeholder="120"
              />


              <Input
                label="Foreign Tax Paid"
                name="foreign_tax_paid"
                type="number"
                min="0"
                step="0.01"
                value={form.foreign_tax_paid}
                onChange={handleChange}
                placeholder="18"
              />

            </div>


            <div className="mt-6 flex justify-end gap-3">

              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-[var(--border-primary)] px-4 py-2.5 text-sm text-[var(--text-secondary)] transition hover:bg-[var(--surface-hover)]"
              >
                Cancel
              </button>


              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-[var(--text-primary)] px-5 py-2.5 text-sm font-semibold text-[var(--bg-primary)] transition hover:opacity-85 disabled:opacity-60"
              >
                {saving
                  ? 'Saving...'
                  : editingId
                    ? 'Update Asset'
                    : 'Save Asset'}
              </button>

            </div>

          </form>
        )}


        {/* Summary */}

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">

          <SummaryCard
            label="Foreign Assets"
            value={
              summary?.total_assets ?? 0
            }
          />


          <SummaryCard
            label="Current Value"
            value={
              summary?.total_current_value
            }
          />


          <SummaryCard
            label="Peak Value"
            value={
              summary?.total_peak_value
            }
          />


          <SummaryCard
            label="Dividend Income"
            value={
              summary?.total_dividend_income
            }
          />

        </div>


        {/* Asset Register */}

        <div className="mt-8 overflow-hidden rounded-2xl border border-[var(--border-primary)] bg-[var(--surface-primary)] shadow-sm transition-colors duration-200">

          <div className="flex items-center justify-between border-b border-[var(--border-primary)] px-6 py-5">

            <div>

              <h2 className="font-semibold text-[var(--text-primary)]">
                Foreign Asset Register
              </h2>

              <p className="mt-1 text-sm text-[var(--text-muted)]">
                Assets currently recorded in CapTax AI.
              </p>

            </div>


            <button
              onClick={loadAssets}
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
                Loading foreign assets...
              </p>

            </div>

          ) : assets.length === 0 ? (

            <div className="px-6 py-20 text-center">

              <Globe2
                size={34}
                className="mx-auto text-[var(--text-muted)]"
              />

              <p className="mt-4 text-[var(--text-secondary)]">
                No foreign assets recorded.
              </p>

              <p className="mt-2 text-sm text-[var(--text-muted)]">
                Add a foreign investment or account to begin.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1150px] text-left text-sm">

                <thead className="border-b border-[var(--border-primary)] bg-[var(--surface-secondary)]">

                  <tr className="text-xs uppercase tracking-wider text-[var(--text-muted)]">

                    <th className="px-6 py-4">
                      Asset
                    </th>

                    <th className="px-6 py-4">
                      Type
                    </th>

                    <th className="px-6 py-4">
                      Country
                    </th>

                    <th className="px-6 py-4">
                      Institution
                    </th>

                    <th className="px-6 py-4">
                      Currency
                    </th>

                    <th className="px-6 py-4">
                      Current Value
                    </th>

                    <th className="px-6 py-4">
                      Peak Value
                    </th>

                    <th className="px-6 py-4">
                      Dividend
                    </th>

                    <th className="px-6 py-4">
                      Tax Paid
                    </th>

                    <th className="px-6 py-4">
                      Actions
                    </th>

                  </tr>

                </thead>


                <tbody className="divide-y divide-[var(--border-secondary)]">

                  {assets.map(
                    (asset) => (

                      <tr
                        key={asset.id}
                        className="transition hover:bg-[var(--surface-hover)]"
                      >

                        <td className="px-6 py-4">

                          <div className="flex items-center gap-3">

                            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-primary)] bg-[var(--surface-secondary)]">

                              <Building2
                                size={16}
                                className="text-[var(--accent)]"
                              />

                            </div>


                            <span className="font-semibold text-[var(--text-primary)]">
                              {asset.asset_name}
                            </span>

                          </div>

                        </td>


                        <td className="px-6 py-4 text-[var(--text-secondary)]">
                          {asset.asset_type}
                        </td>


                        <td className="px-6 py-4 text-[var(--text-secondary)]">
                          {asset.country}
                        </td>


                        <td className="px-6 py-4 text-[var(--text-secondary)]">
                          {asset.institution}
                        </td>


                        <td className="px-6 py-4 text-[var(--text-secondary)]">
                          {asset.currency}
                        </td>


                        <td className="px-6 py-4 font-medium text-[var(--text-primary)]">
                          {formatAssetCurrency(asset.current_value, asset.currency)}
                        </td>


                        <td className="px-6 py-4 text-[var(--text-secondary)]">
                          {formatAssetCurrency(asset.peak_value, asset.currency)}
                        </td>


                        <td className="px-6 py-4 text-emerald-600 dark:text-emerald-400">
                          {formatAssetCurrency(asset.dividend_income, asset.currency)}
                        </td>


                        <td className="px-6 py-4 text-[var(--text-secondary)]">
                          {formatAssetCurrency(asset.foreign_tax_paid, asset.currency)}
                        </td>


                        <td className="px-6 py-4">

                          <div className="flex items-center gap-2">

                            <button
                              onClick={() =>
                                handleEdit(asset)
                              }
                              className="rounded-lg border border-[var(--border-primary)] p-2 text-[var(--text-secondary)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
                              title="Edit"
                            >
                              <Pencil
                                size={15}
                              />
                            </button>


                            <button
                              onClick={() =>
                                handleDelete(
                                  asset.id
                                )
                              }
                              className="rounded-lg border border-red-500/10 p-2 text-red-500 transition hover:bg-red-500/10"
                              title="Delete"
                            >
                              <Trash2
                                size={15}
                              />
                            </button>

                          </div>

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


function Input({
  label,
  ...props
}) {

  return (
    <label className="block">

      <span className="mb-2 block text-sm text-[var(--text-secondary)]">
        {label}
      </span>


      <input
        {...props}
        className="w-full rounded-lg border border-[var(--border-primary)] bg-[var(--surface-secondary)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]/50"
      />

    </label>
  )
}


function Select({
  label,
  options,
  ...props
}) {

  return (
    <label className="block">

      <span className="mb-2 block text-sm text-[var(--text-secondary)]">
        {label}
      </span>


      <select
        {...props}
        className="w-full rounded-lg border border-[var(--border-primary)] bg-[var(--surface-secondary)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)]/50"
      >

        {options.map(
          (option) => (
            <option
              key={option}
              value={option}
            >
              {option}
            </option>
          )
        )}

      </select>

    </label>
  )
}


function SummaryCard({
  label,
  value,
}) {

  return (
    <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--surface-primary)] p-5 shadow-sm transition-colors duration-200">

      <p className="text-sm text-[var(--text-muted)]">
        {label}
      </p>

      <p className="mt-3 text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
        {value === undefined ||
        value === null
          ? '0.00'
          : Number(value).toFixed(2)}
      </p>

    </div>
  )
}


export default ForeignAssets
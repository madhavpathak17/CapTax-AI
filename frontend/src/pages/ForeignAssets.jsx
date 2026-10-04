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

  const [form, setForm] = useState(
    initialForm
  )

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
    <div className="min-h-screen bg-[#080a0c] px-6 py-10 text-white lg:px-10">

      <div className="mx-auto max-w-7xl">

        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

          <div>

            <button
              onClick={() =>
                navigate('/dashboard')
              }
              className="mb-5 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
            >
              <ArrowLeft size={16} />

              Back to Dashboard
            </button>

            <p className="text-sm font-medium text-emerald-400">
              Compliance
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Foreign Assets
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Track foreign investments and disclosure-related information.
            </p>

          </div>


          <button
            onClick={() => {
              setEditingId(null)
              setForm(initialForm)
              setShowForm(true)
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-[#080a0c] transition hover:bg-slate-200"
          >
            <Plus size={16} />

            Add Foreign Asset
          </button>

        </div>


        {message && (
          <div className="mt-6 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-4 text-sm text-emerald-300">
            {message}
          </div>
        )}


        {error && (
          <div className="mt-6 rounded-xl border border-red-400/20 bg-red-400/10 px-5 py-4 text-sm text-red-300">
            {error}
          </div>
        )}


        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6"
          >

            <div className="flex items-center justify-between">

              <div>

                <h2 className="font-semibold">
                  {editingId
                    ? 'Edit Foreign Asset'
                    : 'Add Foreign Asset'}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
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
                className="rounded-lg border border-white/10 px-4 py-2.5 text-sm text-slate-300 transition hover:bg-white/[0.05]"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-[#080a0c] transition hover:bg-slate-200 disabled:opacity-60"
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


        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">

          <SummaryCard
            label="Foreign Assets"
            value={
              summary?.total_assets ?? 0
            }
          />

          <SummaryCard
            label="Current Value"
            value={summary?.total_current_value}
          />

          <SummaryCard
            label="Peak Value"
            value={summary?.total_peak_value}
          />

          <SummaryCard
            label="Dividend Income"
            value={summary?.total_dividend_income}
          />

        </div>


        <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">

          <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">

            <div>

              <h2 className="font-semibold">
                Foreign Asset Register
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Assets currently recorded in CapTax AI.
              </p>

            </div>

            <button
              onClick={loadAssets}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-300 transition hover:bg-white/[0.08]"
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
                className="mx-auto animate-spin text-slate-500"
              />

              <p className="mt-3 text-sm text-slate-500">
                Loading foreign assets...
              </p>

            </div>

          ) : assets.length === 0 ? (

            <div className="px-6 py-20 text-center">

              <Globe2
                size={34}
                className="mx-auto text-slate-600"
              />

              <p className="mt-4 text-slate-300">
                No foreign assets recorded.
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Add a foreign investment or account to begin.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1150px] text-left text-sm">

                <thead className="border-b border-white/10 bg-white/[0.02]">

                  <tr className="text-xs uppercase tracking-wider text-slate-500">

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


                <tbody className="divide-y divide-white/[0.06]">

                  {assets.map(
                    (asset) => (

                      <tr
                        key={asset.id}
                        className="transition hover:bg-white/[0.025]"
                      >

                        <td className="px-6 py-4">

                          <div className="flex items-center gap-3">

                            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">

                              <Building2
                                size={16}
                                className="text-emerald-400"
                              />

                            </div>

                            <span className="font-semibold text-white">
                              {asset.asset_name}
                            </span>

                          </div>

                        </td>

                        <td className="px-6 py-4 text-slate-400">
                          {asset.asset_type}
                        </td>

                        <td className="px-6 py-4 text-slate-400">
                          {asset.country}
                        </td>

                        <td className="px-6 py-4 text-slate-400">
                          {asset.institution}
                        </td>

                        <td className="px-6 py-4 text-slate-400">
                          {asset.currency}
                        </td>

                        <td className="px-6 py-4 font-medium text-slate-300">
                          {asset.current_value.toFixed(2)}
                        </td>

                        <td className="px-6 py-4 text-slate-300">
                          {asset.peak_value.toFixed(2)}
                        </td>

                        <td className="px-6 py-4 text-emerald-400">
                          {asset.dividend_income.toFixed(2)}
                        </td>

                        <td className="px-6 py-4 text-slate-300">
                          {asset.foreign_tax_paid.toFixed(2)}
                        </td>

                        <td className="px-6 py-4">

                          <div className="flex items-center gap-2">

                            <button
                              onClick={() =>
                                handleEdit(asset)
                              }
                              className="rounded-lg border border-white/10 p-2 text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
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
                              className="rounded-lg border border-red-400/10 p-2 text-red-400 transition hover:bg-red-400/10"
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

      <span className="mb-2 block text-sm text-slate-400">
        {label}
      </span>

      <input
        {...props}
        className="w-full rounded-lg border border-white/10 bg-[#0b0d0f] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/40"
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

      <span className="mb-2 block text-sm text-slate-400">
        {label}
      </span>

      <select
        {...props}
        className="w-full rounded-lg border border-white/10 bg-[#0b0d0f] px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-400/40"
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
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

      <p className="text-sm text-slate-500">
        {label}
      </p>

      <p className="mt-3 text-2xl font-semibold tracking-tight text-white">
        {value === undefined ||
        value === null
          ? '0.00'
          : Number(value).toFixed(2)}
      </p>

    </div>
  )
}


export default ForeignAssets
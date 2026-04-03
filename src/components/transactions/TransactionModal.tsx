import { useState, useEffect } from 'react'
import { RiCloseLine } from '@remixicon/react'
import { cn } from '@/utils/helpers'
import { Button } from '@/components/ui'
import { useStore } from '@/store/useStore'
import type { Transaction, TransactionCategory, TransactionMethod, TransactionStatus, TransactionType } from '@/types'
// Async store handles optimistic updates and API calls

interface Props {
  open: boolean
  onClose: () => void
  transaction?: Transaction | null
}

const emptyForm = {
  name: '',
  description: '',
  amount: '',
  type: 'expense' as TransactionType,
  category: 'other' as TransactionCategory,
  method: 'card' as TransactionMethod,
  status: 'completed' as TransactionStatus,
  date: new Date().toISOString().split('T')[0],
  account: 'Main Checking ••3421',
}

const categories: TransactionCategory[] = [
  'salary', 'investment', 'rent', 'utilities', 'food', 'shopping',
  'transport', 'entertainment', 'healthcare', 'education', 'other',
]

const methods: TransactionMethod[] = ['wire', 'ach', 'transfer', 'card']

export default function TransactionModal({ open, onClose, transaction }: Props) {
  const { addTransaction, updateTransaction } = useStore()
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (transaction) {
      setForm({
        name: transaction.name,
        description: transaction.description,
        amount: String(transaction.amount),
        type: transaction.type,
        category: transaction.category,
        method: transaction.method,
        status: transaction.status,
        date: transaction.date,
        account: transaction.account,
      })
    } else {
      setForm(emptyForm)
    }
    setErrors({})
  }, [transaction, open])

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)
      e.amount = 'Enter a valid positive amount'
    if (!form.date) e.date = 'Date is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      amount: Number(form.amount),
      type: form.type,
      category: form.category,
      method: form.method,
      status: form.status,
      date: form.date,
      account: form.account,
    }
    if (transaction) {
      updateTransaction(transaction.id, payload)
    } else {
      addTransaction(payload)
    }
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-bg-strong-950/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl bg-bg-white-0 shadow-regular-lg ring-1 ring-stroke-soft-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stroke-soft-200">
          <h2 className="text-label-md text-text-strong-950">
            {transaction ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-xl text-text-soft-400 hover:bg-bg-weak-50 hover:text-text-strong-950 transition-colors"
          >
            <RiCloseLine className="size-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Name */}
          <Field label="Transaction Name" error={errors.name}>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Monthly Salary"
              className={inputCls(!!errors.name)}
            />
          </Field>

          {/* Description */}
          <Field label="Description">
            <input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Optional note"
              className={inputCls(false)}
            />
          </Field>

          {/* Amount + Type */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Amount ($)" error={errors.amount}>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="0.00"
                className={inputCls(!!errors.amount)}
              />
            </Field>
            <Field label="Type">
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as TransactionType })}
                className={inputCls(false)}
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </Field>
          </div>

          {/* Category + Method */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Category">
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as TransactionCategory })}
                className={inputCls(false)}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </Field>
            <Field label="Method">
              <select
                value={form.method}
                onChange={(e) => setForm({ ...form, method: e.target.value as TransactionMethod })}
                className={inputCls(false)}
              >
                {methods.map((m) => (
                  <option key={m} value={m}>{m.toUpperCase()}</option>
                ))}
              </select>
            </Field>
          </div>

          {/* Date + Status */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date" error={errors.date}>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className={inputCls(!!errors.date)}
              />
            </Field>
            <Field label="Status">
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as TransactionStatus })}
                className={inputCls(false)}
              >
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </Field>
          </div>

          {/* Account */}
          <Field label="Account">
            <select
              value={form.account}
              onChange={(e) => setForm({ ...form, account: e.target.value })}
              className={inputCls(false)}
            >
              <option value="Main Checking ••3421">Main Checking ••3421</option>
              <option value="Visa ••8832">Visa ••8832</option>
              <option value="Investment ••7710">Investment ••7710</option>
            </select>
          </Field>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-stroke-soft-200">
          <Button variant="neutral" mode="stroke" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" mode="filled" size="md" onClick={handleSubmit}>
            {transaction ? 'Save Changes' : 'Add Transaction'}
          </Button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-label-xs text-text-sub-600">{label}</label>
      {children}
      {error && <p className="text-paragraph-xs text-error-base">{error}</p>}
    </div>
  )
}

function inputCls(hasError: boolean) {
  return cn(
    'w-full h-9 rounded-xl border px-3 text-paragraph-sm text-text-strong-950 bg-bg-white-0 outline-none transition-colors',
    'focus:border-primary-base focus:ring-2 focus:ring-primary-base/10',
    hasError ? 'border-error-base' : 'border-stroke-soft-200',
  )
}

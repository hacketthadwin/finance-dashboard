import { useEffect, useState } from 'react'
import {
  RiSearchLine, RiFilterLine, RiAddLine,
  RiDownloadLine, RiCloseLine, RiSortAsc, RiSortDesc, RiRefreshLine,
} from '@remixicon/react'
import { useStore, useFilteredTransactions } from '@/store/useStore'
import { Button, WidgetBox, Divider, EmptyState } from '@/components/ui'
import { TransactionListSkeleton, ErrorState, ShimmerStyles } from '@/components/ui/Skeletons'
import TransactionRow from '@/components/transactions/TransactionRow'
import TransactionModal from '@/components/transactions/TransactionModal'
import { currencyFormatter, cn } from '@/utils/helpers'
import type { Transaction } from '@/types'

const CATEGORIES = [
  'all','salary','investment','rent','utilities','food',
  'shopping','transport','entertainment','healthcare','education','other',
]
const STATUSES = ['all','completed','pending','failed']

function exportToCSV(transactions: Transaction[]) {
  const headers = ['ID','Name','Description','Amount','Type','Category','Method','Status','Date','Account']
  const rows = transactions.map((t) =>
    [t.id,t.name,t.description,t.amount,t.type,t.category,t.method,t.status,t.date,t.account].join(',')
  )
  const csv = [headers.join(','), ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url; a.download = 'transactions.csv'; a.click()
  URL.revokeObjectURL(url)
}

export default function TransactionsPage() {
  const { role, filters, setFilter, resetFilters, txStatus, txError, loadTransactions } = useStore()
  const filtered = useFilteredTransactions()
  const [modalOpen, setModalOpen] = useState(false)
  const [editTx, setEditTx] = useState<Transaction | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [page, setPage] = useState(1)
  const pageSize = 10

  useEffect(() => { loadTransactions() }, [loadTransactions])

  const totalPages = Math.ceil(filtered.length / pageSize)
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize)
  const totalIncome  = filtered.filter((t) => t.type === 'income').reduce((s,t) => s + t.amount, 0)
  const totalExpense = filtered.filter((t) => t.type === 'expense').reduce((s,t) => s + t.amount, 0)
  const hasActiveFilters = filters.search || filters.type !== 'all' || filters.category !== 'all' || filters.status !== 'all'

  const openAdd  = () => { setEditTx(null);  setModalOpen(true) }
  const openEdit = (t: Transaction) => { setEditTx(t); setModalOpen(true) }

  const isLoading = txStatus === 'idle' || txStatus === 'loading'

  return (
    <div className="space-y-4">
      <ShimmerStyles />

      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <SummaryPill label="Total Records" value={String(filtered.length)} />
        <SummaryPill label="Income"   value={currencyFormatter.format(totalIncome)}  color="text-success-base" />
        <SummaryPill label="Expenses" value={currencyFormatter.format(totalExpense)} color="text-error-base" />
        <SummaryPill
          label="Net"
          value={currencyFormatter.format(totalIncome - totalExpense)}
          color={totalIncome - totalExpense >= 0 ? 'text-success-base' : 'text-error-base'}
        />
      </div>

      <WidgetBox className="space-y-4">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[180px]">
            <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-soft-400" />
            <input
              value={filters.search}
              onChange={(e) => { setFilter('search', e.target.value); setPage(1) }}
              placeholder="Search transactions…"
              className="h-9 w-full rounded-xl border border-stroke-soft-200 bg-bg-white-0 pl-9 pr-3 text-paragraph-sm text-text-strong-950 outline-none focus:border-primary-base focus:ring-2 focus:ring-primary-base/10 transition-colors"
            />
            {filters.search && (
              <button onClick={() => setFilter('search','')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-soft-400 hover:text-text-strong-950">
                <RiCloseLine className="size-4" />
              </button>
            )}
          </div>

          {/* Type tabs */}
          <div className="flex items-center rounded-xl border border-stroke-soft-200 bg-bg-weak-50 p-0.5">
            {(['all','income','expense'] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setFilter('type', t); setPage(1) }}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-label-xs capitalize transition-all duration-150',
                  filters.type === t
                    ? 'bg-bg-white-0 text-text-strong-950 shadow-regular-xs'
                    : 'text-text-soft-400 hover:text-text-sub-600',
                )}
              >{t === 'all' ? 'All' : t}</button>
            ))}
          </div>

          <Button
            variant="neutral" mode="stroke" size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(hasActiveFilters && 'border-primary-base text-primary-base')}
          >
            <RiFilterLine className="size-4" /> Filters
            {hasActiveFilters && (
              <span className="flex size-4 items-center justify-center rounded-full bg-primary-base text-white text-[10px]">!</span>
            )}
          </Button>

          <Button variant="neutral" mode="stroke" size="sm"
            onClick={() => setFilter('sortDir', filters.sortDir === 'asc' ? 'desc' : 'asc')}>
            {filters.sortDir === 'asc' ? <RiSortAsc className="size-4" /> : <RiSortDesc className="size-4" />}
          </Button>

          <div className="flex-1" />

          {/* Retry button if errored */}
          {txStatus === 'error' && (
            <Button variant="neutral" mode="stroke" size="sm" onClick={loadTransactions}>
              <RiRefreshLine className="size-4" /> Retry
            </Button>
          )}

          <Button variant="neutral" mode="stroke" size="sm" onClick={() => exportToCSV(filtered)}>
            <RiDownloadLine className="size-4" />
            <span className="hidden sm:inline">Export CSV</span>
          </Button>

          {role === 'admin' && (
            <Button variant="primary" mode="filled" size="sm" onClick={openAdd}>
              <RiAddLine className="size-4" /> Add
            </Button>
          )}
        </div>

        {/* Expanded filters */}
        {showFilters && (
          <div className="flex flex-wrap items-end gap-3 rounded-xl border border-stroke-soft-200 bg-bg-weak-50 p-3">
            <FilterSelect label="Category" value={filters.category} onChange={(v) => { setFilter('category',v); setPage(1) }} options={CATEGORIES} />
            <FilterSelect label="Status"   value={filters.status}   onChange={(v) => { setFilter('status',v);   setPage(1) }} options={STATUSES} />
            <FilterSelect label="Sort By"  value={filters.sortBy}   onChange={(v) => setFilter('sortBy',v)}                  options={['date','amount','name']} />
            {hasActiveFilters && (
              <Button variant="neutral" mode="ghost" size="sm" onClick={() => { resetFilters(); setPage(1) }}>
                <RiCloseLine className="size-4" /> Clear all
              </Button>
            )}
          </div>
        )}

        <Divider />

        {/* Content */}
        {isLoading ? (
          <TransactionListSkeleton rows={8} />
        ) : txStatus === 'error' ? (
          <ErrorState message={txError ?? ''} onRetry={loadTransactions} />
        ) : paginated.length === 0 ? (
          <EmptyState
            title="No transactions found"
            description={hasActiveFilters ? 'Try adjusting your filters' : 'Add your first transaction'}
            action={
              hasActiveFilters
                ? <Button variant="neutral" mode="stroke" size="sm" onClick={resetFilters}>Clear Filters</Button>
                : role === 'admin'
                  ? <Button variant="primary" mode="filled" size="sm" onClick={openAdd}><RiAddLine className="size-4" />Add Transaction</Button>
                  : undefined
            }
          />
        ) : (
          <div className="space-y-0.5">
            {paginated.map((t) => (
              <TransactionRow key={t.id} transaction={t} onEdit={openEdit} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && !isLoading && (
          <div className="flex items-center justify-between pt-2">
            <span className="text-paragraph-xs text-text-soft-400">
              Page {page} of {totalPages} · {filtered.length} records
            </span>
            <div className="flex items-center gap-2">
              <Button variant="neutral" mode="stroke" size="xs" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => setPage(p)}
                    className={cn('flex size-7 items-center justify-center rounded-lg text-label-xs transition-colors',
                      p === page ? 'bg-primary-base text-white' : 'text-text-sub-600 hover:bg-bg-weak-50')}>
                    {p}
                  </button>
                ))}
                {totalPages > 5 && <span className="text-text-soft-400 text-label-xs px-1">…</span>}
              </div>
              <Button variant="neutral" mode="stroke" size="xs" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</Button>
            </div>
          </div>
        )}
      </WidgetBox>

      <TransactionModal open={modalOpen} onClose={() => setModalOpen(false)} transaction={editTx} />
    </div>
  )
}

function SummaryPill({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="rounded-2xl bg-bg-white-0 px-4 py-3 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200">
      <div className="text-paragraph-xs text-text-soft-400">{label}</div>
      <div className={cn('mt-1 text-label-md text-text-strong-950', color)}>{value}</div>
    </div>
  )
}

function FilterSelect({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: string[]
}) {
  return (
    <div className="space-y-1">
      <label className="text-label-xs text-text-soft-400">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="h-8 rounded-xl border border-stroke-soft-200 bg-bg-white-0 px-2.5 text-paragraph-xs text-text-strong-950 outline-none focus:border-primary-base cursor-pointer">
        {options.map((o) => (
          <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>
        ))}
      </select>
    </div>
  )
}

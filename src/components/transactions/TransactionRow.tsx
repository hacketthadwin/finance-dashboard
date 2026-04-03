import {
  RiBankLine, RiLineChartLine, RiHomeSmileFill,
  RiShoppingBag3Line, RiFlashlightLine, RiCarLine,
  RiFilmLine, RiHeartPulseLine, RiBookLine, RiMore2Line,
  RiPencilLine, RiDeleteBinLine, RiArrowUpLine, RiArrowDownLine,
} from '@remixicon/react'
import { cn, currencyFormatter, formatDate } from '@/utils/helpers'
import { Badge, StatusBadge } from '@/components/ui'
import type { Transaction } from '@/types'
import { useStore } from '@/store/useStore'
import { useState } from 'react'

const categoryConfig: Record<string, { icon: React.ElementType; bg: string; color: string }> = {
  salary: { icon: RiBankLine, bg: 'bg-success-lighter', color: 'text-success-base' },
  investment: { icon: RiLineChartLine, bg: 'bg-information-lighter', color: 'text-information-base' },
  rent: { icon: RiHomeSmileFill, bg: 'bg-verified-lighter', color: 'text-verified-base' },
  shopping: { icon: RiShoppingBag3Line, bg: 'bg-feature-lighter', color: 'text-feature-base' },
  utilities: { icon: RiFlashlightLine, bg: 'bg-away-lighter', color: 'text-away-base' },
  transport: { icon: RiCarLine, bg: 'bg-faded-lighter', color: 'text-faded-base' },
  entertainment: { icon: RiFilmLine, bg: 'bg-warning-lighter', color: 'text-warning-base' },
  healthcare: { icon: RiHeartPulseLine, bg: 'bg-error-lighter', color: 'text-error-base' },
  education: { icon: RiBookLine, bg: 'bg-highlighted-lighter', color: 'text-highlighted-base' },
  food: { icon: RiShoppingBag3Line, bg: 'bg-information-lighter', color: 'text-information-base' },
  other: { icon: RiBankLine, bg: 'bg-bg-weak-50', color: 'text-text-sub-600' },
}

interface Props {
  transaction: Transaction
  onEdit?: (t: Transaction) => void
  compact?: boolean
}

export default function TransactionRow({ transaction, onEdit, compact = false }: Props) {
  const { role, deleteTransaction } = useStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const cfg = categoryConfig[transaction.category] ?? categoryConfig.other
  const Icon = cfg.icon
  const isIncome = transaction.type === 'income'

  return (
    <div className={cn(
      'group flex items-center gap-3 rounded-xl transition-all duration-200 hover:bg-bg-weak-50',
      compact ? 'py-2 px-2' : 'py-2.5 px-3',
    )}>
      {/* Icon */}
      <div className={cn('flex shrink-0 items-center justify-center rounded-full shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200', cfg.bg, compact ? 'size-9' : 'size-10')}>
        <Icon className={cn('shrink-0', cfg.color, compact ? 'size-4' : 'size-5')} />
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className={cn('truncate font-medium text-text-strong-950', compact ? 'text-paragraph-xs' : 'text-label-sm')}>
            {transaction.name}
          </p>
          {!compact && <StatusBadge status={transaction.status} />}
        </div>
        <p className={cn('truncate text-text-soft-400', compact ? 'text-[10px]' : 'text-paragraph-xs')}>
          {compact ? formatDate(transaction.date) : transaction.description}
        </p>
      </div>

      {/* Amount */}
      <div className="shrink-0 text-right">
        <p className={cn(
          'font-medium tabular-nums',
          compact ? 'text-paragraph-xs' : 'text-label-sm',
          isIncome ? 'text-success-base' : 'text-text-strong-950',
        )}>
          {isIncome ? '+' : '-'}{currencyFormatter.format(transaction.amount)}
        </p>
        {!compact && (
          <p className="text-paragraph-xs text-text-soft-400">{formatDate(transaction.date)}</p>
        )}
      </div>

      {/* Actions - admin only */}
      {!compact && role === 'admin' && (
        <div className="relative shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex size-7 items-center justify-center rounded-lg text-text-soft-400 hover:bg-bg-soft-200 hover:text-text-strong-950 transition-colors"
          >
            <RiMore2Line className="size-4" />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-8 z-20 w-36 rounded-xl bg-bg-white-0 shadow-regular-lg ring-1 ring-stroke-soft-200 overflow-hidden">
                <button
                  onClick={() => { onEdit?.(transaction); setMenuOpen(false) }}
                  className="flex w-full items-center gap-2 px-3 py-2.5 text-paragraph-sm text-text-sub-600 hover:bg-bg-weak-50 transition-colors"
                >
                  <RiPencilLine className="size-4" /> Edit
                </button>
                <button
                  onClick={() => { deleteTransaction(transaction.id); setMenuOpen(false) }}
                  className="flex w-full items-center gap-2 px-3 py-2.5 text-paragraph-sm text-error-base hover:bg-error-lighter transition-colors"
                >
                  <RiDeleteBinLine className="size-4" /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

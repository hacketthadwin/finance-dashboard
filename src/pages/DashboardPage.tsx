import { useEffect, useState } from 'react'
import {
  RiArrowUpLine, RiArrowDownLine, RiWalletLine,
  RiRefund2Line, RiAddLine, RiArrowRightLine, RiRefreshLine,
} from '@remixicon/react'
import { Link } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { useApi } from '@/api/useApi'
import {
  fetchDashboardStats, fetchBalanceTrend,
  fetchMonthlyData, fetchCategorySpend,
} from '@/api/mockApi'
import { BalanceTrendChart, BudgetBarChart, SpendingPieChart, SparkLine } from '@/components/charts'
import { StatCard, WidgetBox, WidgetHeader, WidgetTitle, Badge, Divider, Button, EmptyState } from '@/components/ui'
import {
  ShimmerStyles, StatCardSkeleton, WidgetSkeleton,
  TransactionListSkeleton, ErrorState,
} from '@/components/ui/Skeletons'
import TransactionRow from '@/components/transactions/TransactionRow'
import TransactionModal from '@/components/transactions/TransactionModal'
import { currencyFormatter } from '@/utils/helpers'
import type { Transaction } from '@/types'

const LEGEND_COLORS = ['#3b82f6','#8b5cf6','#f59e0b','#10b981','#ef4444','#06b6d4','#f97316']

const incomeSparkData = [4100,6800,5200,7100,6400,8200,7600,8820]
const expenseSparkData = [3200,4800,3100,5200,4900,4100,4200,4362]

export default function DashboardPage() {
  const { transactions, txStatus, txError, loadTransactions, role } = useStore()
  const [modalOpen, setModalOpen] = useState(false)
  const [editTx, setEditTx] = useState<Transaction | null>(null)

  // Load transactions via async API on mount
  useEffect(() => { loadTransactions() }, [loadTransactions])

  // Async chart data
  const stats    = useApi(fetchDashboardStats)
  const trend    = useApi(fetchBalanceTrend)
  const monthly  = useApi(fetchMonthlyData)
  const catSpend = useApi(fetchCategorySpend)

  const recent = transactions.slice(0, 5)

  const spendPieData = (catSpend.data ?? []).map((c, i) => ({
    ...c, color: LEGEND_COLORS[i % LEGEND_COLORS.length],
  }))

  const openEdit = (t: Transaction) => { setEditTx(t); setModalOpen(true) }
  const openAdd  = () => { setEditTx(null); setModalOpen(true) }

  return (
    <div className="space-y-5">
      <ShimmerStyles />

      {/* ── Stat Cards ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.isLoading ? (
          <>
            <StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton />
          </>
        ) : stats.isError ? (
          <div className="col-span-full">
            <ErrorState message={stats.error ?? ''} onRetry={stats.refetch} />
          </div>
        ) : (
          <>
            <StatCard
              label="Total Balance"
              value={currencyFormatter.format(stats.data!.totalBalance)}
              change={stats.data!.balanceChange}
              icon={<RiWalletLine className="size-5 text-primary-base" />}
              iconBg="bg-primary-lighter"
              chart={<SparkLine data={trend.data?.map(b => b.balance) ?? []} />}
            />
            <StatCard
              label="Total Income"
              value={currencyFormatter.format(stats.data!.totalIncome)}
              change={stats.data!.incomeChange}
              icon={<RiArrowDownLine className="size-5 text-success-base" />}
              iconBg="bg-success-lighter"
              chart={<SparkLine data={incomeSparkData} color="#22c55e" />}
            />
            <StatCard
              label="Total Expenses"
              value={currencyFormatter.format(stats.data!.totalExpenses)}
              change={stats.data!.expensesChange}
              icon={<RiArrowUpLine className="size-5 text-error-base" />}
              iconBg="bg-error-lighter"
              chart={<SparkLine data={expenseSparkData} color="#ef4444" />}
            />
          </>
        )}
      </div>

      {/* ── Balance Trend + Spending ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <WidgetBox className="lg:col-span-2">
          <WidgetHeader>
            <RiArrowUpLine className="size-5 text-text-sub-600 shrink-0" />
            <WidgetTitle>Balance Trend</WidgetTitle>
            <span className="text-paragraph-xs text-text-soft-400">Last 9 months</span>
          </WidgetHeader>
          <Divider className="mb-4" />
          {trend.isLoading ? (
            <div className="h-[120px] animate-pulse rounded-xl bg-bg-soft-200" />
          ) : trend.isError ? (
            <ErrorState onRetry={trend.refetch} />
          ) : (
            <BalanceTrendChart data={trend.data!} />
          )}
        </WidgetBox>

        <WidgetBox>
          <WidgetHeader>
            <RiRefund2Line className="size-5 text-text-sub-600 shrink-0" />
            <WidgetTitle>Spending</WidgetTitle>
          </WidgetHeader>
          <Divider className="mb-4" />
          {catSpend.isLoading ? (
            <div className="h-[200px] animate-pulse rounded-xl bg-bg-soft-200" />
          ) : catSpend.isError ? (
            <ErrorState onRetry={catSpend.refetch} />
          ) : (
            <>
              <SpendingPieChart data={spendPieData} />
              <div className="mt-3 space-y-1.5">
                {spendPieData.slice(0, 4).map((item) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="flex-1 text-paragraph-xs text-text-sub-600 truncate">{item.name}</span>
                    <span className="text-label-xs text-text-strong-950">{currencyFormatter.format(item.value)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </WidgetBox>
      </div>

      {/* ── Budget Overview ─────────────────────────────────────────────────── */}
      <WidgetBox>
        <WidgetHeader>
          <WidgetTitle>Budget Overview</WidgetTitle>
          <div className="hidden sm:flex items-center gap-4">
            <LegendDot color="#3b82f6" label="Income" />
            <LegendDot color="#f59e0b" label="Expenses" />
          </div>
        </WidgetHeader>
        <Divider className="mb-4" />
        {monthly.isLoading ? (
          <div className="h-[220px] animate-pulse rounded-xl bg-bg-soft-200" />
        ) : monthly.isError ? (
          <ErrorState onRetry={monthly.refetch} />
        ) : (
          <>
            <div className="flex flex-wrap gap-6 mb-4">
              <SumItem label="Total Income"   value={currencyFormatter.format(96000)} change="+5%"  changeColor="text-success-base" />
              <SumItem label="Total Expenses" value={currencyFormatter.format(24000)} change="-3%"  changeColor="text-error-base" />
              <SumItem label="Net Savings"    value={currencyFormatter.format(72000)} />
            </div>
            <BudgetBarChart data={monthly.data!} />
          </>
        )}
      </WidgetBox>

      {/* ── Recent Transactions ─────────────────────────────────────────────── */}
      <WidgetBox>
        <WidgetHeader>
          <RiRefund2Line className="size-5 text-text-sub-600 shrink-0" />
          <WidgetTitle>Recent Transactions</WidgetTitle>
          <div className="flex items-center gap-2">
            {role === 'admin' && (
              <Button variant="primary" mode="filled" size="xs" onClick={openAdd}>
                <RiAddLine className="size-3.5" /> Add
              </Button>
            )}
            <Link to="/transactions">
              <Button variant="neutral" mode="stroke" size="xs">
                See All <RiArrowRightLine className="size-3.5" />
              </Button>
            </Link>
          </div>
        </WidgetHeader>
        <Divider />

        {txStatus === 'loading' || txStatus === 'idle' ? (
          <div className="mt-2"><TransactionListSkeleton rows={5} /></div>
        ) : txStatus === 'error' ? (
          <ErrorState message={txError ?? ''} onRetry={loadTransactions} />
        ) : recent.length === 0 ? (
          <EmptyState
            title="No transactions yet"
            description="Add your first transaction to get started"
            action={role === 'admin' ? (
              <Button variant="primary" mode="filled" size="sm" onClick={openAdd}>
                <RiAddLine className="size-4" /> Add Transaction
              </Button>
            ) : undefined}
          />
        ) : (
          <div className="mt-2 space-y-0.5">
            {recent.map((t) => (
              <TransactionRow key={t.id} transaction={t} onEdit={openEdit} compact />
            ))}
          </div>
        )}
      </WidgetBox>

      <TransactionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        transaction={editTx}
      />
    </div>
  )
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-paragraph-xs text-text-sub-600">
      <span className="size-2 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </div>
  )
}

function SumItem({ label, value, change, changeColor }: {
  label: string; value: string; change?: string; changeColor?: string
}) {
  return (
    <div>
      <div className="text-subheading-xs text-text-soft-400 uppercase mb-0.5">{label}</div>
      <div className="flex items-center gap-2">
        <span className="text-label-md text-text-strong-950">{value}</span>
        {change && <span className={`text-label-xs ${changeColor}`}>{change}</span>}
      </div>
    </div>
  )
}

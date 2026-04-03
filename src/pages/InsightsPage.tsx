import { useEffect } from 'react'
import {
  RiLineChartLine, RiShoppingBag3Line, RiArrowUpLine, RiArrowDownLine,
  RiLightbulbLine, RiTrophyLine, RiAlertLine, RiCheckLine,
} from '@remixicon/react'
import { useStore } from '@/store/useStore'
import { useApi } from '@/api/useApi'
import {
  fetchMonthlyData, fetchCategorySpend, fetchInsights,
} from '@/api/mockApi'
import { WidgetBox, WidgetHeader, WidgetTitle, Badge, Divider } from '@/components/ui'
import { SpendingPieChart, MonthlyComparisonChart, MajorExpensesChart } from '@/components/charts'
import {
  ShimmerStyles, KPICardSkeleton, WidgetSkeleton, ErrorState,
} from '@/components/ui/Skeletons'
import { currencyFormatter, cn } from '@/utils/helpers'

const LEGEND_COLORS = ['#3b82f6','#8b5cf6','#f59e0b','#10b981','#ef4444','#06b6d4','#f97316']

const majorExpenses = [
  { name: 'Shopping',   value: 210.00, color: '#8b5cf6' },
  { name: 'Utilities',  value: 206.50, color: '#10b981' },
  { name: 'Healthcare', value: 205.00, color: '#ef4444' },
  { name: 'Food & Dining', value: 175.27, color: '#3b82f6' },
  { name: 'Transport',  value: 38.50,  color: '#06b6d4' },
]

export default function InsightsPage() {
  const { transactions, loadTransactions } = useStore()

  useEffect(() => { loadTransactions() }, [loadTransactions])

  const monthly  = useApi(fetchMonthlyData)
  const catSpend = useApi(fetchCategorySpend)
  const insightQ = useApi(fetchInsights)

  const spendPieData = (catSpend.data ?? []).map((c, i) => ({
    ...c, color: LEGEND_COLORS[i % LEGEND_COLORS.length],
  }))

  const totalIncome  = transactions.filter((t) => t.type === 'income').reduce((s,t) => s + t.amount, 0)
  const totalExpense = transactions.filter((t) => t.type === 'expense').reduce((s,t) => s + t.amount, 0)
  const netSavings   = totalIncome - totalExpense
  const savingsRate  = totalIncome > 0 ? ((netSavings / totalIncome) * 100).toFixed(1) : '0'

  const byCategory: Record<string,number> = {}
  transactions.forEach((t) => { if (t.type === 'expense') byCategory[t.category] = (byCategory[t.category] ?? 0) + t.amount })
  const topCategory = Object.entries(byCategory).sort((a,b) => b[1] - a[1])[0]

  const insights = insightQ.data

  const insightCards = insights
    ? [
        {
          icon: RiTrophyLine, iconBg: 'bg-warning-lighter', iconColor: 'text-warning-base',
          title: 'Highest Spending Category',
          desc: `Shopping at $210 this month — 12% more than last month.`,
          badge: { label: '+12%', color: 'red' as const },
          tip: 'Consider setting a shopping budget to control overspending.',
        },
        {
          icon: RiLineChartLine, iconBg: 'bg-information-lighter', iconColor: 'text-information-base',
          title: 'Monthly Spending Up',
          desc: `Expenses this month ($${insights.monthlyComparison.thisMonth.toLocaleString()}) are ${insights.monthlyComparison.change}% higher than last month.`,
          badge: { label: `+${insights.monthlyComparison.change}%`, color: 'yellow' as const },
          tip: 'Review your recurring subscriptions for potential savings.',
        },
        {
          icon: RiCheckLine, iconBg: 'bg-success-lighter', iconColor: 'text-success-base',
          title: 'Healthy Savings Rate',
          desc: `You're saving ${insights.savingsRate}% of your income this month — above the recommended 20%.`,
          badge: { label: `${insights.savingsRate}%`, color: 'green' as const },
          tip: 'Great job! Consider increasing your investment contributions.',
        },
        {
          icon: RiAlertLine, iconBg: 'bg-error-lighter', iconColor: 'text-error-base',
          title: 'Pending Bills',
          desc: '1 pending bill: Gas $54.18. Make sure to settle before the due date.',
          badge: { label: 'Attention', color: 'red' as const },
          tip: 'Set up auto-pay to avoid late fees.',
        },
        {
          icon: RiLightbulbLine, iconBg: 'bg-feature-lighter', iconColor: 'text-feature-base',
          title: 'Projected Balance',
          desc: `At current rate, your balance by end of month will be ~${currencyFormatter.format(insights.projectedBalance)}.`,
          badge: { label: 'Forecast', color: 'purple' as const },
          tip: "You're on track for a positive month.",
        },
      ]
    : []

  return (
    <div className="space-y-5">
      <ShimmerStyles />

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {insightQ.isLoading ? (
          <><KPICardSkeleton/><KPICardSkeleton/><KPICardSkeleton/><KPICardSkeleton/></>
        ) : insightQ.isError ? (
          <div className="col-span-full"><ErrorState onRetry={insightQ.refetch} /></div>
        ) : (
          <>
            <KPICard label="Net Savings"        value={currencyFormatter.format(netSavings)}
              sub="This month" color={netSavings >= 0 ? 'text-success-base' : 'text-error-base'}
              icon={<RiArrowUpLine className="size-5" />}
              iconBg={netSavings >= 0 ? 'bg-success-lighter text-success-base' : 'bg-error-lighter text-error-base'} />
            <KPICard label="Savings Rate"       value={`${savingsRate}%`} sub="Of income saved"
              color="text-information-base" icon={<RiLineChartLine className="size-5"/>}
              iconBg="bg-information-lighter text-information-base" />
            <KPICard label="Avg Daily Spend"    value={currencyFormatter.format(insights!.avgDailySpend)} sub="Last 30 days"
              color="text-text-strong-950" icon={<RiShoppingBag3Line className="size-5"/>}
              iconBg="bg-faded-lighter text-faded-base" />
            <KPICard label="Top Spend Category" value={topCategory ? topCategory[0].charAt(0).toUpperCase() + topCategory[0].slice(1) : '—'}
              sub={topCategory ? currencyFormatter.format(topCategory[1]) : '—'}
              color="text-warning-base" icon={<RiTrophyLine className="size-5"/>}
              iconBg="bg-warning-lighter text-warning-base" />
          </>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <WidgetBox>
          <WidgetHeader>
            <RiShoppingBag3Line className="size-5 text-text-sub-600 shrink-0" />
            <WidgetTitle>Spending Breakdown</WidgetTitle>
          </WidgetHeader>
          <Divider className="mb-4" />
          {catSpend.isLoading ? (
            <div className="h-[200px] animate-pulse rounded-xl bg-bg-soft-200" />
          ) : catSpend.isError ? (
            <ErrorState onRetry={catSpend.refetch} />
          ) : (
            <>
              <SpendingPieChart data={spendPieData} />
              <div className="mt-4 space-y-2">
                {spendPieData.map((item) => {
                  const total = spendPieData.reduce((s,x) => s + x.value, 0)
                  return (
                    <div key={item.id} className="flex items-center gap-2.5">
                      <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="flex-1 text-paragraph-xs text-text-sub-600">{item.name}</span>
                      <span className="text-label-xs text-text-strong-950 tabular-nums">{currencyFormatter.format(item.value)}</span>
                      <span className="text-paragraph-xs text-text-soft-400 w-8 text-right tabular-nums">
                        {((item.value / total) * 100).toFixed(0)}%
                      </span>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </WidgetBox>

        <WidgetBox className="lg:col-span-2">
          <WidgetHeader>
            <RiLineChartLine className="size-5 text-text-sub-600 shrink-0" />
            <WidgetTitle>Monthly Comparison</WidgetTitle>
            <div className="flex items-center gap-3">
              <LegendDot color="#3b82f6" label="Income" />
              <LegendDot color="#f59e0b" label="Expenses" />
            </div>
          </WidgetHeader>
          <Divider className="mb-4" />
          {monthly.isLoading ? (
            <div className="h-[160px] animate-pulse rounded-xl bg-bg-soft-200" />
          ) : monthly.isError ? (
            <ErrorState onRetry={monthly.refetch} />
          ) : (
            <>
              <MonthlyComparisonChart data={monthly.data!} />
              <div className="mt-4 space-y-2">
                {monthly.data!.slice(-3).map((m) => (
                  <div key={m.month} className="flex items-center justify-between rounded-xl bg-bg-weak-50 px-3 py-2">
                    <span className="text-label-xs text-text-sub-600 w-8">{m.month}</span>
                    <span className="text-paragraph-xs text-success-base tabular-nums">+{currencyFormatter.format(m.income)}</span>
                    <span className="text-paragraph-xs text-error-base tabular-nums">-{currencyFormatter.format(m.expenses)}</span>
                    <span className={cn('text-label-xs tabular-nums', m.balance >= 0 ? 'text-success-base' : 'text-error-base')}>
                      {m.balance >= 0 ? '+' : ''}{currencyFormatter.format(m.balance)}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </WidgetBox>
      </div>

      {/* Major Expenses */}
      <WidgetBox>
        <WidgetHeader>
          <RiArrowDownLine className="size-5 text-text-sub-600 shrink-0" />
          <WidgetTitle>Major Expense Categories</WidgetTitle>
        </WidgetHeader>
        <Divider className="mb-4" />
        <MajorExpensesChart data={majorExpenses} />
      </WidgetBox>

      {/* Smart Insights */}
      <div>
        <h2 className="text-label-md text-text-strong-950 mb-3 flex items-center gap-2">
          <RiLightbulbLine className="size-5 text-warning-base" />
          Smart Insights
        </h2>
        {insightQ.isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({length:5}).map((_,i) => <KPICardSkeleton key={i} />)}
          </div>
        ) : insightQ.isError ? (
          <ErrorState onRetry={insightQ.refetch} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {insightCards.map((card, i) => {
              const Icon = card.icon
              return (
                <div key={i} className="rounded-2xl bg-bg-white-0 p-4 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className={cn('flex size-9 items-center justify-center rounded-full', card.iconBg)}>
                      <Icon className={cn('size-4', card.iconColor)} />
                    </div>
                    <Badge color={card.badge.color} variant="light">{card.badge.label}</Badge>
                  </div>
                  <div>
                    <p className="text-label-sm text-text-strong-950">{card.title}</p>
                    <p className="mt-1 text-paragraph-xs text-text-sub-600">{card.desc}</p>
                  </div>
                  <div className="flex items-start gap-2 rounded-xl bg-bg-weak-50 p-2.5">
                    <RiLightbulbLine className="size-3.5 shrink-0 mt-0.5 text-text-soft-400" />
                    <p className="text-paragraph-xs text-text-soft-400">{card.tip}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function KPICard({ label, value, sub, color, icon, iconBg }: {
  label: string; value: string; sub: string; color: string; icon: React.ReactNode; iconBg: string
}) {
  return (
    <div className="rounded-2xl bg-bg-white-0 p-4 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200">
      <div className={cn('flex size-9 items-center justify-center rounded-full mb-3', iconBg)}>{icon}</div>
      <div className="text-paragraph-xs text-text-soft-400">{label}</div>
      <div className={cn('mt-0.5 text-title-h6 font-semibold', color)}>{value}</div>
      <div className="text-paragraph-xs text-text-soft-400">{sub}</div>
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

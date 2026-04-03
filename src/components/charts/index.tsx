import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { currencyFormatter } from '@/utils/helpers'

// ─── Balance Trend Area Chart ─────────────────────────────────────────────────
export function BalanceTrendChart({ data }: { data: { month: string; balance: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={120}>
      <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.18} />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: 'hsl(220 9% 63%)' }}
          axisLine={false}
          tickLine={false}
          tickMargin={6}
        />
        <Tooltip
          contentStyle={{
            background: 'hsl(0 0% 100%)',
            border: '1px solid hsl(220 15% 91%)',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,.06)',
            fontSize: 12,
          }}
          formatter={(v: number) => [currencyFormatter.format(v), 'Balance']}
        />
        <Area
          type="monotone"
          dataKey="balance"
          stroke="#3b82f6"
          strokeWidth={2}
          fill="url(#balanceGradient)"
          dot={false}
          activeDot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

// ─── Budget Overview Stacked Bar ──────────────────────────────────────────────
export function BudgetBarChart({ data }: {
  data: { month: string; income: number; expenses: number; balance: number }[]
}) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }} barGap={2}>
        <CartesianGrid vertical={false} stroke="hsl(220 15% 91%)" strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: 'hsl(220 9% 63%)' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: 'hsl(220 9% 63%)' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
          width={40}
        />
        <Tooltip
          contentStyle={{
            background: 'hsl(0 0% 100%)',
            border: '1px solid hsl(220 15% 91%)',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,.06)',
            fontSize: 12,
          }}
          formatter={(v: number, name: string) => [currencyFormatter.format(v), name]}
        />
        <Bar dataKey="income" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={28} name="Income" />
        <Bar dataKey="expenses" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={28} name="Expenses" />
      </BarChart>
    </ResponsiveContainer>
  )
}

// ─── Spending Pie Chart ───────────────────────────────────────────────────────
const RADIAN = Math.PI / 180
function renderCustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) {
  if (percent < 0.06) return null
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export function SpendingPieChart({ data }: { data: { name: string; value: number; color: string }[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={52}
          outerRadius={88}
          paddingAngle={3}
          dataKey="value"
          labelLine={false}
          label={renderCustomLabel}
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: 'hsl(0 0% 100%)',
            border: '1px solid hsl(220 15% 91%)',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,.06)',
            fontSize: 12,
          }}
          formatter={(v: number, name: string) => [currencyFormatter.format(v), name]}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

// ─── Spark Line ───────────────────────────────────────────────────────────────
export function SparkLine({
  data,
  color = '#3b82f6',
}: {
  data: number[]
  color?: string
}) {
  const points = data.map((v, i) => ({ i, v }))
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={points} margin={{ top: 2, right: 0, left: 0, bottom: 2 }}>
        <defs>
          <linearGradient id={`sg-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.2} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={1.5}
          fill={`url(#sg-${color.replace('#', '')})`}
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

// ─── Vertical Bar Chart (Major Expenses) ─────────────────────────────────────
export function MajorExpensesChart({ data }: { data: { name: string; value: number; color: string }[] }) {
  const max = Math.max(...data.map((d) => d.value))
  return (
    <div className="space-y-4">
      {data.map((item) => (
        <div key={item.name} className="space-y-1.5">
          <div className="flex items-center justify-between text-paragraph-xs">
            <span className="text-text-sub-600">{item.name}</span>
            <span className="font-medium text-text-strong-950">{currencyFormatter.format(item.value)}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-bg-soft-200 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${(item.value / max) * 100}%`, backgroundColor: item.color }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Monthly Comparison Chart ─────────────────────────────────────────────────
export function MonthlyComparisonChart({ data }: {
  data: { month: string; income: number; expenses: number }[]
}) {
  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }} barGap={2}>
        <CartesianGrid vertical={false} stroke="hsl(220 15% 91%)" strokeDasharray="3 3" />
        <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'hsl(220 9% 63%)' }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{
            background: 'hsl(0 0% 100%)',
            border: '1px solid hsl(220 15% 91%)',
            borderRadius: '12px',
            fontSize: 12,
          }}
          formatter={(v: number, name: string) => [currencyFormatter.format(v), name]}
        />
        <Bar dataKey="income" fill="#3b82f6" radius={[3, 3, 0, 0]} maxBarSize={18} name="Income" />
        <Bar dataKey="expenses" fill="#f59e0b" radius={[3, 3, 0, 0]} maxBarSize={18} name="Expenses" />
      </BarChart>
    </ResponsiveContainer>
  )
}

import { cn } from '@/utils/helpers'

// ─── Badge ───────────────────────────────────────────────────────────────────
type BadgeVariant = 'light' | 'solid' | 'outline'
type BadgeColor = 'green' | 'red' | 'blue' | 'yellow' | 'gray' | 'purple'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  color?: BadgeColor
}

const badgeColors: Record<BadgeColor, Record<BadgeVariant, string>> = {
  green: {
    light: 'bg-success-lighter text-success-base',
    solid: 'bg-success-base text-white',
    outline: 'border border-success-base text-success-base',
  },
  red: {
    light: 'bg-error-lighter text-error-base',
    solid: 'bg-error-base text-white',
    outline: 'border border-error-base text-error-base',
  },
  blue: {
    light: 'bg-primary-lighter text-primary-base',
    solid: 'bg-primary-base text-white',
    outline: 'border border-primary-base text-primary-base',
  },
  yellow: {
    light: 'bg-warning-lighter text-warning-base',
    solid: 'bg-warning-base text-white',
    outline: 'border border-warning-base text-warning-base',
  },
  gray: {
    light: 'bg-faded-lighter text-faded-base',
    solid: 'bg-faded-base text-white',
    outline: 'border border-stroke-sub-300 text-text-sub-600',
  },
  purple: {
    light: 'bg-feature-lighter text-feature-base',
    solid: 'bg-feature-base text-white',
    outline: 'border border-feature-base text-feature-base',
  },
}

export function Badge({ variant = 'light', color = 'gray', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-label-xs',
        badgeColors[color][variant],
        className,
      )}
      {...props}
    />
  )
}

// ─── Button ──────────────────────────────────────────────────────────────────
type ButtonVariant = 'primary' | 'neutral' | 'error'
type ButtonMode = 'filled' | 'stroke' | 'ghost'
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  mode?: ButtonMode
  size?: ButtonSize
  loading?: boolean
}

const buttonVariants: Record<ButtonVariant, Record<ButtonMode, string>> = {
  primary: {
    filled: 'bg-primary-base text-white hover:opacity-90 shadow-regular-xs',
    stroke: 'border border-primary-base text-primary-base hover:bg-primary-lighter',
    ghost: 'text-primary-base hover:bg-primary-lighter',
  },
  neutral: {
    filled: 'bg-bg-strong-950 text-text-white-0 hover:opacity-90 shadow-regular-xs',
    stroke: 'border border-stroke-soft-200 text-text-sub-600 hover:bg-bg-weak-50 bg-bg-white-0 shadow-regular-xs',
    ghost: 'text-text-sub-600 hover:bg-bg-weak-50',
  },
  error: {
    filled: 'bg-error-base text-white hover:opacity-90 shadow-regular-xs',
    stroke: 'border border-error-base text-error-base hover:bg-error-lighter',
    ghost: 'text-error-base hover:bg-error-lighter',
  },
}

const buttonSizes: Record<ButtonSize, string> = {
  xs: 'h-7 rounded-lg px-2.5 text-label-xs gap-1',
  sm: 'h-8 rounded-lg px-3 text-label-sm gap-1.5',
  md: 'h-9 rounded-xl px-4 text-label-sm gap-2',
  lg: 'h-10 rounded-xl px-5 text-label-md gap-2',
}

export function Button({
  variant = 'neutral',
  mode = 'stroke',
  size = 'sm',
  loading,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all duration-200 whitespace-nowrap disabled:opacity-50 disabled:pointer-events-none',
        buttonVariants[variant][mode],
        buttonSizes[size],
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      )}
      {children}
    </button>
  )
}

// ─── Widget Box ──────────────────────────────────────────────────────────────
export function WidgetBox({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'w-full min-w-0 rounded-2xl bg-bg-white-0 p-4 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200',
        className,
      )}
      {...props}
    />
  )
}

export function WidgetHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 pb-4 min-h-[44px]',
        className,
      )}
      {...props}
    />
  )
}

export function WidgetTitle({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn('flex-1 text-label-sm text-text-strong-950', className)}
      {...props}
    />
  )
}

// ─── Stat Card ───────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string
  value: string
  change?: number
  icon: React.ReactNode
  iconBg?: string
  chart?: React.ReactNode
}

export function StatCard({ label, value, change, icon, iconBg = 'bg-bg-weak-50', chart }: StatCardProps) {
  return (
    <div className="relative flex h-[160px] flex-col rounded-2xl bg-bg-white-0 p-5 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200 overflow-hidden">
      <div className="flex items-start justify-between">
        <div className={cn('flex size-10 items-center justify-center rounded-full', iconBg)}>
          {icon}
        </div>
        {change !== undefined && (
          <Badge color={change >= 0 ? 'green' : 'red'} variant="light">
            {change >= 0 ? '+' : ''}{change.toFixed(1)}%
          </Badge>
        )}
      </div>
      {chart && (
        <div className="absolute right-4 top-4 h-10 w-28 opacity-60">
          {chart}
        </div>
      )}
      <div className="mt-auto">
        <div className="text-paragraph-sm text-text-sub-600">{label}</div>
        <div className="mt-1 text-title-h5 text-text-strong-950">{value}</div>
      </div>
    </div>
  )
}

// ─── Divider ─────────────────────────────────────────────────────────────────
export function Divider({ className }: { className?: string }) {
  return <div className={cn('h-px w-full bg-stroke-soft-200', className)} />
}

// ─── Empty State ─────────────────────────────────────────────────────────────
export function EmptyState({ title, description, action }: {
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-bg-weak-50">
        <svg className="size-6 text-text-soft-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <div>
        <p className="text-label-sm text-text-strong-950">{title}</p>
        <p className="mt-1 text-paragraph-sm text-text-soft-400">{description}</p>
      </div>
      {action}
    </div>
  )
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
export function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { color: BadgeColor; label: string }> = {
    completed: { color: 'green', label: 'Completed' },
    pending: { color: 'yellow', label: 'Pending' },
    failed: { color: 'red', label: 'Failed' },
  }
  const { color, label } = config[status] ?? { color: 'gray', label: status }
  return <Badge color={color} variant="light">{label}</Badge>
}

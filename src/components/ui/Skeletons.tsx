import { cn } from '@/utils/helpers'

// ─── Base shimmer pulse ───────────────────────────────────────────────────────
function Shimmer({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-xl bg-gradient-to-r from-bg-soft-200 via-bg-sub-300 to-bg-soft-200 bg-[length:200%_100%]',
        className,
      )}
      style={{ animation: 'shimmer 1.6s ease-in-out infinite', ...style }}
    />
  )
}

// Add shimmer keyframes via a style tag once
export function ShimmerStyles() {
  return (
    <style>{`
      @keyframes shimmer {
        0%   { background-position: 200% center; }
        100% { background-position: -200% center; }
      }
    `}</style>
  )
}

// ─── Stat Card Skeleton ───────────────────────────────────────────────────────
export function StatCardSkeleton() {
  return (
    <div className="flex h-[160px] flex-col rounded-2xl bg-bg-white-0 p-5 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200">
      <div className="flex items-start justify-between">
        <Shimmer className="size-10 rounded-full" />
        <Shimmer className="h-5 w-14 rounded-full" />
      </div>
      <div className="mt-auto space-y-2">
        <Shimmer className="h-3.5 w-24" />
        <Shimmer className="h-7 w-36" />
      </div>
    </div>
  )
}

// ─── Widget Box Skeleton ──────────────────────────────────────────────────────
export function WidgetSkeleton({ height = 280 }: { height?: number }) {
  return (
    <div
      className="w-full rounded-2xl bg-bg-white-0 p-4 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200"
      style={{ minHeight: height }}
    >
      {/* header */}
      <div className="flex items-center gap-2 pb-4">
        <Shimmer className="size-5 rounded-full" />
        <Shimmer className="h-4 w-32" />
        <div className="ml-auto">
          <Shimmer className="h-6 w-20 rounded-lg" />
        </div>
      </div>
      <Shimmer className="mb-4 h-px w-full rounded-none" />
      {/* body */}
      <Shimmer className="h-full w-full rounded-xl" style={{ height: height - 80 } as React.CSSProperties} />
    </div>
  )
}

// ─── Transaction Row Skeleton ─────────────────────────────────────────────────
export function TransactionRowSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
      <Shimmer className="size-10 shrink-0 rounded-full" />
      <div className="flex-1 space-y-2">
        <Shimmer className="h-3.5 w-40" />
        <Shimmer className="h-3 w-56" />
      </div>
      <div className="space-y-2 text-right">
        <Shimmer className="ml-auto h-3.5 w-16" />
        <Shimmer className="ml-auto h-3 w-12" />
      </div>
    </div>
  )
}

export function TransactionListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-1">
      {Array.from({ length: rows }).map((_, i) => (
        <TransactionRowSkeleton key={i} />
      ))}
    </div>
  )
}

// ─── Chart Skeleton ───────────────────────────────────────────────────────────
export function ChartSkeleton({ height = 220 }: { height?: number }) {
  return (
    <div className="flex items-end gap-2 px-2" style={{ height }}>
      {[60, 80, 45, 90, 70, 55, 85, 65, 75].map((h, i) => (
        <Shimmer
          key={i}
          className="flex-1 rounded-t-lg"
          style={{ height: `${h}%` } as React.CSSProperties}
        />
      ))}
    </div>
  )
}

// ─── KPI Row Skeleton ─────────────────────────────────────────────────────────
export function KPICardSkeleton() {
  return (
    <div className="rounded-2xl bg-bg-white-0 p-4 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200">
      <Shimmer className="mb-3 size-9 rounded-full" />
      <Shimmer className="mb-1.5 h-3 w-20" />
      <Shimmer className="mb-1 h-7 w-28" />
      <Shimmer className="h-3 w-16" />
    </div>
  )
}

// ─── Error State ──────────────────────────────────────────────────────────────
export function ErrorState({
  message = 'Something went wrong',
  onRetry,
}: {
  message?: string
  onRetry?: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-error-lighter">
        <svg className="size-5 text-error-base" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z" />
        </svg>
      </div>
      <div>
        <p className="text-label-sm text-text-strong-950">Failed to load</p>
        <p className="mt-0.5 text-paragraph-xs text-text-soft-400">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-1 rounded-xl border border-stroke-soft-200 px-4 py-1.5 text-label-xs text-text-sub-600 hover:bg-bg-weak-50 transition-colors"
        >
          Try again
        </button>
      )}
    </div>
  )
}

import {
  RiBankCardLine, RiAddLine, RiVisaLine, RiMastercardLine,
  RiEyeLine, RiEyeOffLine, RiCopyleftLine, RiLockLine,
} from '@remixicon/react'
import { useState } from 'react'
import { WidgetBox, WidgetHeader, WidgetTitle, Badge, Button, Divider } from '@/components/ui'
import { currencyFormatter } from '@/utils/helpers'
import { mockCards } from '@/data/mockData'
import { cn } from '@/utils/helpers'
import { useStore } from '@/store/useStore'

function CreditCard({ card, selected, onClick }: {
  card: typeof mockCards[0]; selected: boolean; onClick: () => void
}) {
  const [hidden, setHidden] = useState(true)

  return (
    <div
      onClick={onClick}
      className={cn(
        'relative cursor-pointer rounded-2xl p-5 transition-all duration-300 overflow-hidden select-none',
        `bg-gradient-to-br ${card.color}`,
        selected ? 'ring-2 ring-primary-base ring-offset-2 shadow-regular-lg' : 'shadow-regular-md hover:shadow-regular-lg',
      )}
    >
      {/* Background circles */}
      <div className="absolute -right-8 -top-8 size-40 rounded-full bg-white/5" />
      <div className="absolute -bottom-12 -right-4 size-56 rounded-full bg-white/5" />

      <div className="relative flex flex-col gap-6">
        {/* Top row */}
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[10px] font-medium uppercase tracking-widest text-white/60">Card Balance</div>
            <div className="mt-0.5 text-2xl font-bold text-white tabular-nums">
              {currencyFormatter.format(card.balance)}
            </div>
          </div>
          {card.type === 'visa' ? (
            <div className="text-white/80 text-2xl font-bold italic tracking-tight">VISA</div>
          ) : (
            <div className="flex">
              <div className="size-8 rounded-full bg-red-500 opacity-90" />
              <div className="-ml-3 size-8 rounded-full bg-yellow-400 opacity-90" />
            </div>
          )}
        </div>

        {/* Chip + number */}
        <div>
          <div className="mb-3 w-9 h-6 rounded-md bg-yellow-300/80 border border-yellow-200/60 flex items-center justify-center">
            <div className="grid grid-cols-2 gap-px">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="size-1.5 rounded-sm bg-yellow-600/60" />
              ))}
            </div>
          </div>
          <div className="font-mono text-sm tracking-widest text-white/90">
            {hidden ? `•••• •••• •••• ${card.lastFour}` : `4532 8821 ${card.lastFour} 0001`}
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex items-end justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-white/50">Expires</div>
            <div className="text-sm font-medium text-white/90">{card.expiryDate}</div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); setHidden(!hidden) }}
            className="text-white/60 hover:text-white transition-colors"
          >
            {hidden ? <RiEyeLine className="size-4" /> : <RiEyeOffLine className="size-4" />}
          </button>
        </div>
      </div>
    </div>
  )
}

const subscriptions = [
  { name: 'Netflix', amount: 15.99, date: 'Oct 12', icon: '🎬', color: 'bg-red-100 text-red-600' },
  { name: 'Spotify', amount: 10.99, date: 'Oct 12', icon: '🎵', color: 'bg-green-100 text-green-600' },
  { name: 'Gym', amount: 180.00, date: 'Oct 18', icon: '💪', color: 'bg-blue-100 text-blue-600' },
  { name: 'Adobe CC', amount: 54.99, date: 'Oct 22', icon: '🎨', color: 'bg-orange-100 text-orange-600' },
]

export default function CardsPage() {
  const [selectedCard, setSelectedCard] = useState(0)
  const { role } = useStore()

  const card = mockCards[selectedCard]

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Cards column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Card display */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mockCards.map((c, i) => (
              <CreditCard key={c.id} card={c} selected={selectedCard === i} onClick={() => setSelectedCard(i)} />
            ))}
            {role === 'admin' && (
              <div className="flex min-h-[180px] cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-stroke-soft-200 text-text-soft-400 hover:border-primary-base hover:text-primary-base transition-colors">
                <RiAddLine className="size-6" />
                <span className="text-label-sm">Add Card</span>
              </div>
            )}
          </div>

          {/* Card details */}
          <WidgetBox>
            <WidgetHeader>
              <RiBankCardLine className="size-5 text-text-sub-600 shrink-0" />
              <WidgetTitle>Card Details</WidgetTitle>
              <Badge color="green" variant="light">Active</Badge>
            </WidgetHeader>
            <Divider className="mb-4" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Detail label="Card Type" value={card.type.toUpperCase()} />
              <Detail label="Last Four" value={`••${card.lastFour}`} />
              <Detail label="Expiry" value={card.expiryDate} />
              <Detail label="Balance" value={currencyFormatter.format(card.balance)} />
            </div>
            {role === 'admin' && (
              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="neutral" mode="stroke" size="sm">
                  <RiLockLine className="size-4" />
                  Freeze Card
                </Button>
                <Button variant="neutral" mode="stroke" size="sm">
                  <RiCopyleftLine className="size-4" />
                  Virtual Copy
                </Button>
                <Button variant="error" mode="stroke" size="sm">
                  Block Card
                </Button>
              </div>
            )}
          </WidgetBox>

          {/* Spending Limits */}
          <WidgetBox>
            <WidgetHeader>
              <WidgetTitle>Spending Limits</WidgetTitle>
            </WidgetHeader>
            <Divider className="mb-4" />
            <div className="space-y-4">
              <LimitBar label="Daily Limit" used={320} max={1000} color="bg-primary-base" />
              <LimitBar label="Weekly Limit" used={1240} max={3000} color="bg-information-base" />
              <LimitBar label="Monthly Limit" used={4362} max={8000} color="bg-success-base" />
            </div>
          </WidgetBox>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Quick Stats */}
          <WidgetBox>
            <WidgetHeader>
              <WidgetTitle>Card Stats</WidgetTitle>
            </WidgetHeader>
            <Divider className="mb-4" />
            <div className="space-y-3">
              <Stat label="Total Spent" value={currencyFormatter.format(4362)} />
              <Stat label="Transactions" value="18 this month" />
              <Stat label="Cashback Earned" value={currencyFormatter.format(12.84)} color="text-success-base" />
              <Stat label="Credit Score" value="710 — Excellent" color="text-warning-base" />
            </div>
          </WidgetBox>

          {/* Subscriptions */}
          <WidgetBox>
            <WidgetHeader>
              <WidgetTitle>Upcoming Bills</WidgetTitle>
            </WidgetHeader>
            <Divider className="mb-3" />
            <div className="space-y-2">
              {subscriptions.map((s) => (
                <div key={s.name} className="flex items-center gap-3 rounded-xl hover:bg-bg-weak-50 p-2 transition-colors">
                  <div className={cn('flex size-9 items-center justify-center rounded-full text-base', s.color)}>
                    {s.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-label-xs text-text-strong-950">{s.name}</p>
                    <p className="text-paragraph-xs text-text-soft-400">Due {s.date}</p>
                  </div>
                  <span className="text-label-xs text-text-strong-950 tabular-nums">
                    {currencyFormatter.format(s.amount)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between rounded-xl bg-bg-weak-50 p-3">
              <span className="text-paragraph-xs text-text-sub-600">Total upcoming</span>
              <span className="text-label-sm text-text-strong-950">
                {currencyFormatter.format(subscriptions.reduce((s, x) => s + x.amount, 0))}
              </span>
            </div>
          </WidgetBox>
        </div>
      </div>
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-paragraph-xs text-text-soft-400">{label}</div>
      <div className="mt-0.5 text-label-sm text-text-strong-950">{value}</div>
    </div>
  )
}

function Stat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-paragraph-xs text-text-sub-600">{label}</span>
      <span className={cn('text-label-xs text-text-strong-950', color)}>{value}</span>
    </div>
  )
}

function LimitBar({ label, used, max, color }: { label: string; used: number; max: number; color: string }) {
  const pct = Math.min((used / max) * 100, 100)
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-paragraph-xs">
        <span className="text-text-sub-600">{label}</span>
        <span className="text-text-strong-950 tabular-nums font-medium">
          {currencyFormatter.format(used)} / {currencyFormatter.format(max)}
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-bg-soft-200 overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-700', color)}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="text-right text-paragraph-xs text-text-soft-400">{pct.toFixed(0)}% used</div>
    </div>
  )
}

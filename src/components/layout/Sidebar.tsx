import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  RiLayoutGridLine,
  RiBankCardLine,
  RiHistoryLine,
  RiLineChartLine,
  RiSettings2Line,
  RiMenuFoldLine,
  RiMenuUnfoldLine,
  RiShieldUserLine,
} from '@remixicon/react'
import { cn } from '@/utils/helpers'
import { useStore } from '@/store/useStore'

const navLinks = [
  { icon: RiLayoutGridLine, label: 'Dashboard', to: '/' },
  { icon: RiBankCardLine, label: 'Cards', to: '/cards' },
  { icon: RiHistoryLine, label: 'Transactions', to: '/transactions' },
  { icon: RiLineChartLine, label: 'Insights', to: '/insights' },
]

const bottomLinks = [
  { icon: RiSettings2Line, label: 'Settings', to: '/settings' },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const { role } = useStore()

  const isActive = (to: string) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col h-screen sticky top-0 shrink-0',
        'bg-bg-white-0 border-r border-stroke-soft-200',
        'transition-all duration-300 ease-out',
        collapsed ? 'w-[72px]' : 'w-[248px]',
      )}
    >
      {/* Logo */}
      <div className={cn('flex items-center h-[72px] px-4 border-b border-stroke-soft-200', collapsed && 'justify-center')}>
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary-base shadow-regular-sm">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="text-label-sm text-text-strong-950 truncate">FinanceIQ</div>
              <div className="text-paragraph-xs text-text-soft-400 truncate">Personal Finance</div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {!collapsed && (
          <div className="mb-2 px-2 text-subheading-xs text-text-soft-400 uppercase">Main Menu</div>
        )}
        <div className="space-y-0.5">
          {navLinks.map(({ icon: Icon, label, to }) => {
            const active = isActive(to)
            return (
              <NavLink
                key={to}
                to={to}
                className={cn(
                  'group relative flex items-center gap-2.5 rounded-xl py-2.5 text-sm font-medium transition-all duration-200',
                  collapsed ? 'justify-center px-2.5' : 'px-3',
                  active
                    ? 'bg-primary-lighter text-primary-base'
                    : 'text-text-sub-600 hover:bg-bg-weak-50 hover:text-text-strong-950',
                )}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-primary-base" />
                )}
                <Icon className="size-5 shrink-0" />
                {!collapsed && <span className="truncate">{label}</span>}
                {collapsed && (
                  <div className="absolute left-full ml-3 z-50 hidden group-hover:block whitespace-nowrap rounded-lg bg-bg-strong-950 px-3 py-1.5 text-xs font-medium text-text-white-0 shadow-regular-md">
                    {label}
                  </div>
                )}
              </NavLink>
            )
          })}
        </div>

        <div className="mt-6">
          {!collapsed && (
            <div className="mb-2 px-2 text-subheading-xs text-text-soft-400 uppercase">Other</div>
          )}
          <div className="space-y-0.5">
            {bottomLinks.map(({ icon: Icon, label, to }) => {
              const active = isActive(to)
              return (
                <NavLink
                  key={to}
                  to={to}
                  className={cn(
                    'group relative flex items-center gap-2.5 rounded-xl py-2.5 text-sm font-medium transition-all duration-200',
                    collapsed ? 'justify-center px-2.5' : 'px-3',
                    active
                      ? 'bg-primary-lighter text-primary-base'
                      : 'text-text-sub-600 hover:bg-bg-weak-50 hover:text-text-strong-950',
                  )}
                >
                  {active && (
                    <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-primary-base" />
                  )}
                  <Icon className="size-5 shrink-0" />
                  {!collapsed && <span className="truncate">{label}</span>}
                  {collapsed && (
                    <div className="absolute left-full ml-3 z-50 hidden group-hover:block whitespace-nowrap rounded-lg bg-bg-strong-950 px-3 py-1.5 text-xs font-medium text-text-white-0 shadow-regular-md">
                      {label}
                    </div>
                  )}
                </NavLink>
              )
            })}
          </div>
        </div>
      </nav>

      {/* User Profile */}
      <div className="border-t border-stroke-soft-200 p-3">
        <div className={cn('flex items-center gap-2.5 rounded-xl p-2', collapsed && 'justify-center')}>
          <div className="relative shrink-0">
            <div className="flex size-8 items-center justify-center rounded-full bg-primary-base text-white text-xs font-semibold">
              {role === 'admin' ? 'A' : 'V'}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 flex size-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success-base opacity-75" />
              <span className="relative inline-flex size-2.5 rounded-full bg-success-base" />
            </span>
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-label-sm text-text-strong-950 truncate">
                  {role === 'admin' ? 'Alex Johnson' : 'Jane Viewer'}
                </span>
                <RiShieldUserLine className="size-3.5 shrink-0 text-primary-base" />
              </div>
              <div className="text-paragraph-xs text-text-soft-400 capitalize">{role}</div>
            </div>
          )}
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={cn(
          'absolute -right-3 top-[84px] flex size-6 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-sm ring-1 ring-stroke-soft-200',
          'text-text-soft-400 hover:text-text-strong-950 transition-colors',
        )}
      >
        {collapsed ? (
          <RiMenuUnfoldLine className="size-3.5" />
        ) : (
          <RiMenuFoldLine className="size-3.5" />
        )}
      </button>
    </aside>
  )
}

import { useState } from 'react'
import { useLocation, NavLink } from 'react-router-dom'
import {
  RiBellLine,
  RiSearchLine,
  RiMoonLine,
  RiSunLine,
  RiShieldUserLine,
  RiUserLine,
  RiLayoutGridLine,
  RiBankCardLine,
  RiHistoryLine,
  RiLineChartLine,
  RiSettings2Line,
  RiMenuLine,
  RiCloseLine,
} from '@remixicon/react'
import { cn } from '@/utils/helpers'
import { useStore } from '@/store/useStore'
import type { Role } from '@/types'

const routeTitles: Record<string, { title: string; description: string }> = {
  '/': { title: 'Dashboard', description: 'Welcome back, here\'s your financial overview' },
  '/transactions': { title: 'Transactions', description: 'Track and manage all your transactions' },
  '/insights': { title: 'Insights', description: 'Understand your spending patterns' },
  '/cards': { title: 'My Cards', description: 'Manage your cards and accounts' },
  '/settings': { title: 'Settings', description: 'Customize your preferences' },
}

const mobileLinks = [
  { icon: RiLayoutGridLine, label: 'Dashboard', to: '/' },
  { icon: RiBankCardLine, label: 'Cards', to: '/cards' },
  { icon: RiHistoryLine, label: 'Transactions', to: '/transactions' },
  { icon: RiLineChartLine, label: 'Insights', to: '/insights' },
  { icon: RiSettings2Line, label: 'Settings', to: '/settings' },
]

export default function Topbar() {
  const location = useLocation()
  const { darkMode, toggleDarkMode, role, setRole } = useStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showNotif, setShowNotif] = useState(false)

  const current = routeTitles[location.pathname] ?? { title: 'Dashboard', description: '' }

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value as Role)
  }

  return (
    <>
      <header className="sticky top-0 z-30 flex h-[72px] items-center gap-4 border-b border-stroke-soft-200 bg-bg-white-0/80 backdrop-blur-md px-4 lg:px-6">
        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex lg:hidden size-9 items-center justify-center rounded-xl text-text-sub-600 hover:bg-bg-weak-50 transition-colors"
        >
          {mobileOpen ? <RiCloseLine className="size-5" /> : <RiMenuLine className="size-5" />}
        </button>

        {/* Page title */}
        <div className="flex-1 min-w-0">
          <h1 className="text-label-md lg:text-label-lg text-text-strong-950 truncate">{current.title}</h1>
          <p className="hidden sm:block text-paragraph-xs text-text-soft-400 truncate">{current.description}</p>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {/* Role switcher */}
          <div className="hidden sm:flex items-center gap-1.5 rounded-xl border border-stroke-soft-200 px-3 py-1.5 text-paragraph-xs text-text-sub-600 bg-bg-white-0 shadow-regular-xs">
            <RiShieldUserLine className="size-3.5 text-primary-base shrink-0" />
            <select
              value={role}
              onChange={handleRoleChange}
              className="bg-transparent text-paragraph-xs text-text-sub-600 outline-none cursor-pointer"
            >
              <option value="admin">Admin</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>

          {/* Search */}
          <button className="hidden sm:flex size-9 items-center justify-center rounded-xl text-text-sub-600 hover:bg-bg-weak-50 transition-colors ring-1 ring-stroke-soft-200">
            <RiSearchLine className="size-4" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotif(!showNotif)}
              className="relative flex size-9 items-center justify-center rounded-xl text-text-sub-600 hover:bg-bg-weak-50 transition-colors ring-1 ring-stroke-soft-200"
            >
              <RiBellLine className="size-4" />
              <span className="absolute right-2 top-2 flex size-1.5 rounded-full bg-error-base" />
            </button>
            {showNotif && (
              <div className="absolute right-0 top-11 w-72 rounded-2xl bg-bg-white-0 shadow-regular-lg ring-1 ring-stroke-soft-200 overflow-hidden z-50">
                <div className="flex items-center justify-between px-4 py-3 border-b border-stroke-soft-200">
                  <span className="text-label-sm text-text-strong-950">Notifications</span>
                  <span className="text-paragraph-xs text-primary-base cursor-pointer">Mark all read</span>
                </div>
                <div className="divide-y divide-stroke-soft-200">
                  {[
                    { text: 'Salary received +$5,800', time: '2h ago', dot: 'bg-success-base' },
                    { text: 'Large expense detected: $210', time: '5h ago', dot: 'bg-warning-base' },
                    { text: 'Bill due: Gas $54.18', time: '1d ago', dot: 'bg-error-base' },
                  ].map((n, i) => (
                    <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-bg-weak-50 cursor-pointer">
                      <span className={cn('mt-1.5 size-2 shrink-0 rounded-full', n.dot)} />
                      <div>
                        <p className="text-paragraph-xs text-text-strong-950">{n.text}</p>
                        <p className="text-paragraph-xs text-text-soft-400">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="flex size-9 items-center justify-center rounded-xl text-text-sub-600 hover:bg-bg-weak-50 transition-colors ring-1 ring-stroke-soft-200"
          >
            {darkMode ? <RiSunLine className="size-4" /> : <RiMoonLine className="size-4" />}
          </button>

          {/* User avatar */}
          <button className="flex size-9 items-center justify-center rounded-xl bg-primary-base text-white text-xs font-semibold shadow-regular-xs">
            {role === 'admin' ? 'AJ' : 'JV'}
          </button>
        </div>
      </header>

      {/* Mobile overlay menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-bg-strong-950/40" onClick={() => setMobileOpen(false)} />
          <nav className="absolute left-0 top-0 h-full w-64 bg-bg-white-0 shadow-regular-lg flex flex-col">
            <div className="flex items-center gap-2.5 h-[72px] px-4 border-b border-stroke-soft-200">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary-base shadow-regular-sm">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <div>
                <div className="text-label-sm text-text-strong-950">FinanceIQ</div>
                <div className="text-paragraph-xs text-text-soft-400 capitalize">{role}</div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
              {mobileLinks.map(({ icon: Icon, label, to }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive ? 'bg-primary-lighter text-primary-base' : 'text-text-sub-600 hover:bg-bg-weak-50',
                    )
                  }
                >
                  <Icon className="size-5 shrink-0" />
                  {label}
                </NavLink>
              ))}
            </div>
            <div className="border-t border-stroke-soft-200 p-4">
              <div className="flex items-center gap-1.5 text-paragraph-xs text-text-sub-600">
                <RiShieldUserLine className="size-4 text-primary-base" />
                <span>Role:</span>
                <select value={role} onChange={handleRoleChange} className="bg-transparent outline-none cursor-pointer font-medium text-text-strong-950">
                  <option value="admin">Admin</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
            </div>
          </nav>
        </div>
      )}
    </>
  )
}

import { useState } from 'react'
import {
  RiUserLine, RiShieldUserLine, RiMoonLine, RiSunLine,
  RiNotificationLine, RiGlobalLine, RiLockLine, RiSaveLine,
  RiDeleteBinLine, RiDownloadLine,
} from '@remixicon/react'
import { useStore } from '@/store/useStore'
import { WidgetBox, WidgetHeader, WidgetTitle, Button, Divider, Badge } from '@/components/ui'
import { cn } from '@/utils/helpers'
import { mockTransactions } from '@/data/mockData'
import type { Role } from '@/types'

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
        checked ? 'bg-primary-base' : 'bg-stroke-sub-300',
      )}
    >
      <span
        className={cn(
          'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-regular-sm transition duration-200 ease-in-out',
          checked ? 'translate-x-4' : 'translate-x-0',
        )}
      />
    </button>
  )
}

function SettingRow({ label, description, children }: {
  label: string; description?: string; children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="flex-1 min-w-0">
        <p className="text-label-sm text-text-strong-950">{label}</p>
        {description && <p className="mt-0.5 text-paragraph-xs text-text-soft-400">{description}</p>}
      </div>
      {children}
    </div>
  )
}

export default function SettingsPage() {
  const { role, setRole, darkMode, toggleDarkMode } = useStore()
  const [notifications, setNotifications] = useState({
    transactions: true,
    bills: true,
    insights: false,
    security: true,
  })
  const [currency, setCurrency] = useState('USD')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleExportData = () => {
    const json = JSON.stringify(mockTransactions, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'finance-data.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-3xl space-y-5">
      {/* Profile Section */}
      <WidgetBox>
        <WidgetHeader>
          <RiUserLine className="size-5 text-text-sub-600 shrink-0" />
          <WidgetTitle>Profile</WidgetTitle>
        </WidgetHeader>
        <Divider className="mb-4" />

        <div className="flex items-center gap-4 mb-6">
          <div className="flex size-16 items-center justify-center rounded-full bg-primary-base text-white text-xl font-bold shadow-regular-md">
            {role === 'admin' ? 'AJ' : 'JV'}
          </div>
          <div>
            <p className="text-label-md text-text-strong-950">
              {role === 'admin' ? 'Alex Johnson' : 'Jane Viewer'}
            </p>
            <p className="text-paragraph-sm text-text-soft-400">
              {role === 'admin' ? 'alex@financeiq.app' : 'jane@financeiq.app'}
            </p>
            <Badge color={role === 'admin' ? 'blue' : 'gray'} variant="light" className="mt-1">
              {role}
            </Badge>
          </div>
        </div>

        {role === 'admin' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-label-xs text-text-sub-600">Full Name</label>
              <input
                defaultValue="Alex Johnson"
                className="h-9 w-full rounded-xl border border-stroke-soft-200 bg-bg-white-0 px-3 text-paragraph-sm text-text-strong-950 outline-none focus:border-primary-base transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-label-xs text-text-sub-600">Email</label>
              <input
                defaultValue="alex@financeiq.app"
                className="h-9 w-full rounded-xl border border-stroke-soft-200 bg-bg-white-0 px-3 text-paragraph-sm text-text-strong-950 outline-none focus:border-primary-base transition-colors"
              />
            </div>
          </div>
        )}
      </WidgetBox>

      {/* Role Switcher */}
      <WidgetBox>
        <WidgetHeader>
          <RiShieldUserLine className="size-5 text-text-sub-600 shrink-0" />
          <WidgetTitle>Role & Permissions</WidgetTitle>
        </WidgetHeader>
        <Divider className="mb-2" />

        <div className="space-y-0">
          {([
            {
              value: 'admin',
              label: 'Admin',
              desc: 'Can view, add, edit, and delete transactions. Full access to all features.',
              badge: { color: 'blue', label: 'Full Access' },
            },
            {
              value: 'viewer',
              label: 'Viewer',
              desc: 'Read-only access. Can view all data but cannot make any changes.',
              badge: { color: 'gray', label: 'Read Only' },
            },
          ] as { value: Role; label: string; desc: string; badge: { color: any; label: string } }[]).map((r) => (
            <div
              key={r.value}
              onClick={() => setRole(r.value)}
              className={cn(
                'flex cursor-pointer items-start gap-3 rounded-xl p-3 transition-colors',
                role === r.value ? 'bg-primary-lighter' : 'hover:bg-bg-weak-50',
              )}
            >
              <div className={cn(
                'mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                role === r.value ? 'border-primary-base' : 'border-stroke-sub-300',
              )}>
                {role === r.value && <div className="size-2 rounded-full bg-primary-base" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-label-sm text-text-strong-950">{r.label}</span>
                  <Badge color={r.badge.color} variant="light">{r.badge.label}</Badge>
                </div>
                <p className="mt-0.5 text-paragraph-xs text-text-soft-400">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </WidgetBox>

      {/* Appearance */}
      <WidgetBox>
        <WidgetHeader>
          {darkMode ? (
            <RiMoonLine className="size-5 text-text-sub-600 shrink-0" />
          ) : (
            <RiSunLine className="size-5 text-text-sub-600 shrink-0" />
          )}
          <WidgetTitle>Appearance</WidgetTitle>
        </WidgetHeader>
        <Divider />
        <SettingRow label="Dark Mode" description="Switch to a darker interface to reduce eye strain">
          <Toggle checked={darkMode} onChange={toggleDarkMode} />
        </SettingRow>
        <Divider />
        <SettingRow label="Currency" description="Default currency for displaying amounts">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="h-8 rounded-xl border border-stroke-soft-200 bg-bg-white-0 px-2.5 text-paragraph-xs text-text-strong-950 outline-none focus:border-primary-base cursor-pointer"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="INR">INR (₹)</option>
          </select>
        </SettingRow>
      </WidgetBox>

      {/* Notifications */}
      <WidgetBox>
        <WidgetHeader>
          <RiNotificationLine className="size-5 text-text-sub-600 shrink-0" />
          <WidgetTitle>Notifications</WidgetTitle>
        </WidgetHeader>
        <Divider />
        {(Object.keys(notifications) as (keyof typeof notifications)[]).map((key, i) => {
          const labels: Record<keyof typeof notifications, { label: string; desc: string }> = {
            transactions: { label: 'Transaction Alerts', desc: 'Get notified for every transaction' },
            bills: { label: 'Bill Reminders', desc: 'Reminders before bills are due' },
            insights: { label: 'Spending Insights', desc: 'Weekly financial summaries' },
            security: { label: 'Security Alerts', desc: 'Unusual activity notifications' },
          }
          const { label, desc } = labels[key]
          return (
            <div key={key}>
              {i > 0 && <Divider />}
              <SettingRow label={label} description={desc}>
                <Toggle
                  checked={notifications[key]}
                  onChange={(v) => setNotifications({ ...notifications, [key]: v })}
                />
              </SettingRow>
            </div>
          )
        })}
      </WidgetBox>

      {/* Data Management */}
      <WidgetBox>
        <WidgetHeader>
          <RiDownloadLine className="size-5 text-text-sub-600 shrink-0" />
          <WidgetTitle>Data Management</WidgetTitle>
        </WidgetHeader>
        <Divider className="mb-4" />
        <div className="flex flex-wrap gap-3">
          <Button variant="neutral" mode="stroke" size="sm" onClick={handleExportData}>
            <RiDownloadLine className="size-4" />
            Export as JSON
          </Button>
          {role === 'admin' && (
            <Button variant="error" mode="stroke" size="sm">
              <RiDeleteBinLine className="size-4" />
              Clear All Data
            </Button>
          )}
        </div>
      </WidgetBox>

      {/* Save */}
      {role === 'admin' && (
        <div className="flex justify-end">
          <Button
            variant="primary"
            mode="filled"
            size="md"
            onClick={handleSave}
          >
            <RiSaveLine className="size-4" />
            {saved ? 'Saved ✓' : 'Save Changes'}
          </Button>
        </div>
      )}
    </div>
  )
}

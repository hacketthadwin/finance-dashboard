import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Transaction, Role } from '@/types'
import {
  fetchTransactions,
  createTransaction,
  updateTransactionApi,
  deleteTransactionApi,
} from '@/api/mockApi'

export type LoadStatus = 'idle' | 'loading' | 'success' | 'error'

interface FilterState {
  search: string
  type: 'all' | 'income' | 'expense'
  category: string
  status: string
  sortBy: string
  sortDir: 'asc' | 'desc'
}

interface AppState {
  role: Role
  setRole: (role: Role) => void

  darkMode: boolean
  toggleDarkMode: () => void

  transactions: Transaction[]
  txStatus: LoadStatus
  txError: string | null
  loadTransactions: () => Promise<void>
  addTransaction: (payload: Omit<Transaction, 'id'>) => Promise<void>
  updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<void>
  deleteTransaction: (id: string) => Promise<void>

  filters: FilterState
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void
  resetFilters: () => void
}

const defaultFilters: FilterState = {
  search: '',
  type: 'all',
  category: 'all',
  status: 'all',
  sortBy: 'date',
  sortDir: 'desc',
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      role: 'admin',
      setRole: (role) => set({ role }),

      darkMode: false,
      toggleDarkMode: () =>
        set((s) => {
          const next = !s.darkMode
          document.documentElement.classList.toggle('dark', next)
          return { darkMode: next }
        }),

      transactions: [],
      txStatus: 'idle',
      txError: null,

      loadTransactions: async () => {
        if (get().txStatus === 'success') return
        set({ txStatus: 'loading', txError: null })
        try {
          const res = await fetchTransactions()
          const persisted = get().transactions
          const serverIds = new Set(res.data.map((t) => t.id))
          const localOnly = persisted.filter((t) => !serverIds.has(t.id))
          set({ transactions: [...localOnly, ...res.data], txStatus: 'success' })
        } catch (err) {
          set({
            txStatus: 'error',
            txError: err instanceof Error ? err.message : 'Failed to load transactions',
          })
        }
      },

      addTransaction: async (payload) => {
        const tempId = `temp-${Date.now()}`
        const optimistic: Transaction = { ...payload, id: tempId }
        set((s) => ({ transactions: [optimistic, ...s.transactions] }))
        try {
          const res = await createTransaction(payload)
          set((s) => ({
            transactions: s.transactions.map((t) => (t.id === tempId ? res.data : t)),
          }))
        } catch {
          set((s) => ({ transactions: s.transactions.filter((t) => t.id !== tempId) }))
        }
      },

      updateTransaction: async (id, updates) => {
        const prev = get().transactions.find((t) => t.id === id)
        set((s) => ({
          transactions: s.transactions.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        }))
        try {
          await updateTransactionApi(id, updates)
        } catch {
          if (prev) {
            set((s) => ({
              transactions: s.transactions.map((t) => (t.id === id ? prev : t)),
            }))
          }
        }
      },

      deleteTransaction: async (id) => {
        const prev = get().transactions
        set((s) => ({ transactions: s.transactions.filter((t) => t.id !== id) }))
        try {
          await deleteTransactionApi(id)
        } catch {
          set({ transactions: prev })
        }
      },

      filters: defaultFilters,
      setFilter: (key, value) =>
        set((s) => ({ filters: { ...s.filters, [key]: value } })),
      resetFilters: () => set({ filters: defaultFilters }),
    }),
    {
      name: 'finance-dashboard-store',
      partialize: (state) => ({
        role: state.role,
        darkMode: state.darkMode,
        transactions: state.transactions,
        txStatus: 'idle' as LoadStatus,
      }),
    },
  ),
)

export function useFilteredTransactions() {
  const { transactions, filters } = useStore()
  return transactions
    .filter((t) => {
      const matchSearch =
        !filters.search ||
        t.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        t.description.toLowerCase().includes(filters.search.toLowerCase())
      const matchType = filters.type === 'all' || t.type === filters.type
      const matchCategory = filters.category === 'all' || t.category === filters.category
      const matchStatus = filters.status === 'all' || t.status === filters.status
      return matchSearch && matchType && matchCategory && matchStatus
    })
    .sort((a, b) => {
      const dir = filters.sortDir === 'asc' ? 1 : -1
      if (filters.sortBy === 'date')
        return (new Date(a.date).getTime() - new Date(b.date).getTime()) * dir
      if (filters.sortBy === 'amount') return (a.amount - b.amount) * dir
      if (filters.sortBy === 'name') return a.name.localeCompare(b.name) * dir
      return 0
    })
}

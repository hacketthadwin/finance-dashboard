/**
 * Mock API Service
 * Simulates real API calls with artificial delays and loading states.
 * Replace these functions with real fetch() calls when connecting to a backend.
 */

import type { Transaction } from '@/types'
import {
  mockTransactions,
  monthlyData,
  balanceTrend,
  categorySpendData,
  insights,
} from '@/data/mockData'

// Simulate network latency (300–900ms)
function delay(ms = 600) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

// Simulate occasional network errors for realism (10% chance)
function maybeThrow(label: string) {
  // Disabled in dev — set to true to test error states
  const simulateErrors = false
  if (simulateErrors && Math.random() < 0.1) {
    throw new Error(`[Mock API] ${label}: Network error`)
  }
}

export interface ApiResponse<T> {
  data: T
  status: number
  message: string
}

// ─── Transactions ─────────────────────────────────────────────────────────────

export async function fetchTransactions(): Promise<ApiResponse<Transaction[]>> {
  await delay(700)
  maybeThrow('fetchTransactions')
  return {
    data: mockTransactions,
    status: 200,
    message: 'OK',
  }
}

export async function createTransaction(
  payload: Omit<Transaction, 'id'>,
): Promise<ApiResponse<Transaction>> {
  await delay(500)
  maybeThrow('createTransaction')
  const newTx: Transaction = { ...payload, id: `t${Date.now()}` }
  return { data: newTx, status: 201, message: 'Created' }
}

export async function updateTransactionApi(
  id: string,
  payload: Partial<Transaction>,
): Promise<ApiResponse<Transaction>> {
  await delay(450)
  maybeThrow('updateTransaction')
  const found = mockTransactions.find((t) => t.id === id)
  if (!found) throw new Error(`Transaction ${id} not found`)
  return { data: { ...found, ...payload }, status: 200, message: 'Updated' }
}

export async function deleteTransactionApi(
  id: string,
): Promise<ApiResponse<{ id: string }>> {
  await delay(400)
  maybeThrow('deleteTransaction')
  return { data: { id }, status: 200, message: 'Deleted' }
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export interface DashboardStats {
  totalBalance: number
  totalIncome: number
  totalExpenses: number
  balanceChange: number
  incomeChange: number
  expensesChange: number
}

export async function fetchDashboardStats(): Promise<ApiResponse<DashboardStats>> {
  await delay(500)
  maybeThrow('fetchDashboardStats')
  const income = mockTransactions
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0)
  const expenses = mockTransactions
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0)
  return {
    data: {
      totalBalance: 14480.24,
      totalIncome: income,
      totalExpenses: expenses,
      balanceChange: 5.0,
      incomeChange: 8.2,
      expensesChange: -2.1,
    },
    status: 200,
    message: 'OK',
  }
}

// ─── Chart Data ───────────────────────────────────────────────────────────────

export async function fetchBalanceTrend() {
  await delay(600)
  maybeThrow('fetchBalanceTrend')
  return { data: balanceTrend, status: 200, message: 'OK' }
}

export async function fetchMonthlyData() {
  await delay(650)
  maybeThrow('fetchMonthlyData')
  return { data: monthlyData, status: 200, message: 'OK' }
}

export async function fetchCategorySpend() {
  await delay(550)
  maybeThrow('fetchCategorySpend')
  return { data: categorySpendData, status: 200, message: 'OK' }
}

export async function fetchInsights() {
  await delay(580)
  maybeThrow('fetchInsights')
  return { data: insights, status: 200, message: 'OK' }
}

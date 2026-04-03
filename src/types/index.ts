export type Role = 'admin' | 'viewer'

export type TransactionType = 'income' | 'expense'

export type TransactionCategory =
  | 'salary'
  | 'investment'
  | 'rent'
  | 'utilities'
  | 'food'
  | 'shopping'
  | 'transport'
  | 'entertainment'
  | 'healthcare'
  | 'education'
  | 'other'

export type TransactionMethod = 'wire' | 'ach' | 'transfer' | 'card'

export type TransactionStatus = 'completed' | 'pending' | 'failed'

export interface Transaction {
  id: string
  name: string
  description: string
  amount: number
  type: TransactionType
  category: TransactionCategory
  method: TransactionMethod
  status: TransactionStatus
  date: string
  account: string
  avatar?: string
}

export interface Card {
  id: string
  lastFour: string
  type: 'visa' | 'mastercard'
  balance: number
  expiryDate: string
  color: string
}

export interface MonthlyData {
  month: string
  income: number
  expenses: number
  balance: number
}

export interface CategorySpend {
  id: string
  name: string
  value: number
  color: string
  icon: string
}

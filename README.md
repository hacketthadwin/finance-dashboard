# FinanceIQ — Finance Dashboard

A clean, interactive, and fully responsive personal finance dashboard built with **React 18**, **TypeScript**, **Tailwind CSS**, **Zustand**, and **Recharts**. Designed to help users track financial activity, explore transactions, understand spending patterns, and manage their finances with role-based access control.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Setup Instructions](#setup-instructions)
3. [Project Structure](#project-structure)
4. [Architectural Overview](#architectural-overview)
5. [Features](#features)
   - [Dashboard Overview](#1-dashboard-overview)
   - [Transactions](#2-transactions)
   - [Filtering, Sorting & Search](#3-filtering-sorting--search)
   - [Export to CSV](#4-export-to-csv)
   - [Insights](#5-insights)
   - [Cards](#6-cards)
   - [Settings](#7-settings)
   - [Role-Based UI (RBAC)](#8-role-based-ui-rbac)
   - [Dark Mode](#9-dark-mode)
   - [Mock API & Async Loading](#10-mock-api--async-loading)
   - [Skeleton Loaders & Error States](#11-skeleton-loaders--error-states)
   - [Data Persistence](#12-data-persistence)
   - [Responsive Design](#13-responsive-design)
6. [State Management](#state-management)
7. [Design System](#design-system)
8. [Pages at a Glance](#pages-at-a-glance)

---

## Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| **React** | 18 | UI framework |
| **TypeScript** | 5 | Type safety across the entire codebase |
| **Vite** | 5 | Fast dev server and build tool |
| **Tailwind CSS** | 3 | Utility-first styling with custom design tokens |
| **Zustand** | 5 | Global state management with localStorage persistence |
| **Recharts** | 2 | Charts — area, bar, pie, sparkline |
| **React Router** | 6 | Client-side routing |
| **@remixicon/react** | 4 | Icon library |
| **date-fns** | 4 | Date formatting utilities |
| **clsx + tailwind-merge** | latest | Conditional class merging |

---

## Setup Instructions

### Prerequisites

- **Node.js** v18 or higher — [Download here](https://nodejs.org)
- **npm** v9+ (comes with Node.js)

Verify your versions before starting:

```bash
node --version   # should be v18.x or higher
npm --version    # should be v9.x or higher
```

### Step 1 — Unzip the Project

```bash
unzip finance-dashboard.zip
cd finance-dashboard
```

### Step 2 — Install Dependencies

```bash
npm install
```

This installs all packages listed in `package.json`, including React, Tailwind, Zustand, Recharts, and all supporting libraries. It takes around 30–60 seconds.

### Step 3 — Start the Development Server

```bash
npm run dev
```

Open your browser at **http://localhost:5173**

The app hot-reloads automatically whenever you save a file — no manual refresh needed.

### Step 4 — Build for Production (Optional)

```bash
npm run build
```

This compiles TypeScript and bundles everything into the `dist/` folder.

To preview the production build locally:

```bash
npm run preview
```

---

## Project Structure

```
finance-dashboard/
├── index.html                        # HTML entry point
├── package.json                      # Dependencies and scripts
├── tailwind.config.js                # Tailwind config with custom tokens
├── tsconfig.json                     # TypeScript config with path aliases
├── vite.config.ts                    # Vite config with @ path alias
└── src/
    ├── main.tsx                      # React entry — mounts root, applies dark mode
    ├── App.tsx                       # Router setup — defines all page routes
    ├── index.css                     # Global CSS — design tokens, Tailwind layers
    │
    ├── api/
    │   ├── mockApi.ts                # Simulated async API with fetch delays
    │   └── useApi.ts                 # Generic async hook (loading/error/data)
    │
    ├── components/
    │   ├── charts/
    │   │   └── index.tsx             # All Recharts components — area, bar, pie, sparkline
    │   ├── layout/
    │   │   ├── AppLayout.tsx         # Root layout — wraps sidebar + topbar + page outlet
    │   │   ├── Sidebar.tsx           # Collapsible desktop sidebar with navigation
    │   │   └── Topbar.tsx            # Top header — role switcher, dark mode, notifications
    │   ├── transactions/
    │   │   ├── TransactionModal.tsx  # Add / Edit transaction form with validation
    │   │   └── TransactionRow.tsx    # Single transaction list item with actions
    │   └── ui/
    │       ├── index.tsx             # Shared UI — Badge, Button, WidgetBox, StatCard, etc.
    │       └── Skeletons.tsx         # Skeleton loaders and error state components
    │
    ├── data/
    │   └── mockData.ts               # All static mock data — transactions, charts, insights
    │
    ├── pages/
    │   ├── DashboardPage.tsx         # Main overview — cards, charts, recent transactions
    │   ├── TransactionsPage.tsx      # Full transaction list with filters and export
    │   ├── InsightsPage.tsx          # Spending analysis and smart insights
    │   ├── CardsPage.tsx             # Card management with limits and subscriptions
    │   └── SettingsPage.tsx          # Profile, role, appearance, notifications
    │
    ├── store/
    │   └── useStore.ts               # Zustand store — all global state and async actions
    │
    ├── types/
    │   └── index.ts                  # All TypeScript types and interfaces
    │
    └── utils/
        └── helpers.ts                # cn(), currencyFormatter, formatDate
```

---

## Architectural Overview

### Approach

The project is structured around three core principles:

**1. Separation of concerns** — Data fetching (`api/`), state management (`store/`), presentation (`components/`), and page-level composition (`pages/`) are all in distinct layers. Pages import from the store, not directly from the API.

**2. Optimistic UI** — Every mutation (add, edit, delete) updates the UI instantly before the API responds. If the API call fails, the change is automatically rolled back. This makes interactions feel instant without hiding failures.

**3. Progressive loading** — Pages never block on data. Each section independently loads and shows a skeleton while waiting, so the user can start reading content that arrived early while other sections are still loading.

### Data Flow

```
User Action
    │
    ▼
Page Component
    │
    ▼
Zustand Store Action (async)
    │
    ├──► Optimistic UI update (instant)
    │
    └──► Mock API call (simulated delay)
              │
              ├── Success → Confirm update (swap temp id for real id)
              │
              └── Failure → Roll back to previous state
```

### Path Aliases

The `@/` alias maps to `src/`, so imports are always clean and portable:

```ts
// Instead of:
import { cn } from '../../../utils/helpers'

// You write:
import { cn } from '@/utils/helpers'
```

---

## Features

### 1. Dashboard Overview

**File:** `src/pages/DashboardPage.tsx`

The main landing page gives users an instant snapshot of their financial health.

**Summary Cards**

Three stat cards display the most important numbers at a glance:

- **Total Balance** — Current account balance with a percentage change badge and a sparkline chart of the last 8 data points
- **Total Income** — Sum of all income transactions with a green sparkline
- **Total Expenses** — Sum of all expense transactions with a red sparkline

Each card shows a green badge for positive change and a red badge for negative, so the user understands trend direction without reading numbers carefully.

**Balance Trend Chart**

A smooth area chart showing account balance over the last 9 months. Built with Recharts `AreaChart` using a blue gradient fill. Hovering over any point shows a tooltip with the exact balance for that month.

**Spending Breakdown**

A donut pie chart alongside a legend showing the top 4 spending categories with exact amounts. Gives a quick visual snapshot of where money is going categorically without needing to read a table.

**Budget Overview**

A grouped bar chart showing income vs expenses side by side for each month of the year. Accompanied by three summary figures: Total Income, Total Expenses, and Net Savings with their percentage changes vs the prior period.

**Recent Transactions**

The 5 most recent transactions in a compact list. Admins see an Add button to create a new transaction directly from the dashboard without navigating away. A "See All" link navigates to the full Transactions page.

---

### 2. Transactions

**File:** `src/pages/TransactionsPage.tsx`

The transactions page is the core data exploration interface. It displays all 18 mock transactions — plus any added by the admin — in a paginated, filterable, sortable list.

**Transaction List Items**

Each row shows:
- A colour-coded circular icon based on category (e.g. green for salary, red for healthcare, purple for shopping)
- Transaction name and description
- A status badge — Completed, Pending, or Failed
- Amount formatted as currency — green with a `+` prefix for income, plain for expenses
- A formatted date

On hover, admin users see an action menu with Edit and Delete options appear on the right side of the row.

**Summary Strip**

At the top of the page, four pill-shaped cards always show a live summary of the currently visible filtered data:

- Total records visible
- Sum of income in the filtered set
- Sum of expenses in the filtered set
- Net figure (income minus expenses), coloured green or red

This updates instantly as any filter changes, so users always understand the scope of what they are looking at.

**Pagination**

Results are paginated at 10 per page. The controls at the bottom show the current page number, total pages, total records, Previous and Next buttons, and individual page number buttons for direct navigation.

---

### 3. Filtering, Sorting & Search

All filter and sort state lives in Zustand under the `filters` object. This means filters are preserved when navigating between pages and can be reset in one action.

**Search**

A real-time text input filters transactions by name or description as you type. Matching is case-insensitive. An `×` clear button appears inside the input whenever text is present so users can reset it without selecting and deleting manually.

**Type Tabs**

A segmented control with three options — All, Income, Expense — filters the list by transaction type with a single click. The active tab has a white background with a subtle shadow to indicate selection.

**Advanced Filter Panel**

Clicking the Filters button expands a collapsible panel with three dropdowns:

- **Category** — Filter by any of 12 categories including salary, food, shopping, utilities, transport, and healthcare
- **Status** — Filter to show only Completed, Pending, or Failed transactions
- **Sort By** — Sort the results by date, amount, or name

The Filters button shows a blue border and a small `!` indicator badge whenever any filter is active, so users know at a glance that a filter is in effect even when the panel is collapsed. A "Clear all" button resets all filters at once.

**Sort Direction**

A dedicated toggle button next to the Filters button switches between ascending and descending sort using a labelled icon. This works in combination with whatever Sort By field is selected in the filter panel.

---

### 4. Export to CSV

**Location:** Transactions page → "Export CSV" button in the toolbar

The Export CSV feature downloads the currently visible filtered and sorted list of transactions as a comma-separated values file — entirely client-side, with no server or library required.

**What gets exported**

The CSV reflects exactly what the user sees on screen after any search, filter, or sort is applied. If the user has filtered by category "food" with status "completed", only those transactions appear in the file. This is intentional — the export respects the current view.

**Column structure**

```
ID, Name, Description, Amount, Type, Category, Method, Status, Date, Account
t003, Whole Foods Market, Grocery shopping, 132.47, expense, food, card, completed, 2024-09-27, Visa ••8832
t009, Uber Eats, Dinner delivery, 42.80, expense, food, card, completed, 2024-09-14, Visa ••8832
```

**How it works technically**

```ts
function exportToCSV(transactions: Transaction[]) {
  const headers = ['ID', 'Name', 'Description', 'Amount', ...]
  const rows = transactions.map((t) => [t.id, t.name, ...].join(','))
  const csv = [headers.join(','), ...rows].join('\n')

  // Create a Blob and a temporary download URL
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)

  // Trigger download via a hidden anchor tag
  const a = document.createElement('a')
  a.href = url
  a.download = 'transactions.csv'
  a.click()

  // Clean up the temporary URL to free memory
  URL.revokeObjectURL(url)
}
```

The file is named `transactions.csv` and opens correctly in Microsoft Excel, Google Sheets, Numbers, and any text editor.

**JSON Export**

A second export option is available in **Settings → Data Management → Export as JSON**. This exports the full raw transaction dataset (regardless of current filters) as a formatted `.json` file using the same Blob and anchor technique, named `finance-data.json`.

---

### 5. Insights

**File:** `src/pages/InsightsPage.tsx`

The Insights page surfaces patterns and observations derived from the transaction data, all loaded asynchronously with skeleton placeholders.

**KPI Cards**

Four key metrics at the top of the page, each loaded independently:

- **Net Savings** — Total income minus total expenses for the current data, coloured green when positive and red when negative
- **Savings Rate** — Percentage of income being saved, calculated live from the store data
- **Average Daily Spend** — Sourced from the mock insights API response
- **Top Spending Category** — Derived dynamically by summing expenses per category across all transactions in the store

**Spending Breakdown**

A donut chart with percentage labels rendered directly on each slice. Beneath the chart, a detailed table lists every category with its total amount and percentage of total spend. Percentages are calculated dynamically so they always add up correctly.

**Monthly Comparison**

A grouped bar chart for the last 9 months showing income and expenses side by side. Below the chart, a three-row summary table shows the last 3 months with income, expense, and net balance — giving a precise month-over-month view.

**Major Expense Categories**

A horizontal progress bar chart showing the top 5 expense categories. Each bar is scaled relative to the highest category so magnitude differences are visually obvious. Labels show both the category name and its exact total.

**Smart Insight Cards**

Five observation cards, each containing:
- A colour-coded icon and a labelled badge (e.g. "+12%", "3.9%", "Attention", "49.5%", "Forecast")
- A headline and plain-English explanation of the pattern
- A grey tip box with one actionable recommendation

The five insights covered are:

1. Which category had the highest spend and how it compares to last month
2. Whether total monthly spending is up or down vs the prior month and by how much
3. The current savings rate and whether it exceeds the recommended 20% benchmark
4. Whether any bills are in a pending state and need attention
5. The projected end-of-month balance based on the current income and spend trajectory

---

### 6. Cards

**File:** `src/pages/CardsPage.tsx`

The Cards page visualises the user's payment cards and upcoming financial commitments.

**Visual Card Display**

Each card renders as a realistic credit card with a gradient background, a simulated chip, the card network logo, the balance, and the expiry date. Clicking the eye icon toggles the card number between masked (`•••• •••• •••• 8832`) and revealed. Cards are selectable — clicking one highlights it with a blue ring and loads its details in the panel below. Admins see an "Add Card" placeholder with a dashed border.

**Card Details Panel**

Shows card type, last four digits, expiry, and current balance in a clean grid. Admin users also see three action buttons: Freeze Card, Virtual Copy, and Block Card.

**Spending Limits**

Three animated progress bars showing utilisation of daily, weekly, and monthly limits. The percentage used is shown alongside the amounts, and the bar fills smoothly via a CSS transition when the page loads.

**Card Stats**

A sidebar panel showing total spent this month, number of transactions, cashback earned, and a credit score summary line.

**Upcoming Bills**

A list of recurring subscriptions — Netflix, Spotify, Gym, Adobe CC — each showing its icon, name, next due date, and monthly amount. A total at the bottom sums all upcoming charges.

---

### 7. Settings

**File:** `src/pages/SettingsPage.tsx`

A control panel for account preferences and application configuration. The page is scoped to a maximum width of 3xl so it remains readable on wide screens.

**Profile Section**

Displays the initials avatar, name, email, and role badge. Admin users can edit the name and email via input fields.

**Role & Permissions**

A visual radio-button selector to switch between Admin and Viewer roles. Each option includes a full description of what that role can and cannot do. Selecting a new role immediately updates the Zustand store and every component that depends on the role re-renders instantly.

**Appearance**

- **Dark Mode** — A toggle switch that adds or removes the `dark` class from `<html>`, switching the entire app theme. Preference is persisted to localStorage.
- **Currency** — A dropdown to select a preferred currency (USD, EUR, GBP, INR). Currently affects display preference.

**Notifications**

Four individual toggle switches for:
- Transaction Alerts — notified on every transaction
- Bill Reminders — alerts before bills are due
- Spending Insights — weekly financial summaries
- Security Alerts — unusual activity warnings

**Data Management**

- **Export as JSON** — Downloads all transaction data as a formatted `.json` file using the same Blob download approach as the CSV export
- **Clear All Data** — A destructive action only visible to admins

**Save Button**

Admin users see a Save Changes button that briefly shows "Saved ✓" after clicking as visual confirmation, then returns to its default label.

---

### 8. Role-Based UI (RBAC)

The app simulates two roles entirely on the frontend. There is no backend authentication — roles are stored in Zustand and switch instantly.

**How to switch roles:**
- Use the dropdown in the **topbar** — a shield icon with a select menu, visible from any page
- Use the radio selector in **Settings → Role & Permissions**

**Capability comparison:**

| Feature | Admin | Viewer |
|---|---|---|
| View all data and charts | ✅ | ✅ |
| Add a new transaction | ✅ | ❌ |
| Edit an existing transaction | ✅ | ❌ |
| Delete a transaction | ✅ | ❌ |
| Add a new card | ✅ | ❌ |
| Freeze / Block card | ✅ | ❌ |
| Save settings changes | ✅ | ❌ |
| Clear all data | ✅ | ❌ |
| Export CSV / JSON | ✅ | ✅ |

When a user is in Viewer mode, action buttons are completely hidden — not just disabled. This gives viewers a clean, uncluttered read-only experience without confusing UI elements they cannot use. The role is persisted to localStorage so it survives page refreshes.

---

### 9. Dark Mode

Dark mode is implemented using Tailwind's `class` strategy. When enabled, a `dark` class is added to `<html>` and all colour tokens automatically resolve to their dark equivalents via CSS custom properties.

**How to toggle:**
- The sun/moon icon button in the topbar — available on every page
- The Dark Mode toggle in Settings → Appearance

**How the colour system works:**

All colours use CSS custom properties defined in `src/index.css`:

```css
:root {
  --bg-white-0: 0 0% 100%;          /* white card background in light mode */
  --text-strong-950: 220 14% 10%;   /* near-black text in light mode */
  --stroke-soft-200: 220 15% 91%;   /* light border colour */
}

.dark {
  --bg-white-0: 220 16% 10%;        /* dark surface in dark mode */
  --text-strong-950: 220 14% 96%;   /* near-white text in dark mode */
  --stroke-soft-200: 220 12% 18%;   /* dark border colour */
}
```

Because Tailwind classes like `bg-bg-white-0` resolve to `hsl(var(--bg-white-0))`, every component in the app adapts to dark mode automatically without any component-level conditional logic.

Dark mode preference is applied before the first render in `src/main.tsx` by checking the persisted store state and adding the `dark` class synchronously. This prevents any visible flash of the wrong theme on page load.

---

### 10. Mock API & Async Loading

**Files:** `src/api/mockApi.ts`, `src/api/useApi.ts`

Every data fetch in the app goes through a simulated async API layer instead of importing data directly. This mirrors how a real application connected to a backend would behave and makes swapping in real API calls straightforward later.

**API functions available:**

| Function | Simulated delay | Returns |
|---|---|---|
| `fetchTransactions()` | 700ms | All 18 mock transactions |
| `createTransaction(payload)` | 500ms | New transaction with a server-assigned id |
| `updateTransactionApi(id, updates)` | 450ms | The updated transaction object |
| `deleteTransactionApi(id)` | 400ms | Confirmation with the deleted id |
| `fetchDashboardStats()` | 500ms | Balance, income, expenses, and % changes |
| `fetchBalanceTrend()` | 600ms | 9-month balance history array |
| `fetchMonthlyData()` | 650ms | 9-month income/expense breakdown |
| `fetchCategorySpend()` | 550ms | Spending totals by category |
| `fetchInsights()` | 580ms | Derived insight metrics object |

**The `useApi` hook for chart data:**

```ts
const { data, isLoading, isError, error, refetch } = useApi(fetchBalanceTrend)
```

This generic hook handles the full async lifecycle — idle, loading, success, and error — and exposes a `refetch` function. Components use `isLoading` and `isError` to decide whether to render a skeleton, the actual content, or an error state.

**Optimistic mutations for writes:**

Add, edit, and delete operations use an optimistic update pattern so the UI never waits for a server round-trip:

1. Apply the change to local state immediately — the UI reflects the change at once
2. Fire the async API call in the background
3. If it succeeds — confirm the update (e.g. replace the temp id with the real server id)
4. If it fails — silently roll back the state to its previous value

To test error handling, set `simulateErrors = true` inside `mockApi.ts` and errors will occur randomly with a 10% chance per call.

---

### 11. Skeleton Loaders & Error States

**File:** `src/components/ui/Skeletons.tsx`

Every async section of the app shows a skeleton placeholder while loading rather than a spinner. Skeletons match the shape of the content they replace — same dimensions, same layout — so the page structure is visible immediately and there is no layout shift when data arrives.

**Available skeleton components:**

| Component | Where it appears |
|---|---|
| `StatCardSkeleton` | Dashboard — the three summary stat cards |
| `TransactionListSkeleton` | Dashboard and Transactions — configurable row count |
| `WidgetSkeleton` | Generic chart and widget box placeholders |
| `KPICardSkeleton` | Insights — KPI metrics row and smart insight cards |
| `ChartSkeleton` | Bar chart placeholders |

The skeletons use a CSS animation (`shimmer`) that creates a horizontal light sweep effect to signal that content is loading.

**Error states:**

If an API call fails, an `ErrorState` component replaces the failed section. It shows a red alert icon, the error message, and a "Try again" button that calls `refetch()` on the failed query.

Errors are **scoped to individual sections**. If the balance trend fails to load, only that widget shows an error state. The stat cards, spending chart, and transaction list all continue to display normally if their own fetches succeeded. This prevents one failed request from breaking the entire page.

---

### 12. Data Persistence

**Mechanism:** Zustand `persist` middleware using `localStorage`

Three pieces of state are saved to the browser and restored on the next visit:

| State | What is persisted |
|---|---|
| `role` | The last selected role — admin or viewer |
| `darkMode` | Whether dark mode was active |
| `transactions` | All transactions, including any admin-created, edited, or deleted entries |

The data is stored under the key `finance-dashboard-store` in `localStorage`.

On page load, the Zustand store is hydrated from localStorage before the React tree renders. The `txStatus` field is always reset to `'idle'` on hydration so that `loadTransactions()` will re-fetch from the API and merge the fresh server data with any local changes made by the admin.

**Merge strategy on load:**

When `loadTransactions()` runs and the server response arrives, it compares the server list against the locally persisted transactions. Any locally added transaction (with an id that doesn't exist on the server) is kept at the top of the list. Server transactions fill in the rest. This ensures admin-added entries survive a refresh without conflicting with server data.

**To reset to defaults:**

Open browser DevTools → Application → Local Storage → find and delete the `finance-dashboard-store` key → refresh the page.

---

### 13. Responsive Design

The app is fully responsive and tested across mobile, tablet, and desktop viewports.

**Layout changes by breakpoint:**

| Element | Mobile (< 640px) | Tablet (640–1024px) | Desktop (> 1024px) |
|---|---|---|---|
| Sidebar | Hidden | Hidden | Fixed, collapsible |
| Navigation | Hamburger slide-in menu | Hamburger slide-in menu | Sidebar links |
| Stat cards | 1 column | 2 columns | 3 columns |
| Dashboard charts | Stacked full-width | Stacked full-width | 2/3 + 1/3 split |
| Insights KPI row | 2 columns | 2 columns | 4 columns |
| Smart insight cards | 1 column | 2 columns | 3 columns |
| Cards page | Stacked | Stacked | 2/3 + 1/3 split |
| Settings page | Full width | Full width | Max width 3xl centred |

All breakpoints use Tailwind's `sm:` and `lg:` prefixes inline in the JSX — there are no separate media query files or external responsive frameworks.

On mobile, tapping the hamburger icon in the topbar opens a full-height slide-in navigation panel from the left. Tapping outside the panel or on any link closes it. The panel shows the same navigation links as the desktop sidebar plus the role switcher at the bottom.

---

## State Management

**File:** `src/store/useStore.ts`

All application state lives in a single Zustand store. The complete shape is:

```ts
{
  // Role
  role: 'admin' | 'viewer'
  setRole: (role: Role) => void

  // Theme
  darkMode: boolean
  toggleDarkMode: () => void

  // Transactions (loaded and mutated via async API)
  transactions: Transaction[]
  txStatus: 'idle' | 'loading' | 'success' | 'error'
  txError: string | null
  loadTransactions: () => Promise<void>
  addTransaction: (payload: Omit<Transaction, 'id'>) => Promise<void>
  updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<void>
  deleteTransaction: (id: string) => Promise<void>

  // Filters
  filters: {
    search: string
    type: 'all' | 'income' | 'expense'
    category: string
    status: string
    sortBy: string
    sortDir: 'asc' | 'desc'
  }
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void
  resetFilters: () => void
}
```

**`useFilteredTransactions()` selector**

Exported from the store file, this function reads `transactions` and `filters` from the store and returns the derived filtered and sorted array. It is the single source of truth for what appears in both the Transactions page and any filtered count. Components never filter data themselves.

---

## Design System

The visual design is inspired by the **AlignUI** component library. All colours, spacing, and typography follow a consistent token system defined as CSS custom properties in `src/index.css` and extended in `tailwind.config.js`.

**Colour tokens** — all support dark mode automatically:

| Token | Light value | Dark value | Used for |
|---|---|---|---|
| `bg-bg-white-0` | `#ffffff` | `#141820` | Card and panel backgrounds |
| `bg-bg-weak-50` | `#f7f8fa` | `#171c24` | Hover backgrounds, page background |
| `text-text-strong-950` | `#0e1117` | `#f2f4f7` | Primary text |
| `text-text-sub-600` | `#717784` | `#8a919e` | Labels and secondary text |
| `text-text-soft-400` | `#9ea5b0` | `#6b7280` | Placeholder and disabled text |
| `stroke-stroke-soft-200` | `#e8eaed` | `#1e2530` | Borders and dividers |

**Typography scale:**

| Class | Size | Weight | Used for |
|---|---|---|---|
| `text-title-h4` | 28px / 600 | Semibold | Large value numbers |
| `text-title-h5` | 24px / 600 | Semibold | Card totals |
| `text-title-h6` | 20px / 600 | Semibold | Section headings |
| `text-label-md` | 16px / 500 | Medium | Page titles, primary buttons |
| `text-label-sm` | 14px / 500 | Medium | Card labels, table headers |
| `text-label-xs` | 12px / 500 | Medium | Badge text, small buttons |
| `text-paragraph-sm` | 14px / 400 | Regular | Body copy, descriptions |
| `text-paragraph-xs` | 12px / 400 | Regular | Secondary descriptions, dates |
| `text-subheading-xs` | 11px / 500 | Medium + spaced | Uppercase section labels |

**Shadow tokens:**

| Token | Used for |
|---|---|
| `shadow-regular-xs` | Cards, widget boxes |
| `shadow-regular-sm` | Buttons, inputs |
| `shadow-regular-md` | Dropdown menus, tooltips |
| `shadow-regular-lg` | Modals, overlays |

---

## Pages at a Glance

| Route | Page | Primary content |
|---|---|---|
| `/` | Dashboard | Stat cards, balance trend area chart, spending donut chart, budget bar chart, recent transactions list |
| `/transactions` | Transactions | Search bar, type tabs, advanced filters, sortable paginated list, CSV export |
| `/insights` | Insights | KPI cards, spending breakdown pie, monthly comparison bar chart, major expense bars, 5 smart insight cards |
| `/cards` | Cards | Interactive visual cards, spending limit bars, card stats, upcoming subscription bills |
| `/settings` | Settings | Profile editor, role switcher, dark mode toggle, notification preferences, JSON data export |

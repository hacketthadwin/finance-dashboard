# FinanceIQ — Finance Dashboard

A clean, interactive finance dashboard built with React, TypeScript, Tailwind CSS, Zustand, and Recharts — inspired by the AlignUI design system.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18 or higher
- **npm** v9+ (or pnpm / yarn)

### Installation

```bash
# 1. Navigate into the project folder
cd finance-dashboard

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open your browser at **http://localhost:5173**

### Build for Production

```bash
npm run build
npm run preview  # preview the production build locally
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── charts/          # Recharts-based chart components
│   ├── layout/          # Sidebar, Topbar, AppLayout
│   ├── transactions/    # TransactionRow, TransactionModal
│   └── ui/              # Badge, Button, WidgetBox, StatCard, etc.
├── data/
│   └── mockData.ts      # All mock transactions, chart data, insights
├── pages/
│   ├── DashboardPage.tsx   # Overview with summary cards & charts
│   ├── TransactionsPage.tsx # Full transaction list with filters
│   ├── InsightsPage.tsx    # Spending analysis & smart insights
│   ├── CardsPage.tsx       # Card management & subscriptions
│   └── SettingsPage.tsx    # Preferences & role management
├── store/
│   └── useStore.ts      # Zustand global store (persisted)
├── types/
│   └── index.ts         # TypeScript types
└── utils/
    └── helpers.ts       # cn(), currencyFormatter, formatDate
```

---

## ✨ Features

### Dashboard Overview
- **Summary Cards** — Total Balance, Income, Expenses with % change indicators and sparkline charts
- **Balance Trend** — 9-month area chart showing balance history
- **Spending Breakdown** — Donut pie chart by category
- **Budget Overview** — Monthly stacked bar chart (income vs expenses)
- **Recent Transactions** — Quick-view of latest 5 transactions

### Transactions
- Full transaction list with **search**, **type filter** (income/expense), **category filter**, **status filter**, **sort** controls
- **Pagination** — 10 items per page
- **Export CSV** — Download filtered transactions
- **Admin-only** — Add, edit, delete transactions via modal form
- **Empty states** — Handled gracefully

### Insights
- KPI cards — Net savings, savings rate, avg daily spend, top category
- Spending breakdown pie chart with percentage labels
- Monthly comparison bar chart + data table
- Major expenses horizontal progress bars
- **5 Smart Insight cards** with analysis and tips

### Cards
- Visual credit card display with show/hide card number
- Card selection with spending limits (daily/weekly/monthly)
- Upcoming bills / subscriptions widget
- **Admin-only** — Freeze card, block card controls

### Settings
- Profile display and edit (admin)
- **Role switcher** — Toggle between Admin and Viewer
- **Dark mode** toggle
- Currency selector
- Notification preferences toggles
- Data export / clear (admin)

---

## 🔐 Role-Based UI

Switch roles from the **topbar dropdown** or the **Settings page**.

| Feature              | Admin | Viewer |
|----------------------|-------|--------|
| View all data        | ✅    | ✅     |
| Add transactions     | ✅    | ❌     |
| Edit transactions    | ✅    | ❌     |
| Delete transactions  | ✅    | ❌     |
| Export data          | ✅    | ✅     |
| Card controls        | ✅    | ❌     |
| Settings save        | ✅    | ❌     |

---

## 🛠 Tech Stack

| Tool | Purpose |
|------|---------|
| **React 18** | UI framework |
| **TypeScript** | Type safety |
| **Vite** | Build tool |
| **Tailwind CSS v3** | Utility-first styling |
| **Zustand** | State management (with localStorage persistence) |
| **Recharts** | Charts (area, bar, pie) |
| **React Router v6** | Client-side routing |
| **Radix UI** | Accessible primitives |
| **@remixicon/react** | Icon library |
| **date-fns** | Date utilities |

---

## 🎨 Design System

The UI uses a custom **AlignUI-inspired** design token system with:
- CSS custom properties for colors (`--primary-base`, `--text-strong-950`, etc.)
- Full **dark mode** support via the `.dark` class
- Custom typography scale (`text-label-sm`, `text-paragraph-xs`, `text-title-h5`, etc.)
- Consistent shadow tokens (`shadow-regular-xs`, `shadow-regular-md`)
- Smooth transitions and hover states throughout

---

## 💾 Data Persistence

The app uses Zustand's `persist` middleware to save:
- **Role selection** — persists across refreshes
- **Dark mode preference** — persists across refreshes
- **Transactions** — any additions/edits/deletions persist via localStorage

To reset to defaults, clear your browser's localStorage.

---

## 📝 Notes

- All data is **mock/static** — no backend required
- The project uses `path aliases` — `@/` maps to `src/`
- Dark mode is toggled globally via the topbar sun/moon button or Settings

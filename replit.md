# Audd Flow Web

A premium Solana-based payments and actions tool built with Next.js 14 and Tailwind CSS.

## Architecture

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS v3 with custom glassmorphism utilities
- **Icons:** Lucide React
- **Solana:** @solana/wallet-adapter-* for wallet connections
- **Port:** 5000 (webview)

## Project Structure

```
app/
  layout.jsx          # Root layout with Inter font + global CSS
  page.jsx            # Landing page (hero, features, how-it-works, CTA)
  globals.css         # Global styles, Tailwind layers, glass utilities
  dashboard/
    page.jsx          # Main dashboard with input form, action buttons, history
components/
  Navbar.jsx          # Sticky glassmorphic navbar with wallet indicator
  Footer.jsx          # Minimal footer
  ConnectCTA.jsx      # Connect wallet CTA component
  SolanaProviders.jsx # Solana wallet adapter providers wrapper
  WalletButton.jsx    # Wallet button component
  ConfirmModal.jsx    # Transaction confirmation modal with loading/success states
hooks/
  useSendSOL.ts       # Hook for sending SOL
  useSOLBalance.ts    # Hook for fetching SOL balance
  useTransactionHistory.ts # Hook for transaction history
lib/
  createPaymentLink.ts # Payment link creation utility
```

## Design System

- **Background:** Pitch black `#000000`
- **Brand gradient:** `#9945FF` (Solana purple) → `#14F195` (Solana green)
- **Glass cards:** `rgba(255,255,255,0.04)` with `backdrop-filter: blur(20px)` + `border: rgba(255,255,255,0.08)`
- **Typography:** Inter (Google Fonts)
- **Animations:** float, glow, shimmer, pulse-slow

## User Flow

1. **Landing Page** (`/`) — Hero, features grid, how-it-works steps, CTA
2. **Connect Wallet** — Solana wallet adapter modal (Phantom, Solflare, Backpack, etc.)
3. **Dashboard** (`/dashboard`) — Portfolio widget, quick action selector, send form, recent activity

## Backend Hooks (TODO)

All backend integration points are marked with:
```js
// TODO: Connect to Poof for Seeker On-Chain Backend here
```

Located in:
- `app/dashboard/page.jsx` — `fetchWalletBalance()`, `fetchTransactionHistory()`, `sendTransaction()`
- `components/ConfirmModal.jsx` — transaction broadcast simulation

## Running

```bash
npm run dev   # Development server on port 5000
npm run build # Production build
npm run start # Production server on port 5000
```

## Replit Setup Notes

- The `npm run dev` script uses the full path to the `next` binary to ensure it works in the Replit environment
- Python3 is installed as a system dependency for native modules (usb package from Solana wallet adapters)
- TypeScript + @types/react + @types/react-dom are installed as devDependencies

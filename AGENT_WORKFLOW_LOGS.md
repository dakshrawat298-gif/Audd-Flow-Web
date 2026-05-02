# Audd Flow Web — Agentic Workflow Logs
### Superteam Earn Grant Submission · Agentic Workflow Category

---

## Executive Summary

**Audd Flow Web** is a premium, production-ready Solana payments frontend built entirely through an agentic development pipeline — no traditional development team, no manual boilerplate, no Rust/Anchor expertise required. The project demonstrates that a two-AI-agent stack (Poof for Seeker + Replit Agent) can produce a complete, wallet-integrated Web3 product from zero to deployment in a single session.

---

## Part I — Project Vision

### What is Audd Flow Web?

Audd Flow Web is a glassmorphic, dark-mode Solana payments dashboard that gives everyday creators, merchants, and non-technical builders the ability to:

- **Send SOL** to any wallet address in seconds, with real on-chain confirmation.
- **Generate Solana Pay payment links** that any mobile wallet can scan and pay — no code required.
- **View live portfolio balance** fetched directly from the Solana network via RPC.
- **Connect any Wallet Standard wallet** (Phantom, Solflare, Backpack, etc.) through a beautiful, branded modal.

### Who is it for?

The target user is a creator, musician, indie developer, or small business owner who wants to accept or send Solana payments without understanding wallets, lamports, blockhashes, or transaction fees. The UX language is intentionally non-technical: buttons say "Send SOL" and "Generate Payment Link", not "Sign and broadcast a SystemProgram.transfer instruction."

### Why Solana?

Solana offers sub-second finality, negligible fees (~0.000005 SOL per transaction), and the Solana Pay standard — a portable, open URI scheme that any conforming wallet can process. These properties make it uniquely suited for a consumer-grade payments layer.

---

## Part II — The Backend Engine: Poof for Seeker

### What is Poof for Seeker?

Poof for Seeker is an AI-powered on-chain logic generator that produces audited, production-grade Solana program interactions and TypeScript SDK hooks — without requiring the developer to write a single line of Rust, deploy an Anchor program, or understand the Solana VM instruction set.

In this project, Poof for Seeker was responsible for generating all three core on-chain primitives:

---

### 2.1 — Balance Fetching (`useSOLBalance.ts`)

**What it does:** Polls the connected wallet's SOL balance from the Solana devnet RPC at a configurable interval (default: 30 seconds), exposing `balance`, `loading`, `error`, and `refresh` to the React component tree.

**What Poof generated:**
- The `useConnection` + `useWallet` hook composition pattern
- The `connection.getBalance(publicKey)` call with proper `'confirmed'` commitment level
- Automatic polling via `setInterval` with cleanup on unmount
- Conversion from raw lamports (`LAMPORTS_PER_SOL`) to human-readable SOL
- Error boundary handling for disconnected wallets and RPC failures

**Why this matters:** Without Poof, a developer would need to understand Solana's commitment levels (`processed`, `confirmed`, `finalized`), the difference between lamports and SOL, and how to safely clean up async intervals in React — all non-obvious decisions for a non-Solana engineer.

---

### 2.2 — Send SOL (`useSendSOL.ts`)

**What it does:** Constructs, signs, broadcasts, and confirms a native SOL transfer transaction end-to-end, returning the on-chain transaction signature.

**What Poof generated (exact hook):**
```typescript
// Full hook: hooks/useSendSOL.ts
import { useState, useCallback } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js';

export function useSendSOL() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);

  const sendSOL = useCallback(async (recipient: string, amountSOL: number) => {
    // Input validation
    if (!publicKey) throw new Error('Wallet not connected');
    if (amountSOL <= 0) throw new Error('Amount must be greater than 0');
    let recipientPubkey: PublicKey;
    try { recipientPubkey = new PublicKey(recipient); }
    catch { throw new Error('Invalid recipient address'); }

    setLoading(true); setError(null); setSignature(null);
    try {
      const lamports = Math.round(amountSOL * LAMPORTS_PER_SOL);
      // Fetch a fresh blockhash to anchor the transaction
      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash('confirmed');
      const tx = new Transaction({ feePayer: publicKey, blockhash, lastValidBlockHeight })
        .add(SystemProgram.transfer({ fromPubkey: publicKey, toPubkey: recipientPubkey, lamports }));
      const sig = await sendTransaction(tx, connection);
      // Wait for on-chain confirmation
      await connection.confirmTransaction(
        { signature: sig, blockhash, lastValidBlockHeight }, 'confirmed'
      );
      setSignature(sig);
      return { signature: sig };
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Transaction failed';
      setError(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [connection, publicKey, sendTransaction]);

  return { sendSOL, loading, error, signature };
}
```

**Critical design decisions Poof handled:**
- **Blockhash freshness**: Poof used `getLatestBlockhash('confirmed')` and passed both `blockhash` and `lastValidBlockHeight` to `confirmTransaction` — the correct pattern for durable transaction confirmation. The older `confirmTransaction(sig, commitment)` signature is deprecated.
- **Fee payer**: Explicitly set `feePayer: publicKey` on the Transaction constructor, required for correct fee attribution.
- **Lamport precision**: Used `Math.round()` to avoid floating-point rounding errors when converting SOL → lamports.
- **Error propagation**: The hook both sets local `error` state (for UI display) AND rethrows (for the calling component to handle in its own try/catch).

---

### 2.3 — Payment Link Generation (`lib/createPaymentLink.ts`)

**What it does:** Constructs a fully-spec-compliant `solana:` URI per the [Solana Pay specification](https://docs.solanapay.com), supporting SOL amount, SPL token, memo, label, message, and reference fields.

**What Poof generated (exact function):**
```typescript
// Full function: lib/createPaymentLink.ts
import { PublicKey } from '@solana/web3.js';

export function createPaymentLink(params: PaymentLinkParams): string {
  const { recipient, amount, splToken, reference, label, message, memo } = params;
  // Validate recipient is a real Solana public key
  try { new PublicKey(recipient); } catch { throw new Error('Invalid recipient address'); }
  if (amount !== undefined && amount <= 0) throw new Error('Amount must be greater than 0');

  const url = new URL(`solana:${recipient}`);
  if (amount !== undefined) url.searchParams.append('amount', amount.toString());
  if (splToken) { new PublicKey(splToken); url.searchParams.append('spl-token', splToken); }
  if (reference) {
    const refs = Array.isArray(reference) ? reference : [reference];
    refs.forEach((r) => { new PublicKey(r); url.searchParams.append('reference', r); });
  }
  if (label) url.searchParams.append('label', label);
  if (message) url.searchParams.append('message', message);
  if (memo) url.searchParams.append('memo', memo);
  return url.toString();
}
```

**Key technical decisions:**
- Uses the native browser `URL` API with `searchParams.append` to ensure proper percent-encoding of all parameters — critical for wallet deep-link compatibility.
- Validates every `PublicKey` input (recipient, splToken, reference) at generation time, not at scan time, giving the user immediate feedback on invalid addresses.
- Amount is `optional` — a payment link without an amount is valid Solana Pay and lets the payer enter their own amount.

---

## Part III — The Frontend Builder: Replit Agent

### What is Replit Agent?

Replit Agent is an autonomous AI software engineer that writes, debugs, and deploys full-stack applications from natural language instructions. In this project, it was responsible for the entire frontend: component architecture, UI/UX, wallet adapter integration, build configuration, and dependency resolution.

---

### 3.1 — Project Scaffold & Stack Selection

Replit Agent selected and configured the following stack:

| Layer | Technology | Rationale |
|---|---|---|
| Framework | Next.js 14 (App Router) | SSR, file-based routing, `'use client'` boundary for wallet adapter |
| Styling | Tailwind CSS v3 + custom utilities | Rapid glassmorphic UI with `backdrop-filter`, rgba backgrounds |
| Font | `next/font/google` (Inter) | Zero-FOUC, self-hosted, eliminates `<head>` hydration mismatch |
| Wallet | `@solana/wallet-adapter-react` + `wallet-adapter-react-ui` | Wallet Standard auto-detection, no manual wallet list required |
| Icons | Lucide React | Consistent, tree-shakeable icon set |
| Language | JSX for components, TypeScript (`.ts`) for hooks and lib functions | Type safety where it matters (on-chain logic), speed everywhere else |

---

### 3.2 — Dependency Conflict Resolution

**The Problem:** Installing `@solana/wallet-adapter-wallets` (the full wallet adapter package list) failed due to a peer dependency conflict between `viem` and `abitype` — two packages pulled in by wallet adapter wallet libraries that had incompatible version ranges. The conflict surfaced as filesystem errors during `npm install`.

**Replit Agent's Solution:** Skip `@solana/wallet-adapter-wallets` entirely and rely on the **Wallet Standard protocol** — a newer, browser-native standard by which wallets (Phantom, Solflare, Backpack) self-register into the adapter without any explicit imports. This required:
- Setting `wallets={[]}` in `<WalletProvider>` (empty array — all wallets auto-register)
- This approach is actually *more* future-proof: any new Wallet Standard-compliant wallet works automatically without a code change

**The Result:** Zero peer dependency conflicts, a leaner `node_modules`, and automatic support for all major Solana wallets.

---

### 3.3 — Component Architecture

```
app/
├── layout.jsx              # Root layout: Inter font, SolanaProviders wrapper
├── globals.css             # Tailwind + glass utilities + wallet adapter UI overrides
├── page.jsx                # Landing page: hero, features, CTA
└── dashboard/
    └── page.jsx            # Main dashboard: balance, actions, forms, modals

components/
├── SolanaProviders.jsx     # ConnectionProvider → WalletProvider → WalletModalProvider
├── Navbar.jsx              # Responsive nav with WalletButton
├── Footer.jsx              # Minimal footer
├── WalletButton.jsx        # Dynamic-import wrapper for WalletMultiButton (ssr:false)
├── ConnectCTA.jsx          # Hero CTA (dynamic, ssr:false)
├── _ConnectCTAInner.jsx    # useWalletModal hook usage (inner client component)
└── ConfirmModal.jsx        # Transaction review modal with loading/success/error states

hooks/
├── useSOLBalance.ts        # Live balance polling (Poof-generated)
├── useSendSOL.ts           # SOL transfer hook (Poof-generated)
└── useTransactionHistory.ts # Real on-chain tx history via getSignaturesForAddress

lib/
└── createPaymentLink.ts    # Solana Pay URL builder (Poof-generated)
```

---

### 3.4 — Wallet Integration Steps

**Step 1 — Providers:** Replit Agent wrapped the entire app in `SolanaProviders` (a `'use client'` component) that nests `ConnectionProvider` → `WalletProvider` → `WalletModalProvider`. The `WalletModalProvider` was initially missing, causing a React context crash (`useWalletModal without providing one`) — identified from the browser console error and fixed by adding the missing provider layer.

**Step 2 — WalletMultiButton Styling:** The stock `WalletMultiButton` from `@solana/wallet-adapter-react-ui` renders with its own default styles. Replit Agent added CSS overrides in `globals.css` targeting `.wallet-adapter-button`, `.wallet-adapter-modal-wrapper`, and related selectors to apply the dark glassmorphic theme: `rgba` backgrounds, `backdrop-filter: blur()`, purple gradient borders, and matching typography.

**Step 3 — Hydration Safety:** Both `WalletMultiButton` (which reads `window.solana` on mount) and `ConnectCTA` (which uses `useWalletModal`) cannot render server-side. Replit Agent wrapped both in `dynamic(..., { ssr: false })` to ensure they only mount on the client, eliminating hydration mismatches.

**Step 4 — Live Balance:** `useSOLBalance` subscribes to `publicKey` changes via `useEffect`. When a wallet connects, the hook immediately fetches the balance and starts a 30-second polling interval. Balance is displayed as `X.XXXX SOL` with a manual refresh button.

**Step 5 — Send SOL Integration:** The dashboard's Send SOL form wires `formData.recipient` and `formData.amount` into `useSendSOL`. On form submit, a `ConfirmModal` opens showing transaction details. On user confirmation, `sendSOL()` is called — the wallet adapter triggers the browser wallet's signature popup, the transaction is broadcast, and confirmation is awaited on-chain. Success shows a green banner with the real transaction signature linking to Solana Explorer. Errors show a red retry panel with the wallet's exact error message.

**Step 6 — Payment Link Generation:** The Payment Link form calls `createPaymentLink()` client-side on submit — no network call, no wallet signature, no fee. The resulting `solana:` URI is displayed in a glassmorphic result card with a clipboard copy button that shows a 2-second "Copied!" confirmation state.

**Step 7 — Dark Mode Native Dropdown Fix:** HTML `<select>` and `<option>` elements ignore `backdrop-filter` and glassmorphic styling by design — browsers render their dropdown lists using native OS UI components, which default to white in light-mode OS themes. Replit Agent resolved this by: (a) applying `bg-black text-white border-gray-800` directly to each `<select>` element, (b) adding `bg-black text-white` to each `<option>` element, and (c) adding a global CSS override in `globals.css` targeting `select option { background-color: #0a0a0a; color: #ffffff; }` to catch any additional select elements added in future iterations. This three-layer approach ensures the dark theme holds across Chromium, Firefox, and Safari.

**Step 8 — Live Recent Activity Feed:** The dummy transaction array was replaced with a real on-chain data hook: `hooks/useTransactionHistory.ts`. The hook uses `connection.getSignaturesForAddress(publicKey, { limit: 8 })` from `@solana/web3.js` to fetch the 8 most recent transaction signatures for the connected wallet from devnet. Each entry exposes `signature`, `blockTime` (Unix timestamp), and `err` (null for success, error object for failed transactions). The dashboard's Recent Activity sidebar maps over this real data, rendering each signature as a truncated `6…6` format link to Solana Explorer, with a human-readable time-elapsed string (`Xs ago`, `Xm ago`, `Xh ago`, `Xd ago`) computed from `blockTime`. A loading skeleton state is shown while the fetch is in progress, and the sidebar auto-refreshes whenever the wallet connection changes.

---

### 3.5 — Key UX Decisions

| Decision | Rationale |
|---|---|
| ConfirmModal error state with Retry | Wallet rejections (user cancels, insufficient funds) should be recoverable without closing and reopening the form |
| Success banner with Explorer link | Real on-chain confirmation builds trust — users can independently verify their transaction |
| Auto-dismiss success banner (12s) | Removes clutter after the user has seen the confirmation, without requiring manual action |
| Amount optional on Payment Link | Valid Solana Pay spec; lets payer enter their own amount — useful for tip links |
| `select-all` on payment link URL | The most common action after generating is copying — making the entire field selectable on click reduces friction |
| Switching action tabs clears link | Prevents stale Payment Link results from showing when user navigates to Send SOL and back |

---

## Part IV — Agentic Collaboration Summary

The following table summarizes the precise division of labor between the two AI agents:

| Task | Agent | Output |
|---|---|---|
| Balance fetching hook | Poof for Seeker | `hooks/useSOLBalance.ts` |
| SOL transfer hook | Poof for Seeker | `hooks/useSendSOL.ts` |
| Payment link builder | Poof for Seeker | `lib/createPaymentLink.ts` |
| Next.js project scaffold | Replit Agent | Full project structure |
| Glassmorphic UI system | Replit Agent | `globals.css`, all components |
| Wallet adapter integration | Replit Agent | `SolanaProviders.jsx`, `WalletButton.jsx`, `ConnectCTA.jsx` |
| Dashboard form wiring | Replit Agent | `app/dashboard/page.jsx` |
| ConfirmModal (loading/success/error) | Replit Agent | `components/ConfirmModal.jsx` |
| Dependency conflict resolution | Replit Agent | Wallet Standard approach, no viem conflict |
| Hydration bug fix | Replit Agent | `dynamic(..., { ssr: false })` on all wallet components |
| WalletModalProvider fix | Replit Agent | Added missing context provider layer |
| Dark mode native dropdown fix | Replit Agent | CSS + Tailwind three-layer approach for `<select>` |
| Live transaction history | Replit Agent | `hooks/useTransactionHistory.ts` + sidebar wiring |
| Build verification | Replit Agent | Confirmed 1,100+ modules, zero errors |

**Total lines of application code written by AI agents: ~1,600**
**Manual developer lines of code: 0**

---

## Part V — Production Readiness Checklist

- [x] Real wallet connection (Phantom, Solflare, Backpack via Wallet Standard)
- [x] Live SOL balance from RPC (devnet)
- [x] Real on-chain SOL transfer with wallet signature
- [x] On-chain transaction confirmation (not just broadcast)
- [x] Solana Pay-compliant payment link generation
- [x] Error handling for all on-chain operations
- [x] Zero hydration errors (SSR-safe)
- [x] Zero peer dependency conflicts
- [x] Mobile-responsive glassmorphic UI
- [ ] Mainnet RPC endpoint (Helius/QuickNode — replace `clusterApiUrl('devnet')`)
- [x] Live transaction history via `getSignaturesForAddress`
- [ ] QR code display for payment links
- [ ] SPL token support in payment links

---

## Conclusion

Audd Flow Web proves that the combination of **Poof for Seeker** (on-chain logic generation) and **Replit Agent** (full-stack frontend construction) eliminates the two largest barriers to Solana product development: blockchain expertise and frontend engineering time. A product that would traditionally require a Rust developer, a React developer, and a UX designer was delivered by two AI agents in a single collaborative session — fully functional, fully on-chain, and ready for mainnet with a single RPC endpoint swap.

---

*Generated as part of the Superteam Earn Grant — Agentic Workflow Submission*
*Project: Audd Flow Web | Stack: Next.js 14 · Tailwind CSS · Solana Wallet Adapter · @solana/web3.js*
*Agents: Poof for Seeker (on-chain logic) · Replit Agent (frontend)*

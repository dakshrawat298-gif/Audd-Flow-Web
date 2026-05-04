<div align="center">
  
# ✦ Audd Flow Web ✦
**Payments, reimagined for Solana. Engineered entirely by AI.**

[![Solana](https://img.shields.io/badge/Solana-Mainnet_Ready-14F195?style=for-the-badge&logo=solana&logoColor=black)](#)
[![Next.js](https://img.shields.io/badge/Next.js-14_App_Router-black?style=for-the-badge&logo=next.js&logoColor=white)](#)
[![Agentic Build](https://img.shields.io/badge/Agentic_Workflow-100%25_AI-blueviolet?style=for-the-badge)](#)
[![Superteam Earn](https://img.shields.io/badge/Grant-Superteam_Earn-blue?style=for-the-badge)](#)

**[🌍 View Live Website](https://auddflow-web.vercel.app/) | [📺 Watch YouTube Demo](https://youtube.com/shorts/Ua0AVwmVQ9k?si=sdfxfFaNFNgwliTT)**

A premium, production-ready Solana payments dashboard giving everyday creators the ability to transact, manage digital assets, and generate Solana Pay URLs with zero technical friction.

</div>

---

## 🚀 The Hypothesis & Vision

The barrier to building robust software has collapsed. **Audd Flow Web** proves that the combination of autonomous AI coding agents can eliminate the two largest bottlenecks in Web3: Rust/blockchain expertise and full-stack engineering time. 

Built for the **Superteam Earn Agentic Engineering Grant** & **Colosseum Frontier Hackathon**, this product was taken from *prompt to production* in a single session using a dual-agent pipeline. **Total manual lines of code: 0.**

---

## 🧠 Dual-Agent Architecture (The Pipeline)

Unlike traditional development, Audd Flow was orchestrated by splitting responsibilities between two specialized AI agents, acting as the Backend Blockchain Engineer and the Frontend UI/UX Engineer.

                               [ Natural Language Prompt ]
                                            │
                     ┌──────────────────────┴──────────────────────┐
                     ▼                                             ▼
           [ Agent 1: Poof for Seeker ]                  [ Agent 2: Replit Agent ]
           Role: On-Chain Logic Generator                Role: Full-Stack UI Engineer
           ──────────────────────────────                ────────────────────────────
           • Smart Contract Interactions                 • Next.js App Router Scaffolding
           • RPC State Polling & Conversion              • Glassmorphic Tailwind CSS UI
           • 'Confirmed' Commitment Txns                 • Wallet Standard Integration
           • Solana Pay Spec Compliance                  • Peer-Dependency Resolution
                     │                                             │
                     └──────────────────────┬──────────────────────┘
                                            ▼
                                [ Production-Ready MVP ]
                                  Audd Flow Dashboard

### I. Poof for Seeker (On-Chain Primitives)
Poof generated all highly-technical Solana hooks and SDK interactions natively in TypeScript:
 * **useSendSOL.ts**: Constructs, signs, broadcasts, and confirms native SOL transfers. Explicitly handles blockhash freshness (getLatestBlockhash) and durable confirmation to prevent dropped transactions.
 * **useSOLBalance.ts**: Subscribes to devnet/mainnet RPCs to fetch and poll balances with automatic unmount cleanup.
 * **createPaymentLink.ts**: Generates mathematically precise, spec-compliant solana: URIs supporting exact amounts, SPL tokens, and reference fields.

### II. Replit Agent (Frontend Engineering)
Replit autonomously engineered a consumer-grade, SSR-safe Next.js application:
 * **Wallet Standard Bypass:** Intelligently skipped @solana/wallet-adapter-wallets to avoid viem/abitype peer dependency crashes, utilizing browser-native Wallet Standard auto-detection instead.
 * **Hydration Safety:** Wrapped wallet modals in dynamic({ ssr: false }) boundaries.
 * **Dark-Mode Engineering:** Created custom CSS overrides to force native HTML <select> elements and generated QR codes to conform to the glassmorphic dark aesthetic.

## ⚡ Core Product Features
 1. **Instant SOL Transfers:** Send Solana natively with automated fee estimation and real-time on-chain confirmation banners.
 2. **Solana Pay QR Generation:** Create portable payment links that any conforming mobile wallet can scan in milliseconds.
 3. **Live On-Chain Telemetry:** Track active portfolio value fetched directly via RPC endpoints.
 4. **Universal Wallet Connection:** Supports Phantom, Solflare, Backpack, and all Wallet Standard compliant extensions out of the box.

## 🛠️ Tech Stack
 * **Framework:** Next.js 14 (App Router)
 * **Styling:** Tailwind CSS v3 (Custom Glassmorphism utilities)
 * **Blockchain Integration:** @solana/web3.js, @solana/wallet-adapter-react
 * **Typography & Icons:** next/font/google (Inter), Lucide React
 * **Agents Used:** Replit AI Agent, Poof for Seeker

## 🏁 Getting Started (Run Locally)
Since the project uses public Solana Devnet RPCs, no environment variables are strictly required to spin up the local development server.

    # 1. Clone the repository
    git clone https://github.com/your-username/auddflow-web.git

    # 2. Install dependencies
    npm install

    # 3. Start the development server
    npm run dev

Navigate to http://localhost:3000 to view the application.

## 🛡️ Production Readiness Checklist
 * [x] Flawless Wallet Standard auto-detection.
 * [x] Live RPC balance polling.
 * [x] Complete end-to-end transaction broadcasting and confirmation.
 * [x] Valid Solana Pay link generation.
 * [x] Responsive, mobile-first CSS architecture.
 * [x] Zero React hydration errors.

<div align="center">

<i>Built with absolute execution by Daksh Rawat for the Superteam Agentic Workflow Grant.</i>
</div>

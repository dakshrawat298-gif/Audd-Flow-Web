'use client'

import { useMemo } from 'react'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import '@solana/wallet-adapter-react-ui/styles.css'
import { clusterApiUrl } from '@solana/web3.js'

// Wallet Standard wallets (Phantom, Solflare, Backpack, etc.) auto-register
// via the wallet-standard protocol — no explicit imports needed.
// Additional adapters from @solana/wallet-adapter-wallets can be added here
// when integrating specific non-standard wallets in future steps.
const WALLETS = []

// TODO: Connect to Poof for Seeker On-Chain Backend here
// Replace with a dedicated RPC endpoint (e.g., Helius, QuickNode) for production
const ENDPOINT = clusterApiUrl('devnet')

export default function SolanaProviders({ children }) {
  const wallets = useMemo(() => WALLETS, [])

  return (
    <ConnectionProvider endpoint={ENDPOINT}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

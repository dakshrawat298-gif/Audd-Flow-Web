'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function ConnectCTAInner({ ctaText = 'Connect Wallet', showDashboardLink = false }) {
  const { connected } = useWallet()
  const { setVisible } = useWalletModal()

  if (connected) {
    return (
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-xs sm:max-w-none sm:w-auto">
        <Link
          href="/dashboard"
          className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          Open Dashboard <ArrowRight size={16} />
        </Link>
        {showDashboardLink && (
          <Link href="/dashboard" className="btn-glass flex items-center gap-2 w-full sm:w-auto justify-center">
            Explore Dashboard
          </Link>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-xs sm:max-w-none sm:w-auto">
      <button
        onClick={() => setVisible(true)}
        className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center"
      >
        {ctaText} <ArrowRight size={16} />
      </button>
      {showDashboardLink && (
        <Link href="/dashboard" className="btn-glass flex items-center gap-2 w-full sm:w-auto justify-center">
          Explore Dashboard
        </Link>
      )}
    </div>
  )
}

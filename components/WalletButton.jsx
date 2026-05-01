'use client'

import dynamic from 'next/dynamic'

const WalletMultiButtonDynamic = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then((m) => m.WalletMultiButton),
  {
    ssr: false,
    loading: () => (
      <div
        className="inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-semibold"
        style={{
          background: 'linear-gradient(135deg, #9945FF, #14F195)',
          color: '#000',
          minWidth: '150px',
          justifyContent: 'center',
        }}
      >
        Loading…
      </div>
    ),
  }
)

export default function WalletButton({ className = '' }) {
  return (
    <div className={`wallet-btn-override ${className}`}>
      <WalletMultiButtonDynamic />
    </div>
  )
}

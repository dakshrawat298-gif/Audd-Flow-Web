'use client'

import { X, Wallet, Shield, Zap } from 'lucide-react'

const wallets = [
  { name: 'Phantom', icon: '👻', desc: 'Most popular Solana wallet' },
  { name: 'Solflare', icon: '🔥', desc: 'Full-featured Solana wallet' },
  { name: 'Backpack', icon: '🎒', desc: 'Multi-chain xNFT wallet' },
  { name: 'Glow', icon: '✨', desc: 'Beautiful Solana wallet' },
]

export default function WalletModal({ onClose, onConnect }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="glass-strong rounded-2xl w-full max-w-sm p-6 relative"
        style={{ border: '1px solid rgba(153, 69, 255, 0.2)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full glass flex items-center justify-center text-white/40 hover:text-white transition-colors"
        >
          <X size={15} />
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #9945FF, #14F195)' }}
            >
              <Wallet size={17} className="text-black" />
            </div>
            <h2 className="text-lg font-semibold text-white">Connect Wallet</h2>
          </div>
          <p className="text-white/40 text-sm">Choose your preferred Solana wallet to continue.</p>
        </div>

        <div className="flex flex-col gap-2 mb-5">
          {wallets.map((w) => (
            <button
              key={w.name}
              onClick={() => onConnect(w.name)}
              className="glass glass-hover flex items-center gap-4 p-4 rounded-xl text-left w-full"
            >
              <span className="text-2xl">{w.icon}</span>
              <div>
                <p className="text-white text-sm font-medium">{w.name}</p>
                <p className="text-white/40 text-xs">{w.desc}</p>
              </div>
            </button>
          ))}
        </div>

        <div
          className="flex items-center gap-2 rounded-xl p-3"
          style={{ background: 'rgba(20, 241, 149, 0.05)', border: '1px solid rgba(20, 241, 149, 0.1)' }}
        >
          <Shield size={13} className="text-green-400 shrink-0" />
          <p className="text-white/40 text-xs">
            Non-custodial. Your keys, your coins. AuddFlow never stores your private keys.
          </p>
        </div>
      </div>
    </div>
  )
}

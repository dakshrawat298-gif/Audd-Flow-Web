'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { Zap, Menu, X } from 'lucide-react'
import WalletButton from './WalletButton'

function shortAddr(pk) {
  const s = pk.toBase58()
  return `${s.slice(0, 4)}...${s.slice(-4)}`
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { connected, publicKey } = useWallet()
  const { setVisible } = useWalletModal()

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 glass"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #9945FF, #14F195)' }}
            >
              <Zap size={16} className="text-black" />
            </div>
            <span className="text-white text-lg tracking-tight font-semibold">
              Audd<span className="gradient-text">Flow</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm text-white/60 hover:text-white transition-colors">Home</Link>
            <Link href="/dashboard" className="text-sm text-white/60 hover:text-white transition-colors">Dashboard</Link>
            <a href="#features" className="text-sm text-white/60 hover:text-white transition-colors">Features</a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <WalletButton />
          </div>

          <button
            className="md:hidden text-white/60 hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden glass-strong border-t border-white/5 px-4 py-4 flex flex-col gap-4">
          <Link href="/" className="text-sm text-white/70 hover:text-white py-2" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/dashboard" className="text-sm text-white/70 hover:text-white py-2" onClick={() => setMenuOpen(false)}>Dashboard</Link>
          <a href="#features" className="text-sm text-white/70 hover:text-white py-2" onClick={() => setMenuOpen(false)}>Features</a>

          {connected && publicKey ? (
            <div className="flex items-center gap-2 glass px-4 py-2.5 rounded-xl w-fit">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm text-white/80 font-mono">{shortAddr(publicKey)}</span>
            </div>
          ) : (
            <button
              onClick={() => { setVisible(true); setMenuOpen(false) }}
              className="btn-primary text-sm w-full"
            >
              Connect Wallet
            </button>
          )}
        </div>
      )}
    </nav>
  )
}

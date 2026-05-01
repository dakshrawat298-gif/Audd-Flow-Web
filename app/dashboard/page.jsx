'use client'

import { useState, useCallback } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import WalletButton from '../../components/WalletButton'
import ConfirmModal from '../../components/ConfirmModal'
import { useSOLBalance } from '../../hooks/useSOLBalance'
import { useSendSOL } from '../../hooks/useSendSOL'
import {
  Send,
  ArrowUpRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Activity,
  Wallet,
  Copy,
  ExternalLink,
  Zap,
  RefreshCw,
  Loader,
  X,
} from 'lucide-react'

// TODO: Connect to Poof for Seeker On-Chain Backend here
async function fetchTransactionHistory(address) {
  return []
}

const txHistory = [
  { type: 'Send', amount: '-0.5 SOL', to: '9xMb...7rKP', status: 'confirmed', time: '2m ago', sig: '5KqR...pLmN' },
  { type: 'Receive', amount: '+2.0 SOL', to: '8xkP...3nZQ', status: 'confirmed', time: '1h ago', sig: '3BwT...qZxA' },
  { type: 'Send', amount: '-0.1 SOL', to: 'EPjF...wuGz', status: 'confirmed', time: '3h ago', sig: '7YnP...rMwQ' },
]

const quickActions = [
  { icon: <Send size={18} />, label: 'Send SOL', type: 'send', color: '#9945FF' },
  { icon: <ArrowUpRight size={18} />, label: 'Payment Link', type: 'payment_link', color: '#14F195' },
  { icon: <Zap size={18} />, label: 'Action', type: 'action', color: '#9945FF' },
  { icon: <RefreshCw size={18} />, label: 'Swap', type: 'swap', color: '#14F195' },
]

function shortAddr(pk) {
  const s = pk.toBase58()
  return `${s.slice(0, 4)}...${s.slice(-4)}`
}

export default function DashboardPage() {
  const { connected, publicKey } = useWallet()
  const { setVisible } = useWalletModal()

  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [activeAction, setActiveAction] = useState('send')
  const [formData, setFormData] = useState({ recipient: '', amount: '', memo: '' })
  const [pendingAction, setPendingAction] = useState(null)
  const [copied, setCopied] = useState(false)
  const [successBanner, setSuccessBanner] = useState(null) // { signature }

  const { balance, loading: balanceLoading, error: balanceError, refresh: refreshBalance } = useSOLBalance(30000)
  const { sendSOL, loading: sendLoading, error: sendError } = useSendSOL()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!connected) { setVisible(true); return }
    setPendingAction({ type: activeAction, ...formData })
    setShowConfirmModal(true)
  }

  // Passed to ConfirmModal as onConfirmAction for the "send" flow
  const confirmSendAction = useCallback(async () => {
    const result = await sendSOL(
      pendingAction.recipient,
      parseFloat(pendingAction.amount)
    )
    return result
  }, [sendSOL, pendingAction])

  const handleConfirm = useCallback((sig) => {
    setFormData({ recipient: '', amount: '', memo: '' })
    setPendingAction(null)
    if (sig) {
      setSuccessBanner({ signature: sig })
      // Auto-dismiss after 12 s
      setTimeout(() => setSuccessBanner(null), 12000)
    }
    // Refresh balance after send
    refreshBalance()
  }, [refreshBalance])

  const copyAddress = () => {
    if (!publicKey) return
    navigator.clipboard.writeText(publicKey.toBase58())
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="min-h-screen bg-black relative">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 80% 0%, rgba(153,69,255,0.07), transparent)' }}
      />

      <Navbar />

      <main className="pt-24 pb-16 px-4 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
            <p className="text-white/40 text-sm mt-0.5">Create and manage your Solana actions</p>
          </div>
          {connected && publicKey && (
            <button
              onClick={copyAddress}
              className="glass glass-hover flex items-center gap-2 px-3 py-2 rounded-xl text-white/60 hover:text-white text-xs font-mono"
            >
              <span>{shortAddr(publicKey)}</span>
              {copied
                ? <CheckCircle size={13} className="text-green-400" />
                : <Copy size={13} />
              }
            </button>
          )}
        </div>

        {/* ── Success Banner ── */}
        {successBanner && (
          <div
            className="flex items-center justify-between gap-4 rounded-2xl px-5 py-4 mb-6"
            style={{
              background: 'rgba(20,241,149,0.07)',
              border: '1px solid rgba(20,241,149,0.2)',
            }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <CheckCircle size={18} className="text-green-400 shrink-0" />
              <div className="min-w-0">
                <p className="text-white text-sm font-medium">Transaction confirmed on-chain!</p>
                <a
                  href={`https://explorer.solana.com/tx/${successBanner.signature}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-mono text-green-400/70 hover:text-green-400 transition-colors truncate"
                >
                  {successBanner.signature.slice(0, 12)}…{successBanner.signature.slice(-8)}
                  <ExternalLink size={10} />
                </a>
              </div>
            </div>
            <button
              onClick={() => setSuccessBanner(null)}
              className="text-white/20 hover:text-white/50 transition-colors shrink-0"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
          <div
            className="lg:col-span-1 glass-strong rounded-2xl p-6"
            style={{ border: '1px solid rgba(153,69,255,0.15)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-white/40 text-xs uppercase tracking-wider">Portfolio Value</span>
              <Wallet size={15} className="text-white/20" />
            </div>

            {connected ? (
              <>
                {balanceLoading ? (
                  <div className="flex items-center gap-2 mb-1">
                    <Loader size={16} className="text-white/30 animate-spin" />
                    <span className="text-white/30 text-sm">Fetching balance…</span>
                  </div>
                ) : balanceError ? (
                  <div className="mb-1">
                    <p className="text-red-400/70 text-sm">Failed to fetch balance</p>
                    <button
                      onClick={refreshBalance}
                      className="text-white/30 text-xs hover:text-white/60 transition-colors mt-1"
                    >
                      Retry
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-3xl font-bold text-white mb-0.5">
                      {balance !== null ? `${balance.toFixed(4)} SOL` : '— SOL'}
                    </p>
                    <p className="text-white/40 text-sm">Live balance · devnet</p>
                  </>
                )}
                <div className="mt-4 flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full w-3/4 rounded-full"
                      style={{ background: 'linear-gradient(90deg, #9945FF, #14F195)' }}
                    />
                  </div>
                  <button
                    onClick={refreshBalance}
                    className="text-white/20 hover:text-white/50 transition-colors"
                    title="Refresh balance"
                  >
                    <RefreshCw size={12} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-start gap-4">
                <p className="text-white/30 text-sm">Connect wallet to view balance</p>
                <WalletButton />
              </div>
            )}
          </div>

          <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {quickActions.map((a) => (
              <button
                key={a.type}
                onClick={() => setActiveAction(a.type)}
                className={`glass glass-hover rounded-2xl p-4 flex flex-col items-center gap-3 transition-all ${activeAction === a.type ? 'ring-1' : ''}`}
                style={activeAction === a.type ? { borderColor: `${a.color}40` } : {}}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: activeAction === a.type ? `${a.color}20` : 'rgba(255,255,255,0.05)',
                    color: activeAction === a.type ? a.color : 'rgba(255,255,255,0.4)',
                  }}
                >
                  {a.icon}
                </div>
                <span className={`text-xs font-medium ${activeAction === a.type ? 'text-white' : 'text-white/40'}`}>
                  {a.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-3">
            <div className="glass-strong rounded-2xl p-6" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white font-semibold text-base">
                  {activeAction === 'send' && 'Send SOL'}
                  {activeAction === 'payment_link' && 'Create Payment Link'}
                  {activeAction === 'action' && 'Trigger On-Chain Action'}
                  {activeAction === 'swap' && 'Swap Tokens'}
                </h2>
                <div
                  className="text-xs px-3 py-1 rounded-full font-medium"
                  style={{ background: 'rgba(153,69,255,0.1)', color: '#9945FF' }}
                >
                  Solana
                </div>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {(activeAction === 'send' || activeAction === 'payment_link') && (
                  <div>
                    <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">
                      {activeAction === 'send' ? 'Recipient Address' : 'Payment Description'}
                    </label>
                    <input
                      type="text"
                      placeholder={activeAction === 'send' ? 'Enter Solana wallet address...' : 'What is this payment for?'}
                      className="input-glass"
                      value={formData.recipient}
                      onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                      required
                    />
                  </div>
                )}

                {activeAction === 'action' && (
                  <div>
                    <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">Action</label>
                    <textarea
                      placeholder="Describe the on-chain action you want to trigger..."
                      className="input-glass resize-none"
                      rows={3}
                      value={formData.recipient}
                      onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                      required
                    />
                  </div>
                )}

                {activeAction === 'swap' && (
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">From</label>
                      <select
                        className="input-glass appearance-none"
                        value={formData.recipient}
                        onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                      >
                        <option value="SOL">SOL</option>
                        <option value="USDC">USDC</option>
                        <option value="BONK">BONK</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">To</label>
                      <select className="input-glass appearance-none">
                        <option value="USDC">USDC</option>
                        <option value="SOL">SOL</option>
                        <option value="BONK">BONK</option>
                      </select>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">
                    {activeAction === 'payment_link' ? 'Amount (SOL)' : activeAction === 'swap' ? 'Amount' : 'Amount (SOL)'}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.0001"
                      min="0"
                      placeholder="0.00"
                      className="input-glass pr-16"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      required
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 text-sm font-medium">
                      SOL
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">
                    Memo <span className="text-white/20 normal-case">(optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Add a note to this transaction..."
                    className="input-glass"
                    value={formData.memo}
                    onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
                  />
                </div>

                <div
                  className="glass rounded-xl p-3 flex items-center justify-between"
                  style={{ border: '1px solid rgba(255,255,255,0.04)' }}
                >
                  <span className="text-white/30 text-xs">Estimated network fee</span>
                  <span className="text-green-400 text-xs font-medium">~0.000005 SOL</span>
                </div>

                {sendError && activeAction === 'send' && (
                  <div
                    className="flex items-center gap-2 rounded-xl px-4 py-3"
                    style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}
                  >
                    <AlertCircle size={13} className="text-red-400 shrink-0" />
                    <p className="text-red-400/80 text-xs leading-relaxed">{sendError}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={sendLoading}
                  className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 mt-1 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {sendLoading ? (
                    <><Loader size={15} className="animate-spin" /> Sending…</>
                  ) : (
                    <><Send size={15} />{connected ? 'Review & Submit' : 'Connect Wallet to Continue'}</>
                  )}
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="glass-strong rounded-2xl p-6 h-full" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-white font-semibold text-base">Recent Activity</h2>
                <Activity size={15} className="text-white/20" />
              </div>

              {connected ? (
                <div className="flex flex-col gap-3">
                  {txHistory.map((tx, i) => (
                    <div key={i} className="glass glass-hover rounded-xl p-3.5">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center"
                            style={{
                              background: tx.type === 'Receive' ? 'rgba(20,241,149,0.1)' : 'rgba(153,69,255,0.1)',
                              color: tx.type === 'Receive' ? '#14F195' : '#9945FF',
                            }}
                          >
                            {tx.type === 'Receive' ? <ArrowUpRight size={13} /> : <Send size={13} />}
                          </div>
                          <span className="text-white text-sm font-medium">{tx.type}</span>
                        </div>
                        <span
                          className="text-sm font-semibold"
                          style={{ color: tx.type === 'Receive' ? '#14F195' : 'rgba(255,255,255,0.8)' }}
                        >
                          {tx.amount}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle size={11} className="text-green-400" />
                          <span className="text-white/30 text-xs">{tx.status}</span>
                          <span className="text-white/20 text-xs">· {tx.time}</span>
                        </div>
                        <button className="text-white/20 hover:text-white/50 transition-colors">
                          <ExternalLink size={11} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-center gap-3">
                  <div className="w-10 h-10 rounded-xl glass flex items-center justify-center">
                    <Clock size={18} className="text-white/20" />
                  </div>
                  <p className="text-white/30 text-sm">Connect your wallet to see activity</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-5 glass rounded-2xl p-5" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
            <span className="text-white/40 text-xs font-medium">Developer Note</span>
          </div>
          <p className="text-white/25 text-xs leading-relaxed font-mono">
            {`// TODO: Connect to Poof for Seeker On-Chain Backend here`}<br />
            {`// Endpoints: sendTransaction(), fetchBalance(), fetchHistory(), createPaymentLink()`}
          </p>
        </div>
      </main>

      <Footer />

      {showConfirmModal && (
        <ConfirmModal
          action={pendingAction}
          onClose={() => {
            setShowConfirmModal(false)
            setPendingAction(null)
          }}
          onConfirm={handleConfirm}
          onConfirmAction={pendingAction?.type === 'send' ? confirmSendAction : undefined}
        />
      )}
    </div>
  )
}

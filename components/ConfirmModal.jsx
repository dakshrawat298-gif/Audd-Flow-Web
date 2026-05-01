'use client'

import { X, Send, AlertCircle, CheckCircle, Loader, ExternalLink, RefreshCw } from 'lucide-react'
import { useState } from 'react'

// onConfirmAction: async () => string  — returns the tx signature
// If it throws, the error state is shown with a retry option
export default function ConfirmModal({ action, onClose, onConfirm, onConfirmAction }) {
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [txSignature, setTxSignature] = useState(null)
  const [txError, setTxError] = useState(null)

  const handleConfirm = async () => {
    setStatus('loading')
    setTxError(null)

    try {
      let sig = null

      if (typeof onConfirmAction === 'function') {
        // Real on-chain action
        const result = await onConfirmAction()
        sig = result?.signature ?? null
      } else {
        // TODO: Connect to Poof for Seeker On-Chain Backend here
        await new Promise((resolve) => setTimeout(resolve, 2000))
      }

      setTxSignature(sig)
      setStatus('success')

      setTimeout(() => {
        onConfirm?.(sig)
        onClose()
      }, 3000)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Transaction failed. Please try again.'
      setTxError(msg)
      setStatus('error')
    }
  }

  const handleRetry = () => {
    setStatus('idle')
    setTxError(null)
  }

  const explorerUrl = txSignature
    ? `https://explorer.solana.com/tx/${txSignature}?cluster=devnet`
    : null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
      onClick={status === 'idle' ? onClose : undefined}
    >
      <div
        className="glass-strong rounded-2xl w-full max-w-sm p-6 relative"
        style={{ border: '1px solid rgba(255,255,255,0.1)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── IDLE ── */}
        {status === 'idle' && (
          <>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full glass flex items-center justify-center text-white/40 hover:text-white transition-colors"
            >
              <X size={15} />
            </button>

            <div className="mb-5">
              <h2 className="text-lg font-semibold text-white mb-1">Confirm Action</h2>
              <p className="text-white/40 text-sm">Review the details before submitting on-chain.</p>
            </div>

            <div className="glass rounded-xl p-4 mb-5 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white/40 text-xs uppercase tracking-wider">Type</span>
                <span className="text-white text-sm font-medium capitalize">{action?.type || 'Transfer'}</span>
              </div>
              <div className="h-px bg-white/5" />
              <div className="flex justify-between items-center">
                <span className="text-white/40 text-xs uppercase tracking-wider">Amount</span>
                <span className="text-white text-sm font-medium">{action?.amount || '0'} SOL</span>
              </div>
              <div className="h-px bg-white/5" />
              <div className="flex justify-between items-start">
                <span className="text-white/40 text-xs uppercase tracking-wider">To</span>
                <span className="text-white text-sm font-medium font-mono text-right max-w-[180px] break-all">
                  {action?.recipient || '...'}
                </span>
              </div>
              <div className="h-px bg-white/5" />
              <div className="flex justify-between items-center">
                <span className="text-white/40 text-xs uppercase tracking-wider">Network Fee</span>
                <span className="text-green-400 text-sm font-medium">~0.000005 SOL</span>
              </div>
            </div>

            <div
              className="flex items-center gap-2 rounded-xl p-3 mb-5"
              style={{ background: 'rgba(255, 165, 0, 0.05)', border: '1px solid rgba(255, 165, 0, 0.1)' }}
            >
              <AlertCircle size={13} className="text-orange-400 shrink-0" />
              <p className="text-white/40 text-xs">
                This action will be signed and broadcast to Solana devnet. This cannot be undone.
              </p>
            </div>

            <div className="flex gap-3">
              <button onClick={onClose} className="btn-glass flex-1 py-3">
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="btn-primary flex-1 py-3 flex items-center justify-center gap-2"
              >
                <Send size={14} />
                Confirm
              </button>
            </div>
          </>
        )}

        {/* ── LOADING ── */}
        {status === 'loading' && (
          <div className="flex flex-col items-center justify-center py-10 gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #9945FF, #14F195)' }}
            >
              <Loader size={24} className="text-black animate-spin" />
            </div>
            <div className="text-center">
              <p className="text-white font-medium mb-1">Broadcasting…</p>
              <p className="text-white/40 text-sm">Waiting for wallet signature & network confirmation</p>
            </div>
          </div>
        )}

        {/* ── SUCCESS ── */}
        {status === 'success' && (
          <div className="flex flex-col items-center justify-center py-8 gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #14F195, #9945FF)' }}
            >
              <CheckCircle size={24} className="text-black" />
            </div>
            <div className="text-center">
              <p className="text-white font-semibold mb-1">Transaction Confirmed!</p>
              <p className="text-white/40 text-sm mb-4">Your SOL was sent successfully on-chain.</p>

              {txSignature && (
                <a
                  href={explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono rounded-xl px-3 py-2 transition-colors"
                  style={{
                    background: 'rgba(20,241,149,0.08)',
                    border: '1px solid rgba(20,241,149,0.2)',
                    color: '#14F195',
                  }}
                >
                  <span>{txSignature.slice(0, 8)}…{txSignature.slice(-8)}</span>
                  <ExternalLink size={11} />
                </a>
              )}
            </div>
          </div>
        )}

        {/* ── ERROR ── */}
        {status === 'error' && (
          <div className="flex flex-col items-center justify-center py-8 gap-5">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239,68,68,0.3)' }}
            >
              <AlertCircle size={24} className="text-red-400" />
            </div>
            <div className="text-center w-full">
              <p className="text-white font-semibold mb-2">Transaction Failed</p>
              <div
                className="rounded-xl px-4 py-3 mb-5"
                style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}
              >
                <p className="text-red-400/80 text-xs leading-relaxed break-words">{txError}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={onClose} className="btn-glass flex-1 py-2.5 text-sm">
                  Close
                </button>
                <button
                  onClick={handleRetry}
                  className="btn-primary flex-1 py-2.5 text-sm flex items-center justify-center gap-2"
                >
                  <RefreshCw size={13} />
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

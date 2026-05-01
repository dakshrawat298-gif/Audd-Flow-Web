'use client'

import { X, Send, AlertCircle, CheckCircle, Loader } from 'lucide-react'
import { useState } from 'react'

export default function ConfirmModal({ action, onClose, onConfirm }) {
  const [status, setStatus] = useState('idle')

  const handleConfirm = async () => {
    setStatus('loading')
    // TODO: Connect to Poof for Seeker On-Chain Backend here
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setStatus('success')
    setTimeout(() => {
      onConfirm()
      onClose()
    }, 1500)
  }

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
        {status === 'idle' && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full glass flex items-center justify-center text-white/40 hover:text-white transition-colors"
          >
            <X size={15} />
          </button>
        )}

        {status === 'idle' && (
          <>
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
                This action will be signed and broadcast to Solana mainnet. This cannot be undone.
              </p>
            </div>

            <div className="flex gap-3">
              <button onClick={onClose} className="btn-glass flex-1 py-3">
                Cancel
              </button>
              <button onClick={handleConfirm} className="btn-primary flex-1 py-3 flex items-center justify-center gap-2">
                <Send size={14} />
                Confirm
              </button>
            </div>
          </>
        )}

        {status === 'loading' && (
          <div className="flex flex-col items-center justify-center py-10 gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center animate-pulse"
              style={{ background: 'linear-gradient(135deg, #9945FF, #14F195)' }}
            >
              <Loader size={24} className="text-black animate-spin" />
            </div>
            <div className="text-center">
              <p className="text-white font-medium mb-1">Broadcasting...</p>
              <p className="text-white/40 text-sm">Submitting to Solana network</p>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center justify-center py-10 gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #14F195, #9945FF)' }}
            >
              <CheckCircle size={24} className="text-black" />
            </div>
            <div className="text-center">
              <p className="text-white font-medium mb-1">Transaction Sent!</p>
              <p className="text-white/40 text-sm">Your action was confirmed on-chain.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

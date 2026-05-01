import { Zap } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-10 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #9945FF, #14F195)' }}
          >
            <Zap size={13} className="text-black" />
          </div>
          <span className="font-semibold text-white/80 text-sm">
            Audd<span className="gradient-text">Flow</span>
          </span>
        </div>
        <p className="text-white/30 text-xs text-center">
          Built on Solana · Powered by Poof for Seeker · © {new Date().getFullYear()} AuddFlow
        </p>
        <div className="flex items-center gap-5">
          <a href="#" className="text-white/30 hover:text-white/60 text-xs transition-colors">Docs</a>
          <a href="#" className="text-white/30 hover:text-white/60 text-xs transition-colors">Twitter</a>
          <a href="#" className="text-white/30 hover:text-white/60 text-xs transition-colors">Discord</a>
        </div>
      </div>
    </footer>
  )
}

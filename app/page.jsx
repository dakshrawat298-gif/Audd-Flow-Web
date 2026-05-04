'use client'

import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ConnectCTA from '../components/ConnectCTA'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { ArrowRight, Zap, Shield, Globe, ChevronDown, Sparkles, Lock, Activity } from 'lucide-react'
import dynamic from 'next/dynamic'

const features = [
  {
    icon: <Zap size={20} />,
    title: 'Instant Transactions',
    desc: 'Create and broadcast Solana transactions in seconds. No complexity, no friction.',
    color: '#9945FF',
  },
  {
    icon: <Shield size={20} />,
    title: 'Non-Custodial',
    desc: 'Your private keys never leave your wallet. Full self-custody at every step.',
    color: '#14F195',
  },
  {
    icon: <Globe size={20} />,
    title: 'Ecosystem Ready',
    desc: 'Seamlessly integrated with Poof for Seeker for powerful on-chain composability.',
    color: '#9945FF',
  },
  {
    icon: <Activity size={20} />,
    title: 'Real-Time Status',
    desc: 'Live transaction tracking directly from the Solana blockchain explorer.',
    color: '#14F195',
  },
  {
    icon: <Lock size={20} />,
    title: 'Audited & Secure',
    desc: 'Battle-tested smart contract interactions with comprehensive error handling.',
    color: '#9945FF',
  },
  {
    icon: <Sparkles size={20} />,
    title: 'Creator-First UX',
    desc: 'Designed for creators and Web3 beginners. No crypto jargon required.',
    color: '#14F195',
  },
]

const steps = [
  { num: '01', title: 'Connect Your Wallet', desc: 'Link your Solana wallet in one tap. Phantom, Solflare, Backpack — we support them all.' },
  { num: '02', title: 'Input Your Action', desc: 'Describe what you want to do. Send SOL, create a payment link, or trigger an on-chain action.' },
  { num: '03', title: 'Confirm & Broadcast', desc: 'Review the details, sign with your wallet, and watch it land on-chain in under a second.' },
]

function CTASection() {
  const { connected } = useWallet()
  const { setVisible } = useWalletModal()

  return connected ? (
    <Link href="/dashboard" className="btn-primary inline-flex items-center gap-2">
      Open Dashboard <ArrowRight size={16} />
    </Link>
  ) : (
    <button
      onClick={() => setVisible(true)}
      className="btn-primary inline-flex items-center gap-2"
    >
      Get Started <ArrowRight size={16} />
    </button>
  )
}

const CTASectionDynamic = dynamic(() => Promise.resolve(CTASection), { ssr: false })

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black relative">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(153, 69, 255, 0.12), transparent)',
        }}
      />

      <Navbar />

      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-16">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(153,69,255,0.06) 0%, transparent 70%)' }}
        />

        <div
          className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8 animate-float"
          style={{ border: '1px solid rgba(153, 69, 255, 0.2)' }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-white/60 text-xs font-medium tracking-wide">Built on Solana · Powered by Poof for Seeker</span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-extrabold text-white leading-[1.05] tracking-tight mb-6 max-w-4xl">
          Payments,<br />
          <span className="gradient-text">reimagined</span><br />
          for Solana.
        </h1>

        <p className="text-white/50 text-lg sm:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
          The simplest way for creators and builders to create, send, and track Solana payments — without touching a single line of code.
        </p>

        <ConnectCTA ctaText="Connect Wallet" showDashboardLink />

        <a
          href="#features"
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/20 hover:text-white/40 transition-colors"
        >
          <span className="text-xs tracking-wider uppercase">Explore</span>
          <ChevronDown size={16} className="animate-bounce" />
        </a>
      </section>

      <section id="features" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs text-white/30 uppercase tracking-[0.2em] mb-3">Everything you need</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Built for the{' '}
              <span className="gradient-text">next generation</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <div key={i} className="glass glass-hover rounded-2xl p-6">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${f.color}15`, color: f.color }}
                >
                  {f.icon}
                </div>
                <h3 className="text-white font-semibold text-base mb-2">{f.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs text-white/30 uppercase tracking-[0.2em] mb-3">How it works</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Three steps to{' '}
              <span className="gradient-text">on-chain</span>
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            {steps.map((s, i) => (
              <div key={i} className="glass rounded-2xl p-6 flex gap-5 items-start">
                <span
                  className="text-xs font-bold tracking-wider pt-1 shrink-0"
                  style={{ background: 'linear-gradient(135deg, #9945FF, #14F195)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                >
                  {s.num}
                </span>
                <div>
                  <h3 className="text-white font-semibold text-base mb-1.5">{s.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div
            className="glass-strong rounded-3xl p-10 sm:p-14"
            style={{ border: '1px solid rgba(153, 69, 255, 0.15)' }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-glow"
              style={{ background: 'linear-gradient(135deg, #9945FF, #14F195)' }}
            >
              <Zap size={26} className="text-black" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
              Ready to flow?
            </h2>
            <p className="text-white/40 text-base mb-8 leading-relaxed">
              Connect your wallet and start creating Solana actions in under 30 seconds.
            </p>
            <CTASectionDynamic />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

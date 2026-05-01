'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const ConnectCTAInner = dynamic(
  () => import('./_ConnectCTAInner'),
  { ssr: false, loading: () => null }
)

export default function ConnectCTA({ ctaText = 'Connect Wallet', showDashboardLink = false }) {
  return <ConnectCTAInner ctaText={ctaText} showDashboardLink={showDashboardLink} />
}

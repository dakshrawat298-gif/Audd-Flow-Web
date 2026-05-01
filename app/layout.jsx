import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
})

export const metadata = {
  title: 'Audd Flow | Premium Solana Payments',
  description: 'The simplest way to create and interact with Solana payments and on-chain actions.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <div className="noise-overlay" />
        {children}
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import GridOverlay from '@/components/GridOverlay'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Chatbot | EdgeOne Makers',
  description: 'AI Chatbot powered by Vercel AI SDK · Demo only · EdgeOne Makers',
  keywords: "EdgeOne Makers, Demo only",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} h-screen`}>
        <GridOverlay />
        <Navigation />
        <main className="relative z-10 h-full pt-16">
          {children}
        </main>
      </body>
    </html>
  )
}

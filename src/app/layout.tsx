import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import { WatchlistProvider } from './context/WatchlistContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AnimeHub - Discover Amazing Anime',
  description: 'Discover thousands of anime series, track your favorites, and stay updated with the latest anime news.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WatchlistProvider>
          <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
            <Navigation />
            <main className="relative z-10">
              {children}
            </main>
            <Footer />
          </div>
        </WatchlistProvider>
      </body>
    </html>
  )
}
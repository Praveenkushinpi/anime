'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, BookOpen, Star, Home} from 'lucide-react'
import { useWatchlistContext } from '../context/WatchlistContext'

const Navigation = () => {
  const pathname = usePathname()
  const { watchlist, favorites } = useWatchlistContext()
  const totalItems = watchlist.length + favorites.length

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/search', icon: Search, label: 'Search' },
    { path: '/watchlist', icon: BookOpen, label: 'Watchlist', badge: totalItems > 0 ? totalItems : undefined }, 
  ]

  return (
    <nav className="glass-effect sticky top-0 z-50 border-b border-purple-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2 group">
            <Star className="h-8 w-8 text-purple-500 group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-xl font-bold gradient-text">AnimeHub</span>
          </Link>
          
          <div className="flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.path
              
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 relative ${
                    isActive
                      ? 'bg-purple-600/30 text-purple-300 shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
"use client"
import { createContext, useContext } from "react"
import { useWatchlist } from "../hooks/useWatchlist"

interface Anime {
  mal_id: number
  title: string
  images: {
    jpg: {
      image_url: string
      large_image_url: string
    }
  }
  score?: number
  year?: number
  episodes?: number
  status: string
  synopsis?: string
  genres?: Array<{ name: string }>
}

interface WatchlistContextType {
  watchlist: Anime[]
  favorites: Anime[]
  addToWatchlist: (anime: Anime) => void
  removeFromWatchlist: (animeId: number) => void
  addToFavorites: (anime: Anime) => void
  removeFromFavorites: (animeId: number) => void
  isInWatchlist: (animeId: number) => boolean
  isInFavorites: (animeId: number) => boolean
  clearWatchlist: () => void
  clearFavorites: () => void
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined)

export const WatchlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const watchlistData = useWatchlist()

  return (
    <WatchlistContext.Provider value={watchlistData}>
      {children}
    </WatchlistContext.Provider>
  )
}

export const useWatchlistContext = () => {
  const context = useContext(WatchlistContext)
  if (!context) throw new Error("useWatchlistContext must be used inside WatchlistProvider")
  return context
}

"use client"
import { useState, useEffect } from "react"

export interface Anime {
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

export const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState<Anime[]>([])
  const [favorites, setFavorites] = useState<Anime[]>([])


  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedWatchlist = localStorage.getItem("anime-watchlist")
      const savedFavorites = localStorage.getItem("anime-favorites")

      if (savedWatchlist) {
        try {
          setWatchlist(JSON.parse(savedWatchlist))
        } catch (err) {
          console.error("Error parsing watchlist:", err)
        }
      }

      if (savedFavorites) {
        try {
          setFavorites(JSON.parse(savedFavorites))
        } catch (err) {
          console.error("Error parsing favorites:", err)
        }
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("anime-watchlist", JSON.stringify(watchlist))
    }
  }, [watchlist])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("anime-favorites", JSON.stringify(favorites))
    }
  }, [favorites])

  const addToWatchlist = (anime: Anime) => {
    setWatchlist((prev) =>
      prev.some((item) => item.mal_id === anime.mal_id) ? prev : [...prev, anime]
    )
  }

  const removeFromWatchlist = (animeId: number) => {
    setWatchlist((prev) => prev.filter((item) => item.mal_id !== animeId))
  }

  const addToFavorites = (anime: Anime) => {
    setFavorites((prev) =>
      prev.some((item) => item.mal_id === anime.mal_id) ? prev : [...prev, anime]
    )
  }

  const removeFromFavorites = (animeId: number) => {
    setFavorites((prev) => prev.filter((item) => item.mal_id !== animeId))
  }

  const isInWatchlist = (animeId: number) => watchlist.some((item) => item.mal_id === animeId)
  const isInFavorites = (animeId: number) => favorites.some((item) => item.mal_id === animeId)

  const clearWatchlist = () => setWatchlist([])
  const clearFavorites = () => setFavorites([])

  return {
    watchlist,
    favorites,
    addToWatchlist,
    removeFromWatchlist,
    addToFavorites,
    removeFromFavorites,
    isInWatchlist,
    isInFavorites,
    clearWatchlist,
    clearFavorites,
  }
}

'use client'
import { useState, useEffect } from 'react'

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

export const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState<Anime[]>([])
  const [favorites, setFavorites] = useState<Anime[]>([])

  //localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedWatchlist = localStorage.getItem('anime-watchlist')
      const savedFavorites = localStorage.getItem('anime-favorites')
      
      if (savedWatchlist) {
        try {
          setWatchlist(JSON.parse(savedWatchlist))
        } catch (error) {
          console.error('Error parsing watchlist:', error)
        }
      }
      
      if (savedFavorites) {
        try {
          setFavorites(JSON.parse(savedFavorites))
        } catch (error) {
          console.error('Error parsing favorites:', error)
        }
      }
    }
  }, [])


  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('anime-watchlist', JSON.stringify(watchlist))
    }
  }, [watchlist])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('anime-favorites', JSON.stringify(favorites))
    }
  }, [favorites])

  const addToWatchlist = (anime: Anime) => {
    setWatchlist(prev => {
      if (prev.some(item => item.mal_id === anime.mal_id)) {
        return prev
      }
      return [...prev, anime]
    })
  }

  const removeFromWatchlist = (animeId: number) => {
    setWatchlist(prev => prev.filter(item => item.mal_id !== animeId))
  }

  const addToFavorites = (anime: Anime) => {
    setFavorites(prev => {
      if (prev.some(item => item.mal_id === anime.mal_id)) {
        return prev
      }
      return [...prev, anime]
    })
  }

  const removeFromFavorites = (animeId: number) => {
    setFavorites(prev => prev.filter(item => item.mal_id !== animeId))
  }

  const isInWatchlist = (animeId: number) => {
    return watchlist.some(item => item.mal_id === animeId)
  }

  const isInFavorites = (animeId: number) => {
    return favorites.some(item => item.mal_id === animeId)
  }

  const clearWatchlist = () => {
    setWatchlist([])
  }

  const clearFavorites = () => {
    setFavorites([])
  }

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
    clearFavorites
  }
}
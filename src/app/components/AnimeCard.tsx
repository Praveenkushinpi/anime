'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Star, Calendar, Play, Heart, BookOpen} from 'lucide-react'
import Card from './Card'
import { useWatchlistContext } from '../context/WatchlistContext'

interface AnimeCardProps {
  anime: {
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
  variant?: 'grid' | 'list'
}

const AnimeCard: React.FC<AnimeCardProps> = ({ anime, variant = 'grid' }) => {
  const [imageError, setImageError] = useState(false)
  const { 
    addToWatchlist, 
    removeFromWatchlist, 
    addToFavorites, 
    removeFromFavorites,
    isInWatchlist,
    isInFavorites
  } = useWatchlistContext()

  const inWatchlist = isInWatchlist(anime.mal_id)
  const inFavorites = isInFavorites(anime.mal_id)

  const toggleWatchlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (inWatchlist) {
      removeFromWatchlist(anime.mal_id)
    } else {
      addToWatchlist(anime)
    }
  }

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (inFavorites) {
      removeFromFavorites(anime.mal_id)
    } else {
      addToFavorites(anime)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'currently airing':
        return 'bg-green-500'
      case 'finished airing':
        return 'bg-blue-500'
      case 'not yet aired':
        return 'bg-purple-500'
      default:
        return 'bg-gray-500'
    }
  }

  if (variant === 'list') {
    return (
      <Link href={`/anime/${anime.mal_id}`}>
        <Card hover className="animate-fade-in">
          <div className="flex space-x-4">
            <div className="relative w-20 h-28 flex-shrink-0">
              <Image
                src={imageError ? '/placeholder-anime.jpg' : anime.images.jpg.image_url}
                alt={anime.title}
                fill
                className="object-cover rounded-lg"
                onError={() => setImageError(true)}
              />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 hover:text-purple-400 transition-colors">
                {anime.title}
              </h3>
              <div className="flex items-center space-x-4 text-sm text-gray-300 mb-2">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span>{anime.score?.toFixed(1) || 'N/A'}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{anime.year || 'TBA'}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Play className="h-4 w-4" />
                  <span>{anime.episodes || '?'} eps</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(anime.status)}`}>
                  {anime.status}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={toggleWatchlist}
                    className={`p-1 rounded-full transition-colors duration-200 ${
                      inWatchlist ? 'text-blue-400' : 'text-gray-400 hover:text-blue-400'
                    }`}
                    title={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
                  >
                    <BookOpen className="h-4 w-4" />
                  </button>
                  <button
                    onClick={toggleFavorite}
                    className={`p-1 rounded-full transition-colors duration-200 ${
                      inFavorites ? 'text-red-400' : 'text-gray-400 hover:text-red-400'
                    }`}
                    title={inFavorites ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Heart className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    )
  }

  return (
    <Link href={`/anime/${anime.mal_id}`} className="group">
      <Card hover className="overflow-hidden animate-slide-up">
        <div className="relative">
          <div className="relative h-64 mb-4">
            <Image
              src={imageError ? '/placeholder-anime.jpg' : anime.images.jpg.image_url}
              alt={anime.title}
              fill
              className="object-cover rounded-lg"
              onError={() => setImageError(true)}
            />
            <div className="absolute top-2 right-2 flex space-x-2">
              <button
                onClick={toggleWatchlist}
                className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
                  inWatchlist
                    ? 'bg-blue-500/80 text-white'
                    : 'bg-black/50 text-gray-300 hover:bg-blue-500/80 hover:text-white'
                }`}
                title={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
              >
                <BookOpen className="h-4 w-4" />
              </button>
              <button
                onClick={toggleFavorite}
                className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
                  inFavorites
                    ? 'bg-red-500/80 text-white'
                    : 'bg-black/50 text-gray-300 hover:bg-red-500/80 hover:text-white'
                }`}
                title={inFavorites ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart className="h-4 w-4" />
              </button>
            </div>
            <div className="absolute bottom-2 left-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(anime.status)}`}>
                {anime.status}
              </span>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors">
            {anime.title}
          </h3>
          
          <div className="flex items-center justify-between text-sm text-gray-300 mb-3">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-400" />
              <span>{anime.score?.toFixed(1) || 'N/A'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{anime.year || 'TBA'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Play className="h-4 w-4" />
              <span>{anime.episodes || '?'} eps</span>
            </div>
          </div>
          
          {anime.genres && anime.genres.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {anime.genres.slice(0, 3).map((genre, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-purple-900/30 text-purple-300 rounded-full text-xs"
                >
                  {genre.name}
                </span>
              ))}
              {anime.genres.length > 3 && (
                <span className="px-2 py-1 bg-gray-700/50 text-gray-300 rounded-full text-xs">
                  +{anime.genres.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </Card>
    </Link>
  )
}

export default AnimeCard
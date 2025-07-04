'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { Star, Calendar, Play, Users, Heart, BookOpen, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Container from '../../components/Container'
import LoadingSpinner from '../../components/LoadingSpinner'
import Card from '../../components/Card'

type AnimeAttributes = {
  canonicalTitle?: string
  titles?: { en?: string; ja_jp?: string }
  posterImage?: { large?: string; original?: string }
  coverImage?: { large?: string; original?: string }
  averageRating?: string
  episodeCount?: number
  startDate?: string
  endDate?: string
  popularityRank?: number
  subtype?: string
  episodeLength?: number
  ageRating?: string
  ageRatingGuide?: string
  status?: string
  youtubeVideoId?: string
  tba?: string
  synopsis?: string
}

type AnimeData = {
  id: string
  type: string
  attributes: AnimeAttributes
}

export default function AnimeDetailPage() {
  const params = useParams()
  const [anime, setAnime] = useState<AnimeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isInWatchlist, setIsInWatchlist] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  type ParamsType = { id: string };

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      if (!params || !('id' in params)) return

      try {
        setLoading(true)
        setError(null)

        // API
        const response = await fetch(`https://kitsu.io/api/edge/anime/${(params as ParamsType).id}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch anime details')
        }

        const data = await response.json()
        setAnime(data.data)
      } catch (err) {
        console.error('Error fetching anime details:', err)
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('An unknown error occurred')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchAnimeDetails()
  }, [params])

  const getStatusColor = (status: string | undefined) => {
    if (!status) return 'bg-gray-500'
    
    switch (status.toLowerCase()) {
      case 'current':
        return 'bg-green-500'
      case 'finished':
        return 'bg-blue-500'
      case 'upcoming':
        return 'bg-purple-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string | undefined) => {
    if (!status) return 'Unknown'
    
    switch (status.toLowerCase()) {
      case 'current':
        return 'Currently Airing'
      case 'finished':
        return 'Finished Airing'
      case 'upcoming':
        return 'Not Yet Aired'
      default:
        return status
    }
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Unknown'
    
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatAiredDates = (startDate: string | undefined, endDate: string | undefined) => {
    const start = formatDate(startDate)
    const end = endDate ? formatDate(endDate) : 'Ongoing'
    return `${start} to ${end}`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading anime details..." />
      </div>
    )
  }

  if (error || !anime) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">
            {error || 'Anime not found'}
          </p>
          <Link
            href="/search"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Back to Search
          </Link>
        </div>
      </div>
    )
  }

  const attributes = anime.attributes
  const posterImage = attributes.posterImage?.large || attributes.posterImage?.original || '/placeholder-anime.jpg'
  const coverImage = attributes.coverImage?.large || attributes.coverImage?.original || posterImage

  return (
    <div className="min-h-screen">
      <div className="relative h-96 overflow-hidden">
        <Image
          src={coverImage}
          alt={attributes.canonicalTitle || attributes.titles?.en || 'Anime Cover'}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />
        <div className="absolute top-4 left-4 z-10">
          <Link
            href="/search"
            className="flex items-center px-4 py-2 glass-effect rounded-lg text-white hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </div>
      </div>
      <Container className="-mt-32 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-80 flex-shrink-0">
            <Card className="overflow-hidden">
              <Image
                src={posterImage}
                alt={attributes.canonicalTitle || attributes.titles?.en || 'Anime Poster'}
                width={320}
                height={450}
                className="w-full rounded-lg"
              />
            </Card>
          </div>
          <div className="flex-1">
            <Card>
              <div className="mb-6">
                <h1 className="text-4xl font-bold text-white mb-2">
                  {attributes.canonicalTitle || attributes.titles?.en || 'Unknown Title'}
                </h1>
                {attributes.titles?.en && attributes.titles.en !== attributes.canonicalTitle && (
                  <p className="text-xl text-gray-300 mb-2">{attributes.titles.en}</p>
                )}
                {attributes.titles?.ja_jp && (
                  <p className="text-lg text-gray-400">{attributes.titles.ja_jp}</p>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="glass-effect rounded-lg p-4">
                  <div className="flex items-center text-yellow-400 mb-1">
                    <Star className="h-4 w-4 mr-1" />
                    <span className="text-sm">Score</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {attributes.averageRating ? (parseFloat(attributes.averageRating) / 10).toFixed(1) : 'N/A'}
                  </p>
                </div>
                
                <div className="glass-effect rounded-lg p-4">
                  <div className="flex items-center text-blue-400 mb-1">
                    <Play className="h-4 w-4 mr-1" />
                    <span className="text-sm">Episodes</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {attributes.episodeCount || '?'}
                  </p>
                </div>
                
                <div className="glass-effect rounded-lg p-4">
                  <div className="flex items-center text-purple-400 mb-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span className="text-sm">Year</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {attributes.startDate ? new Date(attributes.startDate).getFullYear() : 'TBA'}
                  </p>
                </div>
                
                <div className="glass-effect rounded-lg p-4">
                  <div className="flex items-center text-green-400 mb-1">
                    <Users className="h-4 w-4 mr-1" />
                    <span className="text-sm">Popularity</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    #{attributes.popularityRank || 'N/A'}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 mb-6">
                <button
                  onClick={() => setIsInWatchlist(!isInWatchlist)}
                  className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                    isInWatchlist
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'glass-effect text-gray-300 hover:bg-blue-600 hover:text-white'
                  }`}
                >
                  <BookOpen className="h-5 w-5 mr-2" />
                  {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                </button>
                
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                    isFavorite
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'glass-effect text-gray-300 hover:bg-red-600 hover:text-white'
                  }`}
                >
                  <Heart className="h-5 w-5 mr-2" />
                  {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>
                
                {attributes.youtubeVideoId && (
                  <a
                    href={`https://www.youtube.com/watch?v=${attributes.youtubeVideoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Watch Trailer
                  </a>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Details</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span className="text-gray-400 w-20">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(attributes.status)}`}>
                        {getStatusText(attributes.status)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-400 w-20">Type:</span>
                      <span className="text-white">{attributes.subtype || 'Unknown'}</span>
                    </div>
                    {attributes.episodeLength && (
                      <div className="flex items-center">
                        <span className="text-gray-400 w-20">Duration:</span>
                        <span className="text-white">{attributes.episodeLength} min per ep</span>
                      </div>
                    )}
                    {attributes.ageRating && (
                      <div className="flex items-center">
                        <span className="text-gray-400 w-20">Rating:</span>
                        <span className="text-white">
                          {attributes.ageRating}
                          {attributes.ageRatingGuide && ` (${attributes.ageRatingGuide})`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Broadcast</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span className="text-gray-400 w-20">Aired:</span>
                      <span className="text-white">
                        {formatAiredDates(attributes.startDate, attributes.endDate)}
                      </span>
                    </div>
                    {attributes.tba && (
                      <div className="flex items-center">
                        <span className="text-gray-400 w-20">Note:</span>
                        <span className="text-white">{attributes.tba}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {attributes.synopsis && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Synopsis</h3>
                  <p className="text-gray-300 leading-relaxed">{attributes.synopsis}</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </Container>
    </div>
  )
}
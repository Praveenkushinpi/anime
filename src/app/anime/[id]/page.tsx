"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import {
  Star,
  Calendar,
  Play,
  Users,
  Heart,
  BookOpen,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"
import Container from "../../components/Container"
import LoadingSpinner from "../../components/LoadingSpinner"
import Card from "../../components/Card"
import { useWatchlistContext } from "@/app/context/WatchlistContext"  

interface AnimeDetailsProps {
  attributes: AnimeAttributes
  getStatusColor: (status?: string) => string
  getStatusText: (status?: string) => string
}

interface AnimeBroadcastProps {
  attributes: AnimeAttributes
  formatAiredDates: (start?: string, end?: string) => string
}


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
  const params = useParams<{ id: string }>()
  const [anime, setAnime] = useState<AnimeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const {
    addToWatchlist,
    removeFromWatchlist,
    addToFavorites,
    removeFromFavorites,
    isInWatchlist,
    isInFavorites,
  } = useWatchlistContext()

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      const animeId = params?.id
      if (!animeId) return

      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`https://kitsu.io/api/edge/anime/${animeId}`)
        if (!response.ok) throw new Error("Failed to fetch anime details")

        const data = await response.json()
        setAnime(data.data)
      } catch (err) {
        console.error("Error fetching anime details:", err)
        setError(err instanceof Error ? err.message : "Unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchAnimeDetails()
  }, [params?.id])

  const getStatusColor = (status?: string) => {
    if (!status) return "bg-gray-500"
    switch (status.toLowerCase()) {
      case "current":
        return "bg-green-500"
      case "finished":
        return "bg-blue-500"
      case "upcoming":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status?: string) => {
    if (!status) return "Unknown"
    switch (status.toLowerCase()) {
      case "current":
        return "Currently Airing"
      case "finished":
        return "Finished Airing"
      case "upcoming":
        return "Not Yet Aired"
      default:
        return status
    }
  }

  const formatDate = (date?: string) => {
    if (!date) return "Unknown"
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatAiredDates = (start?: string, end?: string) => {
    const startDate = formatDate(start)
    const endDate = end ? formatDate(end) : "Ongoing"
    return `${startDate} to ${endDate}`
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
      <div className="min-h-screen flex items-center justify-center text-center">
        <p className="text-red-400 text-lg mb-4">{error || "Anime not found"}</p>
        <Link
          href="/search"
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          Back to Search
        </Link>
      </div>
    )
  }

  const attributes = anime.attributes
  const posterImage =
    attributes.posterImage?.large ||
    attributes.posterImage?.original ||
    "/placeholder-anime.jpg"

  const coverImage =
    attributes.coverImage?.large ||
    attributes.coverImage?.original ||
    posterImage

  const numericId = Number(anime.id)
  const inWatchlist = isInWatchlist(numericId)
  const inFavorites = isInFavorites(numericId)

  const toggleWatchlist = () => {
    if (inWatchlist) {
      removeFromWatchlist(numericId)
    } else {
      addToWatchlist({
        mal_id: numericId,
        title:
          attributes.canonicalTitle ||
          attributes.titles?.en ||
          "Unknown Title",
        images: {
          jpg: {
            image_url: posterImage,
            large_image_url: posterImage,
          },
        },
        status: attributes.status || "Unknown",
      })
    }
  }

  const toggleFavorite = () => {
    if (inFavorites) {
      removeFromFavorites(numericId)
    } else {
      addToFavorites({
        mal_id: numericId,
        title:
          attributes.canonicalTitle ||
          attributes.titles?.en ||
          "Unknown Title",
        images: {
          jpg: {
            image_url: posterImage,
            large_image_url: posterImage,
          },
        },
        status: attributes.status || "Unknown",
      })
    }
  }

  return (
    <div className="min-h-screen">
      <div className="relative h-96 overflow-hidden">
        <Image
          src={coverImage}
          alt={attributes.canonicalTitle || "Anime Cover"}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />
        <div className="absolute top-4 left-4 z-10">
          <Link
            href="/search"
            className="flex items-center px-4 py-2 glass-effect rounded-lg text-white hover:bg-white/20 transition"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Link>
        </div>
      </div>
      <Container className="-mt-32 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Poster */}
          <div className="lg:w-80 flex-shrink-0">
            <Card className="overflow-hidden">
              <Image
                src={posterImage}
                alt={attributes.canonicalTitle || "Anime Poster"}
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
                  {attributes.canonicalTitle ||
                    attributes.titles?.en ||
                    "Unknown Title"}
                </h1>
                {attributes.titles?.en &&
                  attributes.titles.en !== attributes.canonicalTitle && (
                    <p className="text-xl text-gray-300 mb-2">
                      {attributes.titles.en}
                    </p>
                  )}
                {attributes.titles?.ja_jp && (
                  <p className="text-lg text-gray-400">
                    {attributes.titles.ja_jp}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <AnimeStat
                  icon={<Star className="h-4 w-4 mr-1" />}
                  label="Score"
                  value={
                    attributes.averageRating
                      ? (parseFloat(attributes.averageRating) / 10).toFixed(1)
                      : "N/A"
                  }
                  color="text-yellow-400"
                />
                <AnimeStat
                  icon={<Play className="h-4 w-4 mr-1" />}
                  label="Episodes"
                  value={attributes.episodeCount || "?"}
                  color="text-blue-400"
                />
                <AnimeStat
                  icon={<Calendar className="h-4 w-4 mr-1" />}
                  label="Year"
                  value={
                    attributes.startDate
                      ? new Date(attributes.startDate).getFullYear()
                      : "TBA"
                  }
                  color="text-purple-400"
                />
                <AnimeStat
                  icon={<Users className="h-4 w-4 mr-1" />}
                  label="Popularity"
                  value={`#${attributes.popularityRank || "N/A"}`}
                  color="text-green-400"
                />
              </div>
              <div className="flex flex-wrap gap-4 mb-6">
                <button
                  onClick={toggleWatchlist}
                  className={`flex items-center px-6 py-3 rounded-lg font-medium transition ${
                    inWatchlist
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "glass-effect text-gray-300 hover:bg-blue-600 hover:text-white"
                  }`}
                >
                  <BookOpen className="h-5 w-5 mr-2" />
                  {inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
                </button>

                <button
                  onClick={toggleFavorite}
                  className={`flex items-center px-6 py-3 rounded-lg font-medium transition ${
                    inFavorites
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "glass-effect text-gray-300 hover:bg-red-600 hover:text-white"
                  }`}
                >
                  <Heart className="h-5 w-5 mr-2" />
                  {inFavorites ? "Remove from Favorites" : "Add to Favorites"}
                </button>

                {attributes.youtubeVideoId && (
                  <a
                    href={`https://www.youtube.com/watch?v=${attributes.youtubeVideoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Watch Trailer
                  </a>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <AnimeDetails
                  attributes={attributes}
                  getStatusColor={getStatusColor}
                  getStatusText={getStatusText}
                />
                <AnimeBroadcast
                  attributes={attributes}
                  formatAiredDates={formatAiredDates}
                />
              </div>

              {attributes.synopsis && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Synopsis
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {attributes.synopsis}
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </Container>
    </div>
  )
}
function AnimeStat({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode
  label: string
  value: string | number
  color: string
}) {
  return (
    <div className="glass-effect rounded-lg p-4">
      <div className={`flex items-center ${color} mb-1`}>
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  )
}

function AnimeDetails({ attributes, getStatusColor, getStatusText }: AnimeDetailsProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-3">Details</h3>
      <div className="space-y-2">
        <div className="flex items-center">
          <span className="text-gray-400 w-20">Status:</span>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(
              attributes.status
            )}`}
          >
            {getStatusText(attributes.status)}
          </span>
        </div>
        <div className="flex items-center">
          <span className="text-gray-400 w-20">Type:</span>
          <span className="text-white">
            {attributes.subtype || "Unknown"}
          </span>
        </div>
        {attributes.episodeLength && (
          <div className="flex items-center">
            <span className="text-gray-400 w-20">Duration:</span>
            <span className="text-white">
              {attributes.episodeLength} min per ep
            </span>
          </div>
        )}
        {attributes.ageRating && (
          <div className="flex items-center">
            <span className="text-gray-400 w-20">Rating:</span>
            <span className="text-white">
              {attributes.ageRating}
              {attributes.ageRatingGuide &&
                ` (${attributes.ageRatingGuide})`}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

function AnimeBroadcast({ attributes, formatAiredDates }: AnimeBroadcastProps) {
  return (
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
  )
}

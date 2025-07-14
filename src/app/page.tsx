'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, TrendingUp, Sparkles, Users, Star, Flame, Play } from 'lucide-react'
import Container from './components/Container'
import AnimeCard from './components/AnimeCard'
import LoadingSpinner from './components/LoadingSpinner'
import Card from './components/Card'


const KITSU_API_BASE = 'https://kitsu.io/api/edge'


interface KitsuAnimeAttributes {
  canonicalTitle?: string;
  titles?: {
    en?: string;
    en_jp?: string;
  };
  posterImage?: {
    small?: string;
    tiny?: string;
    medium?: string;
    large?: string;
  };
  averageRating?: string;
  startDate?: string;
  episodeCount?: number;
  status?: string;
  synopsis?: string;
  ageRating?: string;
  popularityRank?: number;
  ratingRank?: number;
}

interface KitsuAnime {
  id: string;
  attributes: KitsuAnimeAttributes;
}


const transformKitsuData = (kitsuAnime: KitsuAnime) => {
  const { id, attributes } = kitsuAnime
  return {
    mal_id: Number(id),
    title: attributes.canonicalTitle || attributes.titles?.en || attributes.titles?.en_jp || 'Unknown Title',
    images: {
      jpg: {
        image_url: attributes.posterImage?.small || attributes.posterImage?.tiny || '',
        large_image_url: attributes.posterImage?.large || attributes.posterImage?.medium || attributes.posterImage?.small || ''
      }
    },
    score: attributes.averageRating ? parseFloat(attributes.averageRating) / 10 : 0,
    year: attributes.startDate ? new Date(attributes.startDate).getFullYear() : undefined,
    episodes: attributes.episodeCount || 0,
    status: attributes.status || 'Unknown',
    genres: [], // Kitsu requires separate API call for genres
    synopsis: attributes.synopsis || '',
    rating: attributes.ageRating || 'Not Rated',
    popularityRank: attributes.popularityRank || 0,
    ratingRank: attributes.ratingRank || 0
  }
}


const fetchTopRated = async () => {
  try {
    const response = await fetch(`${KITSU_API_BASE}/anime?sort=-averageRating&page[limit]=12&filter[status]=finished`)
    const data = await response.json()
    return data.data.map(transformKitsuData)
  } catch (error) {
    console.error('Error fetching top rated anime:', error)
    return []
  }
}

const fetchMostPopular = async () => {
  try {
    const response = await fetch(`${KITSU_API_BASE}/anime?sort=-userCount&page[limit]=12`)
    const data = await response.json()
    return data.data.map(transformKitsuData)
  } catch (error) {
    console.error('Error fetching most popular anime:', error)
    return []
  }
}

const fetchCurrentlyAiring = async () => {
  try {
    const response = await fetch(`${KITSU_API_BASE}/anime?sort=-userCount&page[limit]=12&filter[status]=current`)
    const data = await response.json()
    return data.data.map(transformKitsuData)
  } catch (error) {
    console.error('Error fetching currently airing anime:', error)
    return []
  }
}

const fetchNewReleases = async () => {
  try {
    const currentYear = new Date().getFullYear()
    const response = await fetch(`${KITSU_API_BASE}/anime?sort=-startDate&page[limit]=12&filter[year]=${currentYear}`)
    const data = await response.json()
    return data.data.map(transformKitsuData)
  } catch (error) {
    console.error('Error fetching new releases:', error)
    return []
  }
}

type Anime = ReturnType<typeof transformKitsuData>;

export default function HomePage() {
  const [topRated, setTopRated] = useState<Anime[]>([])
  const [mostPopular, setMostPopular] = useState<Anime[]>([])
  const [currentlyAiring, setCurrentlyAiring] = useState<Anime[]>([])
  const [newReleases, setNewReleases] = useState<Anime[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('popular')

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        
        // Fetch all data concurrently
        const [topRatedData, popularData, airingData, newData] = await Promise.all([
          fetchTopRated(),
          fetchMostPopular(),
          fetchCurrentlyAiring(),
          fetchNewReleases()
        ])

        setTopRated(topRatedData)
        setMostPopular(popularData)
        setCurrentlyAiring(airingData)
        setNewReleases(newData)
      } catch (error) {
        console.error('Error loading anime data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const getCurrentTabData = () => {
    switch (activeTab) {
      case 'popular':
        return mostPopular
      case 'airing':
        return currentlyAiring
      case 'new':
        return newReleases
      default:
        return mostPopular
    }
  }

  const tabConfig = [
    { id: 'popular', label: 'Most Popular', icon: Flame, color: 'text-red-400' },
    { id: 'airing', label: 'Currently Airing', icon: Play, color: 'text-green-400' },
    { id: 'new', label: 'New Releases', icon: Sparkles, color: 'text-purple-400' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading anime data..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 via-blue-900/50 to-indigo-900/50" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.1\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'2\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />
        <Container>
          <div className="relative z-10 text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
              Discover Amazing{' '}
              <span className="gradient-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                Anime
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto animate-slide-up">
              Explore thousands of anime series, track your favorites, and connect with fellow anime enthusiasts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <Link
                href="/search"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Search className="h-5 w-5 mr-2" />
                Start Exploring
              </Link>
            </div>
          </div>
        </Container>
      </section>
      <section className="py-16 bg-gray-900/50">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center bg-gradient-to-br from-yellow-900/20 to-yellow-800/20 border-yellow-500/20">
              <Star className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">45,000+</h3>
              <p className="text-gray-400">Anime Series</p>
            </Card>
            <Card className="text-center bg-gradient-to-br from-purple-900/20 to-purple-800/20 border-purple-500/20">
              <Users className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">2M+</h3>
              <p className="text-gray-400">Active Users</p>
            </Card>
            <Card className="text-center bg-gradient-to-br from-green-900/20 to-green-800/20 border-green-500/20">
              <TrendingUp className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">10M+</h3>
              <p className="text-gray-400">Reviews</p>
            </Card>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-400 mr-3" />
              Top Rated Anime
            </h2>
            <Link
              href="/search?sort=rating"
              className="text-purple-400 hover:text-purple-300 transition-colors font-medium flex items-center"
            >
              View All
              <span className="ml-2">→</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {topRated.slice(0, 12).map((anime) => (
              <AnimeCard key={anime.mal_id} anime={anime} />
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 bg-gray-900/30">
        <Container>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white flex items-center">
              <Flame className="h-8 w-8 text-red-400 mr-3" />
              Trending Now
            </h2>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {tabConfig.map(({ id, label, icon: Icon, color }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`inline-flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Icon className={`h-5 w-5 mr-2 ${activeTab === id ? 'text-white' : color}`} />
                {label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {getCurrentTabData().slice(0, 12).map((anime) => (
              <AnimeCard key={`${activeTab}-${anime.mal_id}`} anime={anime} />
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Explore by Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/search?genre=action">
              <Card className="group cursor-pointer hover:scale-105 transition-transform duration-300 bg-gradient-to-br from-red-900/20 to-orange-900/20 border-red-500/20">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-4 bg-red-500/20 rounded-full">
                    <Sparkles className="h-8 w-8 text-red-400" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 text-center">Action</h3>
                <p className="text-gray-400 text-center">Epic battles and intense adventures</p>
              </Card>
            </Link>
            
            <Link href="/search?genre=romance">
              <Card className="group cursor-pointer hover:scale-105 transition-transform duration-300 bg-gradient-to-br from-pink-900/20 to-purple-900/20 border-pink-500/20">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-4 bg-pink-500/20 rounded-full">
                    <Star className="h-8 w-8 text-pink-400" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 text-center">Romance</h3>
                <p className="text-gray-400 text-center">Heartwarming love stories</p>
              </Card>
            </Link>
            
            <Link href="/search?genre=comedy">
              <Card className="group cursor-pointer hover:scale-105 transition-transform duration-300 bg-gradient-to-br from-yellow-900/20 to-green-900/20 border-yellow-500/20">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-4 bg-yellow-500/20 rounded-full">
                    <Users className="h-8 w-8 text-yellow-400" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 text-center">Comedy</h3>
                <p className="text-gray-400 text-center">Hilarious moments and laughs</p>
              </Card>
            </Link>
          </div>
        </Container>
      </section>
    </div>
  )
}
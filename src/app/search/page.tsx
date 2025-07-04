'use client'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { Search, Grid, List, Filter, X, Play, RefreshCw } from 'lucide-react'
import Container from '../components/Container'
import AnimeCard from '../components/AnimeCard'
import LoadingSpinner from '../components/LoadingSpinner'
import Card from '../components/Card'

interface KitsuPosterImage {
  tiny?: string
  small?: string
  medium?: string
  large?: string
}

interface KitsuTitles {
  en?: string
  en_jp?: string
  [key: string]: string | undefined
}

interface KitsuAttributes {
  canonicalTitle?: string
  titles?: KitsuTitles
  posterImage?: KitsuPosterImage
  averageRating?: string
  startDate?: string
  endDate?: string
  episodeCount?: number
  status?: string
  synopsis?: string
  ageRating?: string
  popularityRank?: number
  ratingRank?: number
  showType?: string
}

interface KitsuAnime {
  id: string
  attributes: KitsuAttributes
}

// Kitsu API 
const KITSU_API_BASE = 'https://kitsu.io/api/edge'

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
    genres: [],
    synopsis: attributes.synopsis || '',
    rating: attributes.ageRating || 'Not Rated',
    popularityRank: attributes.popularityRank || 0,
    ratingRank: attributes.ratingRank || 0,
    startDate: attributes.startDate,
    endDate: attributes.endDate,
    showType: attributes.showType || 'Unknown'
  }
}

const STATUS_OPTIONS = [
  { value: 'current', label: 'Currently Airing' },
  { value: 'finished', label: 'Finished Airing' },
  { value: 'tba', label: 'To be Announced' },
  { value: 'unreleased', label: 'Not Yet Released' },
  { value: 'upcoming', label: 'Upcoming' }
]


const SORT_OPTIONS = [
  { value: '-userCount', label: 'Most Popular' },
  { value: '-averageRating', label: 'Highest Rated' },
  { value: '-startDate', label: 'Most Recent' },
  { value: 'startDate', label: 'Oldest First' },
  { value: 'canonicalTitle', label: 'A-Z' },
  { value: '-canonicalTitle', label: 'Z-A' }
]


type Anime = {
  mal_id: number
  title: string
  images: {
    jpg: {
      image_url: string
      large_image_url: string
    }
  }
  score: number
  year?: number 
  episodes: number
  status: string
  genres?: {name: string}[]
  synopsis: string
  rating: string
  popularityRank: number
  ratingRank: number
  startDate: string | undefined
  endDate: string | undefined
  showType: string
}

type FilterType = {
  status: string
  genre: string
  year: string
  minScore: string
  maxScore: string
  sort: string
  showType: string
}

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Anime[]>([])
  const [loading, setLoading] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [filters, setFilters] = useState({
    status: '',
    genre: '',
    year: '',
    minScore: '',
    maxScore: '',
    sort: '-userCount',
    showType: ''
  })


  
  function debounce<
  T extends (query: string, filters: FilterType, page: number) => void
>(func: T, wait: number) {
  let timeout: NodeJS.Timeout

  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
     func(...(args as [string, FilterType, number])) 
    }, wait)
  }
}

  const performSearch = useCallback(async (searchQuery: string, searchFilters: FilterType, page: number ) => {
    setLoading(true)
    
    try {
      const params = new URLSearchParams()
            if (searchQuery.trim()) {
        params.append('filter[text]', searchQuery.trim())
      }
      
      if (searchFilters.status) {
        params.append('filter[status]', searchFilters.status)
      }
      
      if (searchFilters.year) {
        params.append('filter[year]', searchFilters.year)
      }
      
      if (searchFilters.showType) {
        params.append('filter[subtype]', searchFilters.showType)
      }
      params.append('sort', searchFilters.sort)
      params.append('page[limit]', '20')
      params.append('page[offset]', String((page - 1) * 20))
      
      const response = await fetch(`${KITSU_API_BASE}/anime?${params.toString()}`)
      const data = await response.json()
      
      if (data.data) {
        const transformedData = data.data.map(transformKitsuData)
        
        let filteredData = transformedData
        
        if (searchFilters.minScore) {
          filteredData = filteredData.filter((anime: { score: number }) => anime.score >= parseFloat(searchFilters.minScore))
        }
        
        if (searchFilters.maxScore) {
          filteredData = filteredData.filter((anime: { score: number }) => anime.score <= parseFloat(searchFilters.maxScore))
        }
        
        if (page === 1) {
          setResults(filteredData)
        } else {
          setResults(prev => [...prev, ...filteredData])
        }
        
        setTotalCount(data.meta?.count || filteredData.length)
        setHasMore(data.links?.next != null)
      }
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

const debouncedSearch = useMemo(
  () =>
    debounce(
      (searchQuery: string, searchFilters: FilterType, page: number) => {
        performSearch(searchQuery, searchFilters, page)
      },
      500
    ),
  [performSearch]
)

  const handleSearchChange = (newQuery: string) => {
    setQuery(newQuery)
    setCurrentPage(1)
    debouncedSearch(newQuery, filters, 1)
  }


  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    setCurrentPage(1)
    debouncedSearch(query, newFilters, 1)
  }

  const clearFilters = () => {
    const clearedFilters = {
      status: '',
      genre: '',
      year: '',
      minScore: '',
      maxScore: '',
      sort: '-userCount',
      showType: ''
    }
    setFilters(clearedFilters)
    setCurrentPage(1)
    debouncedSearch(query, clearedFilters, 1)
  }

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = currentPage + 1
      setCurrentPage(nextPage)
      performSearch(query, filters, nextPage)
    }
  }
  useEffect(() => {
    performSearch('', filters, 1)
  }, [filters, performSearch])

  return (
    <div className="min-h-screen py-8">
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-6">Search Anime</h1>
          
          <div className="relative max-w-2xl mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={query}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search for anime titles..."
              className="w-full pl-10 pr-4 py-3 glass-effect rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-700"
            />
          </div>

          <Card className="mb-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 text-white hover:text-purple-400 transition-colors"
              >
                <Filter className="h-5 w-5" />
                <span className="font-medium">Advanced Filters</span>
                <span className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              
              {Object.values(filters).some(value => value && value !== '-userCount') && (
                <button
                  onClick={clearFilters}
                  className="flex items-center space-x-1 text-gray-400 hover:text-red-400 transition-colors"
                >
                  <X className="h-4 w-4" />
                  <span className="text-sm">Clear All</span>
                </button>
              )}
            </div>

            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-700 space-y-4">
                {/* First row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                    <select
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      className="w-full glass-effect rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-600"
                    >
                      <option value="">All Status</option>
                      {STATUS_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                    <select
                      value={filters.showType}
                      onChange={(e) => handleFilterChange('showType', e.target.value)}
                      className="w-full glass-effect rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-600"
                    >
                      <option value="">All Types</option>
                      <option value="TV">TV Series</option>
                      <option value="movie">Movie</option>
                      <option value="OVA">OVA</option>
                      <option value="ONA">ONA</option>
                      <option value="special">Special</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Year</label>
                    <input
                      type="number"
                      placeholder="e.g., 2023"
                      value={filters.year}
                      onChange={(e) => handleFilterChange('year', e.target.value)}
                      className="w-full glass-effect rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Min Score</label>
                    <input
                      type="number"
                      placeholder="0.0"
                      step="0.1"
                      min="0"
                      max="10"
                      value={filters.minScore}
                      onChange={(e) => handleFilterChange('minScore', e.target.value)}
                      className="w-full glass-effect rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Max Score</label>
                    <input
                      type="number"
                      placeholder="10.0"
                      step="0.1"
                      min="0"
                      max="10"
                      value={filters.maxScore}
                      onChange={(e) => handleFilterChange('maxScore', e.target.value)}
                      className="w-full glass-effect rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
                    <select
                      value={filters.sort}
                      onChange={(e) => handleFilterChange('sort', e.target.value)}
                      className="w-full glass-effect rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-600"
                    >
                      {SORT_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="text-gray-300">
            {query ? (
              <>
                Results for <span className="text-white font-medium">{query}</span>
                {totalCount > 0 && <span className="ml-2 text-sm">({totalCount.toLocaleString()} total)</span>}
              </>
            ) : (
              <>
                Popular Anime
                {totalCount > 0 && <span className="ml-2 text-sm">({results.length} shown)</span>}
              </>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-purple-600 text-white'
                  : 'glass-effect text-gray-300 hover:text-white border border-gray-600'
              }`}
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-purple-600 text-white'
                  : 'glass-effect text-gray-300 hover:text-white border border-gray-600'
              }`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>

        {loading && results.length === 0 ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner text="Searching anime..." />
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-2">
              {query ? 'No anime found matching your search.' : 'Start searching to discover amazing anime!'}
            </p>
            <p className="text-gray-500 text-sm">
              Try adjusting your search terms or filters
            </p>
          </div>
        ) : (
          <>
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'
                : 'space-y-4'
            }>
              {results.map((anime) => (
                <AnimeCard key={anime.mal_id} anime={anime} variant={viewMode} />
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5 mr-2" />
                      Load More
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </Container>
    </div>
  )
}
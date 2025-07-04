'use client'
import { useState } from 'react'
import { BookOpen, Heart, Trash2, Grid, List } from 'lucide-react'
import Container from '../components/Container'
import AnimeCard from '../components/AnimeCard'
import Card from '../components/Card'
import { useWatchlistContext } from '../context/WatchlistContext'

export default function WatchlistPage() {
  const [activeTab, setActiveTab] = useState<'watchlist' | 'favorites'>('watchlist')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const { watchlist, favorites, clearWatchlist, clearFavorites } = useWatchlistContext()

  const currentAnime = activeTab === 'watchlist' ? watchlist : favorites
  const currentCount = activeTab === 'watchlist' ? watchlist.length : favorites.length

  const handleClear = () => {
    if (activeTab === 'watchlist') {
      clearWatchlist()
    } else {
      clearFavorites()
    }
  }

  return (
    <div className="min-h-screen py-8">
      <Container>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">My Collection</h1>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-purple-600 text-white'
                  : 'glass-effect text-gray-300 hover:text-white'
              }`}
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-purple-600 text-white'
                  : 'glass-effect text-gray-300 hover:text-white'
              }`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8">
          <button
            onClick={() => setActiveTab('watchlist')}
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'watchlist'
                ? 'bg-blue-600 text-white'
                : 'glass-effect text-gray-300 hover:text-white'
            }`}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Watchlist ({watchlist.length})
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'favorites'
                ? 'bg-red-600 text-white'
                : 'glass-effect text-gray-300 hover:text-white'
            }`}
          >
            <Heart className="h-4 w-4 mr-2" />
            Favorites ({favorites.length})
          </button>
        </div>

        {currentCount === 0 ? (
          <Card className="text-center py-16">
            <div className="text-gray-400 mb-4">
              {activeTab === 'watchlist' ? (
                <BookOpen className="h-16 w-16 mx-auto mb-4" />
              ) : (
                <Heart className="h-16 w-16 mx-auto mb-4" />
              )}
              <h2 className="text-xl font-semibold mb-2 text-white">
                Your {activeTab === 'watchlist' ? 'watchlist' : 'favorites'} is empty
              </h2>
              <p>
                Start adding anime to your {activeTab === 'watchlist' ? 'watchlist' : 'favorites'} to see them here.
              </p>
            </div>
          </Card>
        ) : (
          <>

            <div className="flex justify-end mb-6">
              <button
                onClick={handleClear}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear {activeTab === 'watchlist' ? 'Watchlist' : 'Favorites'}
              </button>
            </div>

            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'
                : 'space-y-4'
            }>
              {currentAnime.map((anime) => (
                <AnimeCard key={anime.mal_id} anime={anime} variant={viewMode} />
              ))}
            </div>
          </>
        )}
      </Container>
    </div>
  )
}
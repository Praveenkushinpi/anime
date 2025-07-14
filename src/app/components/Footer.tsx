import { Star, Heart } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="glass-effect border-t border-purple-500/20 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Star className="h-8 w-8 text-purple-500" />
              <span className="text-xl font-bold gradient-text">AnimeHub</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Your ultimate destination for discovering amazing anime series, tracking your favorites, 
              and staying connected with the anime community.
            </p>
            <div className="flex space-x-4">
              
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Features</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/search" className="hover:text-purple-400 transition-colors">Anime Search</a></li>
              <li><a href="/watchlist" className="hover:text-purple-400 transition-colors">Watchlist</a></li>
            </ul>
          </div>
          
        
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 flex items-center justify-center">
            Made with <Heart className="h-4 w-4 text-red-500 mx-1" /> for anime lovers
          </p>
        </div>
      </div>
      </div>
    </footer>
  )
}

export default Footer
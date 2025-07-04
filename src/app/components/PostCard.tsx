'use client'
import { MessageCircle, User } from 'lucide-react'
import Card from './Card'

interface Post {
  id: number
  title: string
  body: string
  userId: number
}

interface PostCardProps {
  post: Post
  userName?: string
}

const PostCard: React.FC<PostCardProps> = ({ post, userName }) => {
  return (
    <Card hover className="animate-fade-in">
      <div className="flex items-start space-x-3 mb-3">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <User className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-purple-400">
            {userName || `User ${post.userId}`}
          </h4>
          <p className="text-xs text-gray-400">Community Member</p>
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-white mb-3 line-clamp-2 hover:text-purple-400 transition-colors">
        {post.title}
      </h3>
      
      <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
        {post.body}
      </p>
      
      <div className="flex items-center justify-between pt-3 border-t border-gray-700">
        <div className="flex items-center text-gray-400 text-sm">
          <MessageCircle className="h-4 w-4 mr-1" />
          <span>Discuss</span>
        </div>
        <button className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors">
          Read More
        </button>
      </div>
    </Card>
  )
}

export default PostCard
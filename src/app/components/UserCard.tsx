'use client'
import Image from 'next/image'
import { Mail, MapPin, Globe, Building } from 'lucide-react'
import Card from './Card'

interface User {
  id: number
  name: string
  username: string
  email: string
  address: {
    street: string
    suite: string
    city: string
    zipcode: string
  }
  phone: string
  website: string
  company: {
    name: string
    catchPhrase: string
    bs: string
  }
}

interface UserCardProps {
  user: User
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  return (
    <Card hover className="animate-slide-up">
      <div className="text-center mb-4">
        <div className="relative w-20 h-20 mx-auto mb-4">
          <Image
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
            alt={user.name}
            fill
            className="rounded-full object-cover"
          />
        </div>
        <h3 className="text-xl font-semibold text-white mb-1">{user.name}</h3>
        <p className="text-purple-400">@{user.username}</p>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center text-gray-300">
          <Mail className="h-4 w-4 mr-2 text-purple-400" />
          <span className="text-sm">{user.email}</span>
        </div>
        
        <div className="flex items-center text-gray-300">
          <MapPin className="h-4 w-4 mr-2 text-purple-400" />
          <span className="text-sm">{user.address.city}</span>
        </div>
        
        <div className="flex items-center text-gray-300">
          <Globe className="h-4 w-4 mr-2 text-purple-400" />
          <span className="text-sm">{user.website}</span>
        </div>
        
        <div className="flex items-center text-gray-300">
          <Building className="h-4 w-4 mr-2 text-purple-400" />
          <span className="text-sm">{user.company.name}</span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-700">
        <p className="text-xs text-gray-400 italic">{user.company.catchPhrase}</p>
      </div>
    </Card>
  )
}

export default UserCard
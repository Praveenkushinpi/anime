import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  text?: string
  className?: string
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  text = 'Loading...', 
  className = '' 
}) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12',
  }

  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-purple-400 mb-2`} />
      {text && <p className="text-gray-300 animate-pulse">{text}</p>}
    </div>
  )
}

export default LoadingSpinner
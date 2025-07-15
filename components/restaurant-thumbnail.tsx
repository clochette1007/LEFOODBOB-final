"use client"

import { useGooglePlacesPhotos } from '@/hooks/use-google-places-photos'
import type { Restaurant } from '@/lib/restaurants'

interface RestaurantThumbnailProps {
  restaurant: Restaurant
  onClick: () => void
  size?: 'small' | 'medium' | 'large'
  className?: string
}

export default function RestaurantThumbnail({ 
  restaurant, 
  onClick, 
  size = 'medium',
  className = "" 
}: RestaurantThumbnailProps) {
  const { primaryPhoto, isLoading, error } = useGooglePlacesPhotos({
    query: restaurant.query,
    maxPhotos: 1,
    maxWidth: size === 'large' ? 400 : size === 'medium' ? 200 : 100,
    maxHeight: size === 'large' ? 300 : size === 'medium' ? 150 : 100
  })

  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32'
  }

  if (isLoading) {
    return (
      <div className={`${sizeClasses[size]} ${className} bg-gray-200 rounded-lg animate-pulse flex items-center justify-center`}>
        <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error || !primaryPhoto) {
    return (
      <div className={`${sizeClasses[size]} ${className} bg-gray-200 rounded-lg flex items-center justify-center`}>
        <div className="text-center text-gray-500 text-xs">
          <div>Photo</div>
          <div>indisponible</div>
        </div>
      </div>
    )
  }

  return (
    <div className={`${sizeClasses[size]} ${className} flex-shrink-0 cursor-pointer`} onClick={onClick}>
      <img
        src={primaryPhoto.url}
        alt={restaurant.name}
        className="w-full h-full object-cover rounded-lg hover:opacity-90 transition-opacity"
      />
    </div>
  )
} 
"use client"

import { useGooglePlacesPhotos } from '@/hooks/use-google-places-photos'
import { Restaurant } from '@/lib/restaurants'

interface RestaurantPhotoCarouselProps {
  restaurant: Restaurant
}

export function RestaurantPhotoCarousel({ restaurant }: RestaurantPhotoCarouselProps) {
  // Récupérer la vraie photo depuis Google Places API
  const { primaryPhoto, isLoading: photoLoading, error: photoError } = useGooglePlacesPhotos({
    query: restaurant.query,
    maxPhotos: 1,
    maxWidth: 800,
    maxHeight: 400
  })

  return (
    <div className="relative w-full h-80 bg-gray-200 overflow-hidden">
      {photoLoading ? (
        <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="text-gray-500">Chargement de la photo du restaurant...</div>
        </div>
      ) : primaryPhoto ? (
        <img
          src={primaryPhoto.url}
          alt={`${restaurant.name} - Photo du restaurant`}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="text-lg font-semibold">{restaurant.name}</div>
            <div className="text-sm">Photo non disponible</div>
          </div>
        </div>
      )}
    </div>
  )
} 
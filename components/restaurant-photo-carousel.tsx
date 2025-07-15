"use client"

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useGooglePlacesPhotos } from '@/hooks/use-google-places-photos'

interface RestaurantPhotoCarouselProps {
  restaurantQuery: string
  restaurantName: string
  fallbackPhoto?: string
}

export default function RestaurantPhotoCarousel({
  restaurantQuery,
  restaurantName,
  fallbackPhoto
}: RestaurantPhotoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { photos, isLoading, error } = useGooglePlacesPhotos({
    query: restaurantQuery,
    maxPhotos: 4,
    maxWidth: 1200,
    maxHeight: 600
  })

  const nextPhoto = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length)
  }

  const prevPhoto = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length)
  }

  if (isLoading) {
    return (
      <div className="relative w-full h-80 bg-gray-200 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  // Si pas de photos ou erreur, utiliser la photo de fallback du restaurant
  if (error || photos.length === 0) {
    return (
      <div className="relative w-full h-80 bg-gray-200 overflow-hidden">
        <img
          src={fallbackPhoto || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"}
          alt={`${restaurantName} - Restaurant photo`}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
          Photo du restaurant
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-80 bg-gray-200 overflow-hidden">
      {/* Photo principale */}
      <img
        src={photos[currentIndex].url}
        alt={`${restaurantName} - Photo ${currentIndex + 1}`}
        className="w-full h-full object-cover transition-opacity duration-300"
      />

      {/* Flèches de navigation - seulement si plus d'une photo */}
      {photos.length > 1 && (
        <>
          <button
            onClick={prevPhoto}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-all"
            aria-label="Photo précédente"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={nextPhoto}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-all"
            aria-label="Photo suivante"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Indicateurs de position - seulement si plus d'une photo */}
      {photos.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {photos.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex 
                  ? 'bg-white' 
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
              aria-label={`Aller à la photo ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Compteur de photos */}
      {photos.length > 1 && (
        <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {photos.length}
        </div>
      )}
    </div>
  )
} 
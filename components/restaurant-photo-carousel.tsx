"use client"

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface RestaurantPhotoCarouselProps {
  restaurantQuery: string
  fallbackPhoto: string
  restaurantName: string
}

export default function RestaurantPhotoCarousel({
  restaurantQuery,
  fallbackPhoto,
  restaurantName
}: RestaurantPhotoCarouselProps) {
  const [photos, setPhotos] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        if (!window.google) {
          setPhotos([fallbackPhoto])
          setIsLoading(false)
          return
        }

        const placesService = new window.google.maps.places.PlacesService(document.createElement('div'))
        placesService.findPlaceFromQuery(
          {
            query: restaurantQuery,
            fields: ["photos"],
          },
          (results: any, status: any) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK && results && results[0]?.photos) {
              const googlePhotos = results[0].photos.slice(0, 4).map((photo: any) => 
                photo.getUrl({
                  maxWidth: 1200,
                  maxHeight: 600,
                })
              )
              setPhotos(googlePhotos.length > 0 ? googlePhotos : [fallbackPhoto])
            } else {
              setPhotos([fallbackPhoto])
            }
            setIsLoading(false)
          }
        )
      } catch (error) {
        console.error('Erreur lors du chargement des photos:', error)
        setPhotos([fallbackPhoto])
        setIsLoading(false)
      }
    }

    loadPhotos()
  }, [restaurantQuery, fallbackPhoto])

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

  return (
    <div className="relative w-full h-80 bg-gray-200 overflow-hidden">
      {/* Photo principale */}
      <img
        src={photos[currentIndex]}
        alt={`${restaurantName} - Photo ${currentIndex + 1}`}
        className="w-full h-full object-cover transition-opacity duration-300"
        onError={(e) => {
          const target = e.target as HTMLImageElement
          target.src = fallbackPhoto
        }}
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
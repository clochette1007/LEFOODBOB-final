import { useState, useEffect } from 'react'

export interface GooglePlacesPhoto {
  url: string
  width: number
  height: number
}

interface UseGooglePlacesPhotosProps {
  query: string
  maxPhotos?: number
  maxWidth?: number
  maxHeight?: number
}

export function useGooglePlacesPhotos({
  query,
  maxPhotos = 4,
  maxWidth = 1200,
  maxHeight = 600
}: UseGooglePlacesPhotosProps) {
  const [photos, setPhotos] = useState<GooglePlacesPhoto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        setIsLoading(true)
        setError(null)

        if (!window.google) {
          setError('Google Maps not loaded')
          setIsLoading(false)
          return
        }

        const placesService = new window.google.maps.places.PlacesService(document.createElement('div'))
        
        placesService.findPlaceFromQuery(
          {
            query: query,
            fields: ["photos", "name", "place_id"],
          },
          (results: any, status: any) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK && results && results[0]) {
              const place = results[0]
              
              if (place.photos && place.photos.length > 0) {
                const googlePhotos = place.photos.slice(0, maxPhotos).map((photo: any) => ({
                  url: photo.getUrl({
                    maxWidth,
                    maxHeight,
                  }),
                  width: maxWidth,
                  height: maxHeight
                }))
                
                setPhotos(googlePhotos)
              } else {
                setError('No photos found')
              }
            } else {
              setError('Place not found')
            }
            setIsLoading(false)
          }
        )
      } catch (err) {
        setError('Error loading photos')
        setIsLoading(false)
      }
    }

    if (query) {
      loadPhotos()
    }
  }, [query, maxPhotos, maxWidth, maxHeight])

  return {
    photos,
    isLoading,
    error,
    primaryPhoto: photos.length > 0 ? photos[0] : null
  }
} 
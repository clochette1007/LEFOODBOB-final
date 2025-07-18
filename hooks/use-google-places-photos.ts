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
          console.error('Google Maps not loaded')
          setError('Google Maps not loaded')
          setIsLoading(false)
          return
        }

        if (!window.google.maps) {
          console.error('Google Maps API not available')
          setError('Google Maps API not available')
          setIsLoading(false)
          return
        }

        if (!window.google.maps.places) {
          console.error('Google Places API not available')
          setError('Google Places API not available')
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
            console.log('Places API response:', { results, status, query })
            
            if (status === window.google.maps.places.PlacesServiceStatus.OK && results && results[0]) {
              const place = results[0]
              console.log('Place found:', place)
              
              if (place.photos && place.photos.length > 0) {
                const googlePhotos = place.photos.slice(0, maxPhotos).map((photo: any) => ({
                  url: photo.getUrl({
                    maxWidth,
                    maxHeight,
                  }),
                  width: maxWidth,
                  height: maxHeight
                }))
                
                console.log('Photos loaded:', googlePhotos)
                setPhotos(googlePhotos)
              } else {
                console.log('No photos found for place')
                setError('No photos found')
              }
            } else {
              console.error('Places API error:', status)
              let errorMessage = 'Place not found'
              
              switch (status) {
                case window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS:
                  errorMessage = 'No results found'
                  break
                case window.google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT:
                  errorMessage = 'Query limit exceeded'
                  break
                case window.google.maps.places.PlacesServiceStatus.REQUEST_DENIED:
                  errorMessage = 'Request denied - Check API key'
                  break
                case window.google.maps.places.PlacesServiceStatus.INVALID_REQUEST:
                  errorMessage = 'Invalid request'
                  break
                case window.google.maps.places.PlacesServiceStatus.UNKNOWN_ERROR:
                  errorMessage = 'Unknown error'
                  break
              }
              
              setError(errorMessage)
            }
            setIsLoading(false)
          }
        )
      } catch (err) {
        console.error('Error loading photos:', err)
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

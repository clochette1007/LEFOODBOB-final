"use client"

import { useState, useEffect } from "react"

interface PlacesPhoto {
  url: string
  width: number
  height: number
}

interface UseGooglePlacesPhotosProps {
  placeName: string
  maxPhotos?: number
}

export function useGooglePlacesPhotos({ placeName, maxPhotos = 5 }: UseGooglePlacesPhotosProps) {
  const [photos, setPhotos] = useState<PlacesPhoto[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!placeName || typeof window === "undefined" || !window.google?.maps) {
      return
    }

    const fetchPhotos = async () => {
      setLoading(true)
      setError(null)

      try {
        const service = new window.google.maps.places.PlacesService(document.createElement("div"))

        // Rechercher le lieu
        const request = {
          query: placeName,
          fields: ["photos", "place_id", "name"],
        }

        service.textSearch(request, (results, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && results?.[0]) {
            const place = results[0]

            if (place.photos && place.photos.length > 0) {
              const photoUrls = place.photos.slice(0, maxPhotos).map((photo) => ({
                url: photo.getUrl({ maxWidth: 800, maxHeight: 600 }),
                width: 800,
                height: 600,
              }))

              setPhotos(photoUrls)
            } else {
              setPhotos([])
            }
          } else {
            setError("Aucune photo trouvée pour ce restaurant")
            setPhotos([])
          }

          setLoading(false)
        })
      } catch (err) {
        setError("Erreur lors du chargement des photos")
        setPhotos([])
        setLoading(false)
      }
    }

    fetchPhotos()
  }, [placeName, maxPhotos])

  return { photos, loading, error }
}

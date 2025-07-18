"use client"

import { useState, useEffect } from "react"

declare global {
  interface Window {
    google: any
  }
}

export function useGooglePlacesPhotos(query: string) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!query || !window.google) return

    const fetchPhoto = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const service = new window.google.maps.places.PlacesService(document.createElement("div"))

        const request = {
          query: query,
          fields: ["photos", "name", "place_id"],
        }

        service.textSearch(request, (results, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && results && results[0]) {
            const place = results[0]

            if (place.photos && place.photos.length > 0) {
              const photo = place.photos[0]
              const photoUrl = photo.getUrl({
                maxWidth: 400,
                maxHeight: 300,
              })
              setPhotoUrl(photoUrl)
            } else {
              console.log(`Aucune photo trouvée pour: ${query}`)
              setPhotoUrl(null)
            }
          } else {
            console.log(`Recherche échouée pour: ${query}, status: ${status}`)
            // Essayer une recherche simplifiée
            const simplifiedQuery = query.split(" ").slice(0, 2).join(" ")
            if (simplifiedQuery !== query) {
              const fallbackRequest = {
                query: simplifiedQuery,
                fields: ["photos", "name"],
              }

              service.textSearch(fallbackRequest, (fallbackResults, fallbackStatus) => {
                if (
                  fallbackStatus === window.google.maps.places.PlacesServiceStatus.OK &&
                  fallbackResults &&
                  fallbackResults[0] &&
                  fallbackResults[0].photos
                ) {
                  const photo = fallbackResults[0].photos[0]
                  const photoUrl = photo.getUrl({
                    maxWidth: 400,
                    maxHeight: 300,
                  })
                  setPhotoUrl(photoUrl)
                } else {
                  setPhotoUrl(null)
                }
              })
            } else {
              setPhotoUrl(null)
            }
          }
          setIsLoading(false)
        })
      } catch (err) {
        console.error("Erreur lors de la récupération de la photo:", err)
        setError(err instanceof Error ? err.message : "Erreur inconnue")
        setPhotoUrl(null)
        setIsLoading(false)
      }
    }

    const timer = setTimeout(fetchPhoto, 100)
    return () => clearTimeout(timer)
  }, [query])

  return { photoUrl, isLoading, error }
}

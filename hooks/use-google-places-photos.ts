"use client"

import { useState, useEffect } from "react"

interface PlacesPhoto {
  photo_reference: string
  height: number
  width: number
  html_attributions: string[]
}

interface PlacesResult {
  place_id: string
  name: string
  photos?: PlacesPhoto[]
  rating?: number
  user_ratings_total?: number
}

export function useGooglePlacesPhotos(restaurantName: string, address: string) {
  const [photos, setPhotos] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!restaurantName || !address) return

    const fetchPhotos = async () => {
      setLoading(true)
      setError(null)

      try {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
        if (!apiKey) {
          throw new Error("Clé API Google Maps manquante")
        }

        // Recherche du lieu
        const searchQuery = `${restaurantName} ${address}`
        const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchQuery)}&key=${apiKey}`

        const searchResponse = await fetch(searchUrl)
        const searchData = await searchResponse.json()

        if (searchData.status !== "OK" || !searchData.results.length) {
          throw new Error("Restaurant non trouvé")
        }

        const place = searchData.results[0] as PlacesResult

        if (!place.photos || place.photos.length === 0) {
          setPhotos([])
          return
        }

        // Récupération des URLs des photos
        const photoUrls = place.photos.slice(0, 5).map((photo) => {
          return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photo.photo_reference}&key=${apiKey}`
        })

        setPhotos(photoUrls)
      } catch (err) {
        console.error("Erreur lors de la récupération des photos:", err)
        setError(err instanceof Error ? err.message : "Erreur inconnue")
        setPhotos([])
      } finally {
        setLoading(false)
      }
    }

    fetchPhotos()
  }, [restaurantName, address])

  return { photos, loading, error }
}

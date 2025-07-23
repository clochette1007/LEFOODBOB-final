"use client"

import { useEffect, useRef, useState } from "react"
import type { Restaurant } from "@/lib/restaurants"

interface RestaurantMapProps {
  restaurants: Restaurant[]
}

declare global {
  interface Window {
    google: any
    initMap: () => void
  }
}

export default function RestaurantMap({ restaurants }: RestaurantMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const markersRef = useRef<any[]>([])

  // Charger Google Maps avec script direct
  useEffect(() => {
    const loadGoogleMaps = () => {
      try {
        // Vérifier si Google Maps est déjà chargé
        if (window.google && window.google.maps) {
          setIsLoaded(true)
          return
        }

        // Fonction callback globale
        window.initMap = () => {
          setIsLoaded(true)
        }

        // Créer le script
        const script = document.createElement("script")
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&callback=initMap&libraries=places`
        script.async = true
        script.defer = true

        script.onerror = () => {
          setError("Impossible de charger Google Maps. Vérifiez votre clé API.")
        }

        document.head.appendChild(script)
      } catch (err) {
        setError("Erreur lors du chargement de Google Maps")
      }
    }

    loadGoogleMaps()

    // Cleanup
    return () => {
      if (window.initMap) {
        delete window.initMap
      }
    }
  }, [])

  // Initialiser la carte
  useEffect(() => {
    if (!isLoaded || !mapRef.current || map || !window.google) return

    try {
      const newMap = new window.google.maps.Map(mapRef.current, {
        center: { lat: 48.8566, lng: 2.3522 }, // Paris
        zoom: 12,
        styles: [
          {
            featureType: "poi.business",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "poi.attraction",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
      })

      setMap(newMap)
    } catch (err) {
      console.error("Erreur initialisation carte:", err)
      setError("Erreur lors de l'initialisation de la carte")
    }
  }, [isLoaded, map])

  // Ajouter les marqueurs
  useEffect(() => {
    if (!map || !restaurants.length || !window.google) return

    // Supprimer les anciens marqueurs
    markersRef.current.forEach((marker) => {
      marker.setMap(null)
    })
    markersRef.current = []

    // Créer les nouveaux marqueurs
    const bounds = new window.google.maps.LatLngBounds()
    let hasValidCoordinates = false

    restaurants.forEach((restaurant) => {
      if (restaurant.coordinates) {
        try {
          const marker = new window.google.maps.Marker({
            position: restaurant.coordinates,
            map: map,
            title: restaurant.name,
            icon: {
              url:
                "data:image/svg+xml;charset=UTF-8," +
                encodeURIComponent(`
                <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="14" fill="#dc2626" stroke="white" strokeWidth="2"/>
                  <text x="16" y="20" textAnchor="middle" fill="white" fontSize="16">🍽️</text>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(32, 32),
            },
          })

          // Info window
          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div style="padding: 12px; max-width: 280px; font-family: system-ui, -apple-system, sans-serif;">
                <h3 style="margin: 0 0 8px 0; font-weight: 600; color: #111827; font-size: 16px;">${restaurant.name}</h3>
                ${restaurant.cuisine ? `<p style="margin: 0 0 8px 0; color: #2563eb; font-size: 14px;">${restaurant.cuisine}</p>` : ""}
                <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 13px; line-height: 1.4;">${restaurant.address}</p>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="color: #059669; font-weight: 500; font-size: 14px;">${restaurant.priceRange}</span>
                  ${restaurant.phone ? `<span style="color: #6b7280; font-size: 12px;">${restaurant.phone}</span>` : ""}
                </div>
              </div>
            `,
          })

          // Événement clic sur le marqueur
          marker.addListener("click", () => {
            infoWindow.open(map, marker)
          })

          markersRef.current.push(marker)
          bounds.extend(restaurant.coordinates)
          hasValidCoordinates = true
        } catch (err) {
          console.error(`Erreur création marqueur pour ${restaurant.name}:`, err)
        }
      }
    })

    // Ajuster la vue pour inclure tous les marqueurs
    if (hasValidCoordinates) {
      map.fitBounds(bounds)
      // Éviter un zoom trop important pour un seul restaurant
      const listener = window.google.maps.event.addListener(map, "idle", () => {
        if (map.getZoom() > 16) map.setZoom(16)
        window.google.maps.event.removeListener(listener)
      })
    }
  }, [map, restaurants])

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100">
        <div className="text-center p-6 max-w-sm">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Carte indisponible</h3>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <p className="text-xs text-gray-500">
            Vérifiez votre connexion internet et la configuration de l'API Google Maps
          </p>
        </div>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100">
        <div className="text-center p-6">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Chargement de la carte</h3>
          <p className="text-sm text-gray-600">Préparation des restaurants...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full relative">
      <div ref={mapRef} className="h-full w-full" />

      {/* Compteur de restaurants */}
      {restaurants.length > 0 && (
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg px-3 py-2 border">
          <p className="text-sm font-medium text-gray-900">
            {restaurants.length} restaurant{restaurants.length > 1 ? "s" : ""} affiché
            {restaurants.length > 1 ? "s" : ""}
          </p>
        </div>
      )}
    </div>
  )
}

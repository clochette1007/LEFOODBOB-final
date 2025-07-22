"use client"

import { useEffect, useRef, useState } from "react"
import type { Restaurant } from "@/lib/restaurants"
import * as google from "google.maps"

interface RestaurantMapProps {
  restaurants: Restaurant[]
}

export default function RestaurantMap({ restaurants }: RestaurantMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const markersRef = useRef<google.maps.Marker[]>([])

  // Charger Google Maps
  useEffect(() => {
    const loadGoogleMaps = async () => {
      try {
        if (typeof window.google !== "undefined") {
          setIsLoaded(true)
          return
        }

        const script = document.createElement("script")
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`
        script.async = true
        script.defer = true

        script.onload = () => {
          setIsLoaded(true)
        }

        script.onerror = () => {
          setError("Erreur lors du chargement de Google Maps")
        }

        document.head.appendChild(script)
      } catch (err) {
        setError("Erreur lors du chargement de Google Maps")
      }
    }

    loadGoogleMaps()
  }, [])

  // Initialiser la carte
  useEffect(() => {
    if (!isLoaded || !mapRef.current || map) return

    try {
      const newMap = new google.maps.Map(mapRef.current, {
        center: { lat: 48.8566, lng: 2.3522 }, // Paris
        zoom: 12,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
      })

      setMap(newMap)
    } catch (err) {
      setError("Erreur lors de l'initialisation de la carte")
    }
  }, [isLoaded, map])

  // Ajouter les marqueurs
  useEffect(() => {
    if (!map || !restaurants.length) return

    // Supprimer les anciens marqueurs
    markersRef.current.forEach((marker) => marker.setMap(null))
    markersRef.current = []

    // Ajouter les nouveaux marqueurs
    restaurants.forEach((restaurant) => {
      if (restaurant.coordinates) {
        const marker = new google.maps.Marker({
          position: restaurant.coordinates,
          map: map,
          title: restaurant.name,
          icon: {
            url: "/bobrepere.png",
            scaledSize: new google.maps.Size(32, 32),
          },
        })

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div class="p-3 max-w-xs">
              <h3 class="font-semibold text-gray-900 mb-1">${restaurant.name}</h3>
              <p class="text-sm text-blue-600 mb-2">${restaurant.cuisine || ""}</p>
              <p class="text-xs text-gray-600 mb-2">${restaurant.address}</p>
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-green-600">${restaurant.priceRange}</span>
                ${restaurant.phone ? `<span class="text-xs text-gray-500">${restaurant.phone}</span>` : ""}
              </div>
            </div>
          `,
        })

        marker.addListener("click", () => {
          infoWindow.open(map, marker)
        })

        markersRef.current.push(marker)
      }
    })

    // Ajuster la vue pour inclure tous les marqueurs
    if (restaurants.length > 0) {
      const bounds = new google.maps.LatLngBounds()
      restaurants.forEach((restaurant) => {
        if (restaurant.coordinates) {
          bounds.extend(restaurant.coordinates)
        }
      })
      map.fitBounds(bounds)
    }
  }, [map, restaurants])

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100">
        <div className="text-center p-6">
          <p className="text-red-600 mb-2">Erreur de chargement</p>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100">
        <div className="text-center p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Chargement de la carte...</p>
        </div>
      </div>
    )
  }

  return <div ref={mapRef} className="h-full w-full" />
}

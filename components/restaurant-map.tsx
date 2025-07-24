"use client"

import { useEffect, useRef, useState } from "react"
import { searchRestaurants, type Restaurant } from "@/lib/restaurants"

declare global {
  interface Window {
    google: any
    initMap: () => void
  }
}

interface RestaurantMapProps {
  searchQuery?: string
}

export default function RestaurantMap({ searchQuery = "" }: RestaurantMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [markers, setMarkers] = useState<any[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([])

  // Filter restaurants based on search query
  useEffect(() => {
    const restaurants = searchRestaurants(searchQuery)
    setFilteredRestaurants(restaurants)
  }, [searchQuery])

  // Load Google Maps script
  useEffect(() => {
    if (window.google) {
      setIsLoaded(true)
      return
    }

    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&loading=async&callback=initMap`
    script.async = true
    script.defer = true

    window.initMap = () => {
      setIsLoaded(true)
    }

    script.onerror = () => {
      setError("Erreur de chargement de Google Maps")
    }

    document.head.appendChild(script)

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapRef.current || map) return

    try {
      const newMap = new window.google.maps.Map(mapRef.current, {
        center: { lat: 48.8566, lng: 2.3522 },
        zoom: 13,
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
      setError("Erreur d'initialisation de la carte")
    }
  }, [isLoaded, map])

  // Update markers when restaurants change
  useEffect(() => {
    if (!map || !window.google) return

    // Clear existing markers
    markers.forEach((marker) => marker.setMap(null))

    // Create new markers
    const newMarkers = filteredRestaurants
      .filter((restaurant) => restaurant.coordinates)
      .map((restaurant) => {
        const marker = new window.google.maps.Marker({
          position: restaurant.coordinates,
          map: map,
          title: restaurant.name,
          icon: {
            url:
              "data:image/svg+xml;charset=UTF-8," +
              encodeURIComponent(`
              <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="12" fill="#ef4444" stroke="#fff" strokeWidth="2"/>
                <text x="16" y="20" textAnchor="middle" fill="white" fontSize="16">🍽️</text>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(32, 32),
          },
        })

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 10px; max-width: 250px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${restaurant.name}</h3>
              <p style="margin: 0 0 4px 0; color: #2563eb; font-size: 14px;">${restaurant.cuisine}</p>
              <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">${restaurant.address}</p>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="color: #16a34a; font-weight: bold;">${restaurant.priceRange}</span>
                ${restaurant.phone ? `<span style="color: #666; font-size: 12px;">${restaurant.phone}</span>` : ""}
              </div>
              ${
                restaurant.distinctions && restaurant.distinctions.length > 0
                  ? `<div style="margin-top: 8px; font-size: 12px; color: #f59e0b;">${restaurant.distinctions.join(", ")}</div>`
                  : ""
              }
            </div>
          `,
        })

        marker.addListener("click", () => {
          infoWindow.open(map, marker)
        })

        return marker
      })

    setMarkers(newMarkers)

    // Adjust map bounds to show all markers
    if (newMarkers.length > 0) {
      const bounds = new window.google.maps.LatLngBounds()
      newMarkers.forEach((marker) => bounds.extend(marker.getPosition()))
      map.fitBounds(bounds)

      // Set minimum zoom level
      const listener = window.google.maps.event.addListener(map, "idle", () => {
        if (map.getZoom() > 15) map.setZoom(15)
        window.google.maps.event.removeListener(listener)
      })
    }
  }, [map, filteredRestaurants, markers])

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-gray-50 p-8">
        <div className="text-red-500 text-lg mb-4">⚠️ {error}</div>
        <div className="text-gray-600 text-center max-w-md">
          <p className="mb-4">La carte n'est pas disponible pour le moment.</p>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold mb-2">Restaurants disponibles :</h3>
            <div className="space-y-2">
              {filteredRestaurants.slice(0, 5).map((restaurant) => (
                <div key={restaurant.id} className="text-sm">
                  <div className="font-medium">{restaurant.name}</div>
                  <div className="text-gray-500">{restaurant.address}</div>
                </div>
              ))}
            </div>
            {filteredRestaurants.length > 5 && (
              <div className="text-sm text-gray-500 mt-2">
                ... et {filteredRestaurants.length - 5} autres restaurants
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de la carte...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-full">
      <div ref={mapRef} className="h-full w-full" />
      {filteredRestaurants.length > 0 && (
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3">
          <div className="text-sm font-medium text-gray-900">
            {filteredRestaurants.length} restaurant{filteredRestaurants.length > 1 ? "s" : ""} trouvé
            {filteredRestaurants.length > 1 ? "s" : ""}
          </div>
        </div>
      )}
    </div>
  )
}

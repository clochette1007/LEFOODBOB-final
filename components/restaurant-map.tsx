"use client"

import { useEffect, useRef, useState } from "react"
import { restaurants as defaultRestaurants, type Restaurant } from "@/lib/restaurants"
// import { google } from "google-maps"

interface RestaurantMapProps {
  restaurants?: Restaurant[]
}

declare global {
  interface Window {
    google: any
  }
}

export default function RestaurantMap({ restaurants = defaultRestaurants }: RestaurantMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<window.google.maps.Map | null>(null)
  const [markers, setMarkers] = useState<window.google.maps.Marker[]>([])
  const [infoWindow, setInfoWindow] = useState<window.google.maps.InfoWindow | null>(null)

  useEffect(() => {
    if (!mapRef.current) return

    const initMap = () => {
      const mapInstance = new window.google.maps.Map(mapRef.current!, {
        center: { lat: 48.8566, lng: 2.3522 }, // Paris center
        zoom: 12,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
      })

      const infoWindowInstance = new window.google.maps.InfoWindow()

      setMap(mapInstance)
      setInfoWindow(infoWindowInstance)
    }

    if (window.google) {
      initMap()
    } else {
      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`
      script.async = true
      script.onload = initMap
      document.head.appendChild(script)
    }
  }, [])

  useEffect(() => {
    if (!map || !infoWindow) return

    // Clear existing markers
    markers.forEach((marker) => marker.setMap(null))

    const newMarkers: window.google.maps.Marker[] = []

    restaurants.forEach((restaurant) => {
      if (!restaurant.lat || !restaurant.lng) return

      const marker = new window.google.maps.Marker({
        position: { lat: restaurant.lat, lng: restaurant.lng },
        map: map,
        title: restaurant.name,
        icon: {
          url: "/bobrepere.png",
          scaledSize: new window.google.maps.Size(40, 40),
          anchor: new window.google.maps.Point(20, 40),
        },
      })

      marker.addListener("click", () => {
        const distinctionIcons = restaurant.distinctions
          .map((distinction) => {
            switch (distinction) {
              case "michelin-1":
              case "michelin-2":
              case "michelin-3":
                return `<img src="/etoile-michelin.webp" alt="Michelin" style="width: 20px; height: 20px; object-fit: contain; margin-right: 4px;">`
              case "michelin-bib":
                return `<img src="/bibgourmand.jpg" alt="Bib Gourmand" style="width: 20px; height: 20px; object-fit: contain; margin-right: 4px;">`
              case "gaultmillau-1":
              case "gaultmillau-2":
              case "gaultmillau-3":
                return `<img src="/1toque.png" alt="Gault&Millau" style="width: 20px; height: 20px; object-fit: contain; margin-right: 4px;">`
              default:
                return ""
            }
          })
          .join("")

        const content = `
          <div style="padding: 12px; max-width: 280px;">
            <div style="display: flex; gap: 12px;">
              <img src="/placeholder.svg?height=80&width=80&text=${encodeURIComponent(restaurant.name)}" 
                   alt="${restaurant.name}" 
                   style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; flex-shrink: 0;" />
              <div style="flex: 1; min-width: 0;">
                <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1f2937;">${restaurant.name}</h3>
                <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 8px;">
                  ${distinctionIcons}
                </div>
                <p style="margin: 0; font-size: 14px; color: #6b7280;">${restaurant.city}</p>
                <p style="margin: 4px 0 0 0; font-size: 14px; color: #6b7280;">${restaurant.priceRange}</p>
              </div>
            </div>
          </div>
        `

        infoWindow.setContent(content)
        infoWindow.open(map, marker)
      })

      newMarkers.push(marker)
    })

    setMarkers(newMarkers)

    // Adjust map bounds to fit all markers
    if (newMarkers.length > 0) {
      const bounds = new window.google.maps.LatLngBounds()
      newMarkers.forEach((marker) => {
        const position = marker.getPosition()
        if (position) bounds.extend(position)
      })
      map.fitBounds(bounds)

      // Set minimum zoom level
      const listener = window.google.maps.event.addListener(map, "idle", () => {
        if (map.getZoom()! > 15) map.setZoom(15)
        window.google.maps.event.removeListener(listener)
      })
    }
  }, [map, infoWindow, restaurants])

  return <div ref={mapRef} className="w-full h-full" />
}

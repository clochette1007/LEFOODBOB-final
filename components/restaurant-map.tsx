"use client"

import { useEffect, useRef, useState } from "react"
import { Loader } from "@googlemaps/js-api-loader"
import { Search, ArrowLeft } from "lucide-react"

declare global {
  interface Window {
    google: any
  }
}

interface Restaurant {
  address: string
  name: string
  city: string
  priceRange: string
  query: string
  isNew?: boolean
}

interface RestaurantWithPhoto extends Restaurant {
  photoUrl: string
  marker?: any
}

const restaurants: Restaurant[] = [
  {
    address: "1 Rue de Rivoli, 75001 Paris",
    name: "Le Grand Véfour",
    city: "1er arrondissement",
    priceRange: "€€€€",
    query: "Le Grand Véfour restaurant Paris",
    isNew: true,
  },
  {
    address: "12 Rue de l'Hôtel Colbert, 75005 Paris",
    name: "La Tour d'Argent",
    city: "5e arrondissement", 
    priceRange: "€€€€",
    query: "La Tour d'Argent restaurant Paris",
  },
  {
    address: "9 Place Dauphine, 75001 Paris",
    name: "Le Procope",
    city: "1er arrondissement",
    priceRange: "€€€",
    query: "Le Procope restaurant Paris",
  },
  {
    address: "25 Rue du Pont Neuf, 75001 Paris", 
    name: "L'Ami Jean",
    city: "7e arrondissement",
    priceRange: "€€€",
    query: "L'Ami Jean restaurant Paris",
    isNew: true,
  },
  {
    address: "54 Rue de Verneuil, 75007 Paris",
    name: "Le Comptoir du Relais", 
    city: "6e arrondissement",
    priceRange: "€€",
    query: "Le Comptoir du Relais restaurant Paris",
  },
  {
    address: "3 Rue Clauzel, 75009 Paris",
    name: "Frenchie",
    city: "2e arrondissement", 
    priceRange: "€€€",
    query: "Frenchie restaurant Paris",
  },
]

const mapStyles = [
  // Tout en gris sauf l'eau
  { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#f5f5f5" }] },

  // Routes en gris plus foncé
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },

  // Bâtiments et paysage en gris
  { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#eeeeee" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#e8e8e8" }] },

  // Seine en bleu (garder la couleur)
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#4fc3f7" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },

  // Masquer certains éléments
  { featureType: "administrative", elementType: "geometry", stylers: [{ visibility: "off" }] },
  { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
]

export default function RestaurantMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [restaurantsWithPhotos, setRestaurantsWithPhotos] = useState<RestaurantWithPhoto[]>([])
  const [infoWindow, setInfoWindow] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null)
  const [locationTitle, setLocationTitle] = useState("Paris")

  useEffect(() => {
    // Demander la géolocalisation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          setUserLocation(location)
          setLocationTitle("Autour de moi")
        },
        (error) => {
          console.log("Géolocalisation refusée ou erreur:", error)
          // Fallback sur Paris
          setUserLocation({ lat: 48.8566, lng: 2.3522 })
          setLocationTitle("Paris")
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // Cache 5 minutes
        }
      )
    } else {
      // Navigateur ne supporte pas la géolocalisation
      setUserLocation({ lat: 48.8566, lng: 2.3522 })
      setLocationTitle("Paris")
    }
  }, [])

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_Maps_API_KEY || "AIzaSyCcfMwhQwKmsAnRYfQCtYKsWpB4EI3NIq4",
        version: "weekly",
        libraries: ["places", "marker"],
      })

      await loader.load()
      const { Map } = await window.google.maps.importLibrary("maps")
      const { AdvancedMarkerElement, PinElement } = await window.google.maps.importLibrary("marker")

      // Utiliser la position de l'utilisateur ou Paris par défaut
      const mapCenter = userLocation || { lat: 48.8566, lng: 2.3522 }

      const mapInstance = new Map(mapRef.current as HTMLDivElement, {
        center: mapCenter,
        zoom: 13,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        styles: mapStyles,
        mapId: "DEMO_MAP_ID", // Requis pour AdvancedMarkerElement
      })
      setMap(mapInstance)

      // Ajouter un marqueur bleu pour la position de l'utilisateur (si disponible)
      if (userLocation && locationTitle === "Autour de moi") {
        const userPin = new PinElement({
          background: "#3b82f6",
          borderColor: "#1d4ed8",
          glyphColor: "white",
        })

        new AdvancedMarkerElement({
          map: mapInstance,
          position: userLocation,
          title: "Votre position",
          content: userPin.element,
        })
      }

      const placesService = new window.google.maps.places.PlacesService(mapInstance)
      const geocoder = new window.google.maps.Geocoder()
      const infoWindowInstance = new window.google.maps.InfoWindow()
      setInfoWindow(infoWindowInstance)

      // Ajouter les marqueurs et récupérer les photos
      const restaurantsWithMarkersAndPhotos = await Promise.all(
        restaurants.map(async (restaurant) => {
          try {
            // Géocodage
            const geoResult = await new Promise<any>((resolve, reject) => {
              geocoder.geocode({ address: restaurant.address }, (results, status) => {
                if (status === "OK" && results && results[0]) {
                  resolve(results[0])
                } else {
                  reject(new Error(`Géocodage échoué pour ${restaurant.address}`))
                }
              })
            })

            // Recherche de photo
            const placeResult = await new Promise<any>((resolve) => {
              placesService.findPlaceFromQuery(
                {
                  query: restaurant.query,
                  fields: ["photos"],
                },
                (results, status) => {
                  if (status === window.google.maps.places.PlacesServiceStatus.OK && results && results[0]) {
                    resolve(results[0])
                  } else {
                    resolve(null)
                  }
                },
              )
            })

            let photoUrl = "https://placehold.co/400x300/cccccc/333333?text=Image+non+disponible"
            if (placeResult?.photos && placeResult.photos.length > 0) {
              photoUrl = placeResult.photos[0].getUrl({
                maxWidth: 400,
                maxHeight: 300,
              })
            }

            // Créer le pin rouge avec AdvancedMarkerElement
            const pin = new PinElement({
              background: "#dc2626",
              borderColor: "#991b1b",
              glyphColor: "white",
            })

            const marker = new AdvancedMarkerElement({
              map: mapInstance,
              position: geoResult.geometry.location,
              title: restaurant.name,
              content: pin.element,
            })

            // Ajouter l'écouteur de clic
            marker.addListener("click", () => {
              const content = createInfoWindowContent({ ...restaurant, photoUrl })
              infoWindowInstance.setContent(content)
              infoWindowInstance.open(mapInstance, marker)
            })

            return { ...restaurant, photoUrl, marker }
          } catch (error) {
            console.error(`Erreur pour ${restaurant.name}:`, error)
            return { ...restaurant, photoUrl: "https://placehold.co/400x300/cccccc/333333?text=Image+non+disponible" }
          }
        }),
      )

      setRestaurantsWithPhotos(restaurantsWithMarkersAndPhotos)
    }

    if (mapRef.current && userLocation) {
      initMap()
    }
  }, [userLocation])

  const createInfoWindowContent = (restaurant: RestaurantWithPhoto) => {
    return `
    <div style="width: 320px; padding: 16px; background-color: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); display: flex; align-items: center; gap: 16px;">
      <div style="flex: 1;">
        ${restaurant.isNew ? '<span style="background-color: #ef4444; color: white; padding: 4px 8px; border-radius: 4px; font-size: 10px; font-weight: bold; text-transform: uppercase; margin-bottom: 8px; display: inline-block;">NOUVEAU</span>' : ""}
        <h3 style="font-size: 20px; font-weight: bold; color: #1f2937; margin: 0 0 4px 0;">${restaurant.name}</h3>
        <p style="font-size: 14px; color: #6b7280; margin: 0 0 4px 0;">${restaurant.city}</p>
        <p style="font-size: 14px; color: #6b7280; margin: 0;">${restaurant.priceRange} • Cuisine moderne</p>
      </div>
      <div style="width: 80px; height: 80px; border-radius: 12px; overflow: hidden; flex-shrink: 0;">
        <img src="${restaurant.photoUrl}" alt="${restaurant.name}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.onerror=null;this.src='https://placehold.co/80x80/cccccc/333333?text=Image';">
      </div>
    </div>
  `
  }

  const handleRestaurantClick = (restaurant: RestaurantWithPhoto) => {
    if (map && restaurant.marker) {
      map.setCenter(restaurant.marker.position)
      map.setZoom(16)

      const content = createInfoWindowContent(restaurant)
      infoWindow?.setContent(content)
      infoWindow?.open(map, restaurant.marker)
    }
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Barre de recherche */}
      <div className="p-6 border-b border-gray-200">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher sur Lefoodbob"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Section Autour de moi */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{locationTitle}</h2>
            <button className="text-blue-600 font-medium hover:text-blue-700">Tout Voir</button>
          </div>

          {/* Carte simple */}
          <div className="relative w-full h-96 rounded-lg overflow-hidden border border-gray-200 mb-6">
            <div ref={mapRef} className="w-full h-full" />
          </div>
        </div>

        {/* Section Mes favoris */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Mes favoris</h2>
            <button className="text-blue-600 font-medium hover:text-blue-700">Tout Voir</button>
          </div>

          <div className="grid gap-4">
            {restaurantsWithPhotos.slice(0, 3).map((restaurant, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleRestaurantClick(restaurant)}
              >
                <div className="flex gap-4">
                  <div className="flex-1">
                    {restaurant.isNew && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded mb-2 inline-block font-semibold">
                        NOUVEAU
                      </span>
                    )}
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{restaurant.name}</h3>
                    <p className="text-gray-600 text-sm mb-1">{restaurant.city}</p>
                    <p className="text-gray-600 text-sm">{restaurant.priceRange} • Cuisine moderne</p>
                  </div>

                  <div className="w-24 h-24 flex-shrink-0">
                    <img
                      src={restaurant.photoUrl || "/placeholder.svg"}
                      alt={restaurant.name}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "https://placehold.co/96x96/cccccc/333333?text=Image"
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

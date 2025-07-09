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

const restaurants: Restaurant[] = [
  {
    address: "Le Pantruche, 3 Rue Victor Masse, 75009 Paris",
    name: "Le Pantruche",
    city: "Paris, France",
    priceRange: "€€€",
    query: "Le Pantruche Paris",
  },
  {
    address: "Argile, 12 Rue de la Grande Chaumière, 75006 Paris",
    name: "Argile",
    city: "Paris, France",
    priceRange: "€€",
    isNew: true,
    query: "Argile Paris",
  },
  {
    address: "Clover Saint-Germain, 5 Rue Perronet, 75007 Paris",
    name: "Clover Saint-Germain",
    city: "Paris, France",
    priceRange: "€€€",
    query: "Clover Saint-Germain Paris",
  },
  {
    address: "Sushi B, 20 Rue Notre Dame de Lorette, 75009 Paris",
    name: "Sushi B",
    city: "Paris, France",
    priceRange: "€€€€",
    query: "Sushi B Paris",
  },
  {
    address: "Septime, 80 Rue de Charonne, 75011 Paris",
    name: "Septime",
    city: "Paris, France",
    priceRange: "€€€€",
    query: "Septime Paris",
  },
  {
    address: "Frenchie, 5 Rue du Nil, 75002 Paris",
    name: "Frenchie",
    city: "Paris, France",
    priceRange: "€€€",
    query: "Frenchie Paris",
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

type ViewType = "list" | "mix" | "map"

interface RestaurantWithPhoto extends Restaurant {
  photoUrl?: string
  marker?: any
}

export default function RestaurantMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [restaurantsWithPhotos, setRestaurantsWithPhotos] = useState<RestaurantWithPhoto[]>([])
  const [infoWindow, setInfoWindow] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isFullscreen, setIsFullscreen] = useState(false)

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

      const mapInstance = new Map(mapRef.current as HTMLDivElement, {
        center: { lat: 48.8566, lng: 2.3522 },
        zoom: 13,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        styles: mapStyles,
        mapId: "DEMO_MAP_ID", // Requis pour AdvancedMarkerElement
      })
      setMap(mapInstance)

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

    if (mapRef.current) {
      initMap()
    }
  }, [])

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

  const toggleFullscreen = () => {
    const newFullscreenState = !isFullscreen
    setIsFullscreen(newFullscreenState)

    // Utiliser requestAnimationFrame pour s'assurer que le DOM est mis à jour
    requestAnimationFrame(() => {
      setTimeout(() => {
        if (map && window.google) {
          // Forcer le redimensionnement de la carte
          window.google.maps.event.trigger(map, "resize")

          // Recentrer sur Paris avec un léger délai
          setTimeout(() => {
            const parisCenter = { lat: 48.8566, lng: 2.3522 }
            map.setCenter(parisCenter)
            map.setZoom(newFullscreenState ? 12 : 13)
          }, 100)
        }
      }, 50)
    })
  }

  return (
    <div className="bg-white min-h-screen">
      {!isFullscreen ? (
        <>
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
                <h2 className="text-2xl font-bold text-gray-900">Autour de moi</h2>
                <button className="text-blue-600 font-medium hover:text-blue-700">Tout Voir</button>
              </div>

              {/* Carte avec bouton agrandir */}
              <div className="relative w-full h-96 rounded-lg overflow-hidden border border-gray-200">
                <div ref={mapRef} className="w-full h-full" />
                <button
                  onClick={toggleFullscreen}
                  className="absolute top-4 right-4 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors"
                >
                  Agrandir le plan
                </button>
              </div>
            </div>

            {/* Section Mes favoris */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Mes favoris</h2>
                <button className="text-blue-600 font-medium hover:text-blue-700">Découvrir la liste</button>
              </div>

              {/* Liste horizontale des restaurants */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {restaurantsWithPhotos.slice(0, 3).map((restaurant, index) => (
                  <div key={index} className="cursor-pointer group" onClick={() => handleRestaurantClick(restaurant)}>
                    <div className="flex bg-white rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
                      <div className="flex-1 p-4">
                        {restaurant.isNew && (
                          <div className="inline-block bg-red-500 text-white text-xs font-bold px-2 py-1 rounded mb-2 uppercase">
                            NOUVEAU
                          </div>
                        )}
                        <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                          {restaurant.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-1">{restaurant.city}</p>
                        <p className="text-gray-500 text-sm">{restaurant.priceRange}</p>
                      </div>
                      <div className="w-24 h-24 flex-shrink-0">
                        <img
                          src={restaurant.photoUrl || "/placeholder.svg"}
                          alt={restaurant.name}
                          className="w-full h-full object-cover"
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
        </>
      ) : (
        /* Mode plein écran */
        <div className="fixed inset-0 z-50 bg-white">
          <div
            ref={mapRef}
            className="w-full h-full"
            style={{
              width: "100vw",
              height: "100vh",
              position: "relative",
            }}
          />

          {/* Bouton pour revenir avec texte */}
          <button
            onClick={toggleFullscreen}
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white hover:bg-gray-50 border border-gray-300 rounded-full px-6 py-3 flex items-center gap-2 shadow-lg transition-colors z-10"
            title="Revenir à la liste"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Revenir à la liste</span>
          </button>
        </div>
      )}
    </div>
  )
}

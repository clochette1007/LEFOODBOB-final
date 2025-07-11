"use client"

import { useState, useRef, useEffect } from 'react'
import { Loader } from "@googlemaps/js-api-loader"
import { Search } from "lucide-react"
import { useRouter } from 'next/navigation'
import { 
  restaurants, 
  createSlug, 
  getDistinctionIcon, 
  getDistinctionText, 
  getBadgeColor, 
  type Restaurant 
} from '@/lib/restaurants'

declare global {
  interface Window {
    google: any
  }
}

interface RestaurantWithPhoto extends Restaurant {
  photoUrl: string
  marker?: any
}

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
  const router = useRouter()
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [restaurantsWithPhotos, setRestaurantsWithPhotos] = useState<RestaurantWithPhoto[]>([])
  const [infoWindow, setInfoWindow] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null)
  const [locationTitle, setLocationTitle] = useState("Paris")
  const [isMapInitialized, setIsMapInitialized] = useState(false)

  // Fonction pour naviguer vers la page du restaurant  
  const navigateToRestaurant = (restaurantName: string) => {
    let url = ""
    switch(restaurantName) {
      case "Aldéhyde":
        url = "/aldehyde"
        break
      case "L'Arpège":
        url = "/l-arpege"
        break
      case "Alléno Paris":
        url = "/alleno-paris"
        break
      case "Allard":
        url = "/allard"
        break
      case "L'Ami Jean":
        url = "/l-ami-jean"
        break
      case "Au Bourguignon du Marais":
        url = "/au-bourguignon-du-marais"
        break
      default:
        return
    }
    window.location.href = url
  }

  // Fonction pour afficher les distinctions d'un restaurant (pour React/JSX)
  const renderDistinctionIconJSX = (distinction: string) => {
    switch(distinction) {
      case "michelin-1":
        return <span>⭐</span>
      case "michelin-2":
        return <span>⭐⭐</span>
      case "michelin-3":
        return <span>⭐⭐⭐</span>
      case "michelin-bib":
        return <span>😋</span>
      case "michelin-assiette":
        return <span>🍽️</span>
      case "50best":
        return <span>⚫</span>
      case "gaultmillau-1":
        return <span>★</span>
      case "gaultmillau-2":
        return <span>★★</span>
      case "gaultmillau-3":
        return <span>★★★</span>
      case "gaultmillau-4":
        return <span>★★★★</span>
      case "gaultmillau-5":
        return <span>★★★★★</span>
      default:
        return null
    }
  }

  // Fonction pour afficher les distinctions d'un restaurant
  const renderDistinctions = (distinctions: string[]) => {
    return distinctions.map((distinction, index) => (
      <span key={index} className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full mr-1 ${getBadgeColor(distinction)}`}>
        {renderDistinctionIconJSX(distinction)} {getDistinctionText(distinction)}
      </span>
    ))
  }



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
          
          // Si la carte est déjà initialisée, recentrer sur l'utilisateur
          if (map) {
            map.setCenter(location)
            
            // Ajouter un marqueur bleu pour la position de l'utilisateur
            const { AdvancedMarkerElement, PinElement } = window.google.maps.marker
            const userPin = new PinElement({
              background: "#3b82f6",
              borderColor: "#1d4ed8",
              glyphColor: "white",
            })

            new AdvancedMarkerElement({
              map: map,
              position: location,
              title: "Votre position",
              content: userPin.element,
            })
          }
        },
        (error) => {
          console.log("Géolocalisation refusée ou erreur:", error)
          // Rester sur Paris (déjà défini par défaut)
          setLocationTitle("Paris")
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // Cache 5 minutes
        }
      )
    } else {
      // Navigateur ne supporte pas la géolocalisation - rester sur Paris
      setLocationTitle("Paris")
    }
  }, [map])

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

      // Toujours commencer par Paris
      const mapInstance = new Map(mapRef.current as HTMLDivElement, {
        center: { lat: 48.8566, lng: 2.3522 },
        zoom: 13,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        styles: mapStyles,
        mapId: "DEMO_MAP_ID", // Requis pour AdvancedMarkerElement
      })
      setMap(mapInstance)
      setIsMapInitialized(true)

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
              
              // Ajouter l'écouteur de clic sur l'InfoWindow après un court délai
              setTimeout(() => {
                const infoWindowElement = document.getElementById(`restaurant-info-${restaurant.name.replace(/[^a-zA-Z0-9]/g, '')}`)
                if (infoWindowElement) {
                  infoWindowElement.addEventListener('click', () => {
                    navigateToRestaurant(restaurant.name)
                  })
                  infoWindowElement.style.cursor = 'pointer'
                }
              }, 100)
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

    if (mapRef.current && !isMapInitialized) {
      initMap()
    }
  }, [])

  const createInfoWindowContent = (restaurant: RestaurantWithPhoto) => {
    const distinctionsHtml = restaurant.distinctions.map(distinction => {
      let bgColor = "#f3f4f6" // gris par défaut
      let textColor = "#374151"
      
      if (distinction.startsWith('michelin-')) {
        bgColor = "#fecaca" // rouge pastel
        textColor = "#991b1b"
      } else if (distinction.startsWith('gaultmillau-')) {
        bgColor = "#fef3c7" // jaune
        textColor = "#92400e"
      } else if (distinction === '50best') {
        bgColor = "#e9d5ff" // violet
        textColor = "#581c87"
      }
      
      return `<span style="display: inline-flex; align-items: center; gap: 4px; font-size: 10px; background-color: ${bgColor}; color: ${textColor}; padding: 2px 6px; border-radius: 12px; margin-right: 4px;">
        ${getDistinctionIcon(distinction)} ${getDistinctionText(distinction)}
      </span>`
    }).join('')

    const restaurantId = restaurant.name.replace(/[^a-zA-Z0-9]/g, '')

    return `
    <div id="restaurant-info-${restaurantId}" style="width: 320px; padding: 16px; background-color: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); display: flex; align-items: center; gap: 16px; cursor: pointer; transition: all 0.2s ease;" 
         onmouseover="this.style.backgroundColor='#f9fafb'; this.style.transform='scale(1.02)'" 
         onmouseout="this.style.backgroundColor='white'; this.style.transform='scale(1)'">
      <div style="flex: 1;">
        <h3 style="font-size: 20px; font-weight: bold; color: #1f2937; margin: 0 0 4px 0;">${restaurant.name}</h3>
        <p style="font-size: 14px; color: #2563eb; margin: 0 0 4px 0;">📍 ${restaurant.address}</p>
        <p style="font-size: 14px; color: #6b7280; margin: 0 0 8px 0;">${restaurant.priceRange} • Cuisine gastronomique</p>
        <div style="margin-top: 8px;">${distinctionsHtml}</div>
        <p style="font-size: 12px; color: #9ca3af; margin-top: 8px; font-style: italic;">Cliquez pour voir la fiche détaillée</p>
      </div>
      <div style="width: 80px; height: 80px; border-radius: 12px; overflow: hidden; flex-shrink: 0;">
        <img src="${restaurant.photoUrl}" alt="${restaurant.name}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.onerror=null;this.src='https://placehold.co/80x80/cccccc/333333?text=Image';">
      </div>
    </div>
  `
  }

  const handleRestaurantClick = (restaurant: RestaurantWithPhoto) => {
    navigateToRestaurant(restaurant.name)
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
          </div>

          {/* Carte simple */}
          <div className="relative w-full h-96 rounded-lg overflow-hidden border border-gray-200 mb-6">
            <div ref={mapRef} className="w-full h-full" />
          </div>
        </div>

        {/* Section Liste */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Liste</h2>
            <button 
              onClick={() => router.push('/restaurants')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tout voir
            </button>
          </div>

          <div className="grid gap-4">
            {restaurantsWithPhotos.slice(0, 2).map((restaurant, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigateToRestaurant(restaurant.name)}
              >
                <div className="flex gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{restaurant.name}</h3>
                    <p className="text-gray-600 text-sm mb-1">{restaurant.city}</p>
                    <p className="text-gray-600 text-sm mb-2">{restaurant.priceRange} • Cuisine gastronomique</p>
                    <div className="flex flex-wrap gap-1">
                      {renderDistinctions(restaurant.distinctions)}
                    </div>
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

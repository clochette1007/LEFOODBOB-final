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
import SearchAutocomplete from './search-autocomplete'
import RestaurantThumbnail from './restaurant-thumbnail'

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
  const [filteredRestaurants, setFilteredRestaurants] = useState<RestaurantWithPhoto[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null)
  const [locationTitle, setLocationTitle] = useState("Paris")
  const [photosLoaded, setPhotosLoaded] = useState(false)
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
        return <img src="/etoile-michelin.webp" alt="Michelin 1 étoile" className="w-5 h-5 object-contain" />
      case "michelin-2":
        return (
          <div className="flex gap-0.5">
            <img src="/etoile-michelin.webp" alt="Michelin 1 étoile" className="w-5 h-5 object-contain" />
            <img src="/etoile-michelin.webp" alt="Michelin 2 étoile" className="w-5 h-5 object-contain" />
          </div>
        )
      case "michelin-3":
        return (
          <div className="flex gap-0.5">
            <img src="/etoile-michelin.webp" alt="Michelin 1 étoile" className="w-5 h-5 object-contain" />
            <img src="/etoile-michelin.webp" alt="Michelin 2 étoile" className="w-5 h-5 object-contain" />
            <img src="/etoile-michelin.webp" alt="Michelin 3 étoile" className="w-5 h-5 object-contain" />
          </div>
        )
      case "michelin-bib":
        return <img src="/bibgourmand.jpg" alt="Bib Gourmand" className="w-5 h-5 object-contain" />
      case "michelin-assiette":
        return <img src="/assiettemichelin.jpg" alt="Assiette Michelin" className="w-5 h-5 object-contain" />
      case "50best":
        return <img src="/50bestrestaurants.webp" alt="50 Best Restaurants" className="w-5 h-5 object-contain" />
      case "gaultmillau-1":
        return <img src="/1toque.png" alt="1 toque Gault&Millau" className="w-5 h-5 object-contain" />
      case "gaultmillau-2":
        return <img src="/2toques.jpg" alt="2 toques Gault&Millau" className="w-5 h-5 object-contain" />
      case "gaultmillau-3":
        return <img src="/3toques.jpg" alt="3 toques Gault&Millau" className="w-5 h-5 object-contain" />
      case "gaultmillau-4":
        return <img src="/4toques.png" alt="4 toques Gault&Millau" className="w-5 h-5 object-contain" />
      case "gaultmillau-5":
        return <img src="/5toques.png" alt="5 toques Gault&Millau" className="w-5 h-5 object-contain" />
      default:
        return null
    }
  }

  // Fonction pour afficher les distinctions d'un restaurant (sans couleur ni texte)
  const renderDistinctions = (distinctions: string[]) => {
    return distinctions.map((distinction, index) => (
      <span key={index} className="inline-flex items-center mr-1">
        {renderDistinctionIconJSX(distinction)}
      </span>
    ))
  }



  // Charger les images Google Places au démarrage
  useEffect(() => {
    const loadGooglePlacesPhotos = async () => {
      if (!window.google || photosLoaded) return

      const restaurantsWithGooglePhotos = await Promise.all(
        restaurants.map(async (restaurant) => {
          return new Promise<RestaurantWithPhoto>((resolve) => {
            const placesService = new window.google.maps.places.PlacesService(document.createElement('div'))
            placesService.findPlaceFromQuery(
              {
                query: restaurant.query,
                fields: ["photos"],
              },
              (results: any, status: any) => {
                let photoUrl = restaurant.photoUrl || "https://placehold.co/200x150/cccccc/333333?text=Image"
                
                if (status === window.google.maps.places.PlacesServiceStatus.OK && results && results[0]?.photos) {
                  photoUrl = results[0].photos[0].getUrl({
                    maxWidth: 400,
                    maxHeight: 300,
                  })
                }
                
                resolve({
                  ...restaurant,
                  photoUrl
                })
              }
            )
          })
        })
      )

      setRestaurantsWithPhotos(restaurantsWithGooglePhotos)
      setPhotosLoaded(true)
    }

    loadGooglePlacesPhotos()
  }, [photosLoaded])

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
            
            // Ajouter un marqueur personnalisé pour la position de l'utilisateur
            const { AdvancedMarkerElement } = window.google.maps.marker
            const userMarkerElement = document.createElement('img')
            userMarkerElement.src = '/bobrepere.png'
            userMarkerElement.style.width = '35px'        // Légèrement plus petit pour l'utilisateur
            userMarkerElement.style.height = '35px'
            userMarkerElement.style.filter = 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3)) hue-rotate(220deg)'  // Teinté bleu pour différencier
            userMarkerElement.alt = "Votre position"

            new AdvancedMarkerElement({
              map: map,
              position: location,
              title: "Votre position",
              content: userMarkerElement,
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

            // Créer un marqueur personnalisé avec votre image bob_repere
            const markerElement = document.createElement('img')
            markerElement.src = '/bobrepere.png'
            markerElement.style.width = '40px'        // Taille du marqueur
            markerElement.style.height = '40px'
            markerElement.style.cursor = 'pointer'
            markerElement.style.userSelect = 'none'
            markerElement.style.pointerEvents = 'none'
            markerElement.style.filter = 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'  // Ombre portée
            markerElement.alt = restaurant.name

            const marker = new AdvancedMarkerElement({
              map: mapInstance,
              position: geoResult.geometry.location,
              title: restaurant.name,
              content: markerElement,
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
      
      return `<span style="display: inline-flex; align-items: center; gap: 3px; font-size: 10px; background-color: ${bgColor}; color: ${textColor}; padding: 2px 5px; border-radius: 8px; margin-right: 3px; margin-bottom: 2px;">
        ${getDistinctionIcon(distinction)} ${getDistinctionText(distinction)}
      </span>`
    }).join('')

    const restaurantId = restaurant.name.replace(/[^a-zA-Z0-9]/g, '')

    // Responsive width based on screen size
    const isMobile = window.innerWidth <= 768
    const containerWidth = isMobile ? Math.min(280, window.innerWidth - 40) : 300
    const imageSize = isMobile ? 60 : 70
    
    return `
    <div id="restaurant-info-${restaurantId}" style="
      width: ${containerWidth}px; 
      max-width: 95vw;
      padding: 12px; 
      background-color: white; 
      border-radius: 12px; 
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); 
      display: flex; 
      align-items: center; 
      gap: 12px; 
      cursor: pointer; 
      transition: all 0.2s ease;
      box-sizing: border-box;
    " 
         onmouseover="this.style.backgroundColor='#f9fafb'; this.style.transform='scale(1.02)'" 
         onmouseout="this.style.backgroundColor='white'; this.style.transform='scale(1)'">
      <div style="flex: 1; min-width: 0;">
        <h3 style="font-size: ${isMobile ? '16px' : '18px'}; font-weight: bold; color: #1f2937; margin: 0 0 6px 0; line-height: 1.2;">${restaurant.name}</h3>
        <p style="font-size: ${isMobile ? '12px' : '13px'}; color: #6b7280; margin: 0 0 8px 0; line-height: 1.2;">${restaurant.priceRange} • Cuisine gastronomique</p>
        <div style="display: flex; flex-wrap: wrap; gap: 2px;">${distinctionsHtml}</div>
      </div>
      <div style="width: ${imageSize}px; height: ${imageSize}px; border-radius: 8px; overflow: hidden; flex-shrink: 0;">
        <img src="${restaurant.photoUrl}" alt="${restaurant.name}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.onerror=null;this.src='https://placehold.co/${imageSize}x${imageSize}/cccccc/333333?text=Image';">
      </div>
    </div>
  `
  }

  // Gérer les changements de recherche
  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    setHasSearched(query.length > 0)
    
    if (query.length === 0) {
      setFilteredRestaurants([])
      return
    }
    
    const searchQuery = query.toLowerCase()
    const filtered = restaurantsWithPhotos.filter(restaurant => 
      restaurant.name.toLowerCase().includes(searchQuery) || 
      restaurant.city.toLowerCase().includes(searchQuery)
    )
    setFilteredRestaurants(filtered)
  }

  // Gérer la sélection d'un restaurant depuis l'autocomplete
  const handleRestaurantSelect = (restaurant: Restaurant) => {
    navigateToRestaurant(restaurant.name)
  }

  const handleRestaurantClick = (restaurant: RestaurantWithPhoto) => {
    navigateToRestaurant(restaurant.name)
  }

  return (
    <div className="bg-white min-h-screen">
          {/* Barre de recherche */}
          <div className="p-6 border-b border-gray-200">
            <div className="max-w-4xl mx-auto">
          <SearchAutocomplete 
            placeholder="Rechercher un restaurant ou une ville sur Lefoodbob"
            onSearchChange={handleSearchChange}
            onRestaurantSelect={handleRestaurantSelect}
          />
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
            <h2 className="text-2xl font-bold text-gray-900">
              {hasSearched ? `Résultats de recherche (${filteredRestaurants.length})` : 'Liste'}
            </h2>
            {!hasSearched && (
              <button 
                onClick={() => router.push('/restaurants')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Tout voir
              </button>
            )}
              </div>

          {hasSearched && filteredRestaurants.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">Aucun restaurant trouvé pour "{searchQuery}"</p>
                          </div>
                        )}

          <div className="grid gap-4">
            {(hasSearched ? filteredRestaurants : restaurantsWithPhotos.slice(0, 2)).map((restaurant, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigateToRestaurant(restaurant.name)}
              >
                <div className="flex gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{restaurant.name}</h3>
                        <p className="text-gray-600 text-sm mb-1">Paris - {restaurant.city.replace('arrondissement', 'arr.')}</p>
                    <p className="text-gray-600 text-sm mb-2">{restaurant.priceRange} • Cuisine gastronomique</p>
                    <div className="flex flex-wrap gap-1">
                      {renderDistinctions(restaurant.distinctions)}
                    </div>
                      </div>

                      <RestaurantThumbnail 
                        restaurant={restaurant} 
                        onClick={() => navigateToRestaurant(restaurant.name)}
                        size="medium"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>


    </div>
  )
}

"use client"

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ExternalLink, Phone, MapPin } from "lucide-react"
import { Loader } from "@googlemaps/js-api-loader"
import { restaurants, getDistinctionIcon, getDistinctionText, getBadgeColor } from '@/lib/restaurants'

declare global {
  interface Window {
    google: any
  }
}

export default function LArpegePage() {
  const router = useRouter()
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)

  // Données du restaurant
  const restaurant = restaurants.find(r => r.name === "L'Arpège")!

  // Fonction pour afficher les distinctions
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

  const renderDistinctions = (distinctions: string[]) => {
    return distinctions.map((distinction, index) => (
      <span key={index} className={`inline-flex items-center gap-1 text-sm px-3 py-1 rounded-full mr-2 mb-2 ${getBadgeColor(distinction)}`}>
        {renderDistinctionIconJSX(distinction)} {getDistinctionText(distinction)}
      </span>
    ))
  }

  // Initialiser Google Maps
  useEffect(() => {
    const initMap = async () => {
      if (!restaurant.lat || !restaurant.lng) return

      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_Maps_API_KEY || "AIzaSyCcfMwhQwKmsAnRYfQCtYKsWpB4EI3NIq4",
        version: "weekly",
        libraries: ["places", "marker"]
      })

      try {
        await loader.load()
        
        if (mapRef.current) {
          const mapInstance = new window.google.maps.Map(mapRef.current, {
            center: { lat: restaurant.lat, lng: restaurant.lng },
            zoom: 16,
            mapId: "DEMO_MAP_ID",
            styles: [
              { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
              { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
              { elementType: "labels.text.stroke", stylers: [{ color: "#f5f5f5" }] },
              { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
              { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
              { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
              { featureType: "poi", elementType: "geometry", stylers: [{ color: "#eeeeee" }] },
              { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#e8e8e8" }] },
              { featureType: "water", elementType: "geometry", stylers: [{ color: "#4fc3f7" }] },
              { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
              { featureType: "administrative", elementType: "geometry", stylers: [{ visibility: "off" }] },
              { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
              { featureType: "road", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
              { featureType: "transit", stylers: [{ visibility: "off" }] },
            ]
          })

          // Ajouter le marqueur du restaurant avec votre image personnalisée
          const { AdvancedMarkerElement, PinElement } = window.google.maps.marker
          const markerElement = document.createElement('img')
          markerElement.src = '/bob_repere.png'
          markerElement.style.width = '40px'
          markerElement.style.height = '40px'
          markerElement.style.filter = 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
          markerElement.alt = restaurant.name

          new AdvancedMarkerElement({
            map: mapInstance,
            position: { lat: restaurant.lat, lng: restaurant.lng },
            title: restaurant.name,
            content: markerElement,
          })

          setMap(mapInstance)
        }
      } catch (error) {
        console.error('Erreur lors du chargement de Google Maps:', error)
      }
    }

    initMap()
  }, [restaurant])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header avec bouton retour */}
        <div className="bg-white shadow-sm">
          <div className="px-6 py-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Retour
            </button>
          </div>
        </div>

        {/* Photo de couverture */}
        <div className="relative w-full h-80 bg-gray-200">
          <img
            src={restaurant.photoUrl}
            alt={restaurant.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
            }}
          />
        </div>

        <div className="bg-white px-6 py-8">
          {/* Distinctions */}
          <div className="mb-6">
            <div className="flex flex-wrap">
              {renderDistinctions(restaurant.distinctions)}
            </div>
          </div>

          {/* Titre */}
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{restaurant.name}</h1>
          
          {/* Adresse */}
          <div className="flex items-start gap-2 mb-4">
            <MapPin className="w-5 h-5 text-gray-500 mt-1 flex-shrink-0" />
            <div>
              <p className="text-lg text-gray-700">{restaurant.address}</p>
              <p className="text-gray-600">{restaurant.city}</p>
            </div>
          </div>

          {/* Tarifs */}
          <div className="mb-8">
            <p className="text-xl font-semibold text-gray-900 mb-1">Tarifs</p>
            <p className="text-2xl font-bold text-green-600">{restaurant.priceSymbol}</p>
          </div>

          {/* Google Maps */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Localisation</h2>
            <div className="w-full h-80 rounded-lg overflow-hidden border border-gray-200">
              <div ref={mapRef} className="w-full h-full" />
            </div>
          </div>

          {/* Bouton Site Internet */}
          {restaurant.website && (
            <div className="mb-6">
              <a
                href={restaurant.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
              >
                <ExternalLink className="w-5 h-5" />
                Site Internet
              </a>
            </div>
          )}

          {/* Téléphone */}
          {restaurant.phone && (
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center gap-3">
                <Phone className="w-6 h-6 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600 mb-1">Téléphone</p>
                  <a 
                    href={`tel:${restaurant.phone}`}
                    className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                  >
                    {restaurant.phone}
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 
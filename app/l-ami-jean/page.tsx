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

export default function LAmiJeanPage() {
  const router = useRouter()
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [tooltipVisible, setTooltipVisible] = useState<string | null>(null)

  const restaurant = restaurants.find(r => r.name === "L'Ami Jean")
  if (!restaurant) return <div>Restaurant non trouvé</div>

  // Fonction pour afficher les distinctions avec les vraies logos
  const renderDistinctionIconJSX = (distinction: string) => {
    switch(distinction) {
      case "michelin-1":
        return <img src="/etoile-michelin.webp" alt="Michelin 1 étoile" className="w-8 h-8 object-contain" />
      case "michelin-2":
        return (
          <div className="flex gap-0.5">
            <img src="/etoile-michelin.webp" alt="Michelin 1 étoile" className="w-8 h-8 object-contain" />
            <img src="/etoile-michelin.webp" alt="Michelin 2 étoile" className="w-8 h-8 object-contain" />
          </div>
        )
      case "michelin-3":
        return (
          <div className="flex gap-0.5">
            <img src="/etoile-michelin.webp" alt="Michelin 1 étoile" className="w-8 h-8 object-contain" />
            <img src="/etoile-michelin.webp" alt="Michelin 2 étoile" className="w-8 h-8 object-contain" />
            <img src="/etoile-michelin.webp" alt="Michelin 3 étoile" className="w-8 h-8 object-contain" />
          </div>
        )
      case "michelin-bib":
        return <img src="/bibgourmand.jpg" alt="Bib Gourmand" className="w-8 h-8 object-contain" />
      case "michelin-assiette":
        return <img src="/assiettemichelin.jpg" alt="Assiette Michelin" className="w-8 h-8 object-contain" />
      case "50best":
        return <img src="/50bestrestaurants.webp" alt="50 Best Restaurants" className="w-8 h-8 object-contain" />
      case "gaultmillau-1":
        return <img src="/1toque.png" alt="1 toque Gault&Millau" className="w-8 h-8 object-contain" />
      case "gaultmillau-2":
        return <img src="/2toques.jpg" alt="2 toques Gault&Millau" className="w-8 h-8 object-contain" />
      case "gaultmillau-3":
        return <img src="/3toques.jpg" alt="3 toques Gault&Millau" className="w-8 h-8 object-contain" />
      case "gaultmillau-4":
        return <img src="/4toques.png" alt="4 toques Gault&Millau" className="w-8 h-8 object-contain" />
      case "gaultmillau-5":
        return <img src="/5toques.png" alt="5 toques Gault&Millau" className="w-8 h-8 object-contain" />
      default:
        return null
    }
  }

  const renderDistinctions = (distinctions: string[]) => {
    return distinctions.map((distinction, index) => (
      <span key={index} className="inline-flex items-center mr-3 mb-2 relative">
        {renderDistinctionIconJSX(distinction)}
        <button
          onClick={() => setTooltipVisible(tooltipVisible === `${distinction}-${index}` ? null : `${distinction}-${index}`)}
          className="ml-1 w-4 h-4 bg-gray-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-gray-600 transition-colors"
        >
          i
        </button>
        {tooltipVisible === `${distinction}-${index}` && (
          <div className="absolute top-full left-0 mt-1 z-50 bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap">
            {getDistinctionText(distinction)}
            <div className="absolute -top-1 left-2 w-2 h-2 bg-black rotate-45"></div>
          </div>
        )}
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
          markerElement.src = '/bobrepere.png'
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
              target.src = "https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
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

          {/* Titre - Typographie corrigée */}
          <h1 className="text-xl font-bold text-gray-900 mb-2">{restaurant.name}</h1>
          
          {/* Adresse - Typographie corrigée */}
          <div className="flex items-start gap-2 mb-4">
            <MapPin className="w-5 h-5 text-gray-500 mt-1 flex-shrink-0" />
            <div>
              <p className="text-base text-gray-700">{restaurant.address}</p>
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

          {/* Site Internet simplifié */}
          {restaurant.website && (
            <div className="mb-6">
              <a
                href={restaurant.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg text-black underline hover:text-blue-600 transition-colors"
              >
                Site Internet
              </a>
            </div>
          )}

          {/* Téléphone simplifié */}
          {restaurant.phone && (
            <div>
              <a 
                href={`tel:${restaurant.phone}`}
                className="text-lg text-black underline hover:text-blue-600 transition-colors"
              >
                {restaurant.phone}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 
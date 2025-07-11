"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from "lucide-react"
import { 
  restaurants, 
  createSlug, 
  getDistinctionIcon, 
  getDistinctionText, 
  getBadgeColor, 
  type Restaurant 
} from '@/lib/restaurants'

interface RestaurantWithPhoto extends Restaurant {
  photoUrl: string
}

export default function RestaurantsPage() {
  const router = useRouter()
  const [restaurantsWithPhotos, setRestaurantsWithPhotos] = useState<RestaurantWithPhoto[]>([])
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [showMichelinDropdown, setShowMichelinDropdown] = useState(false)
  const [showGaultMillauDropdown, setShowGaultMillauDropdown] = useState(false)

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
    const handleClickOutside = (event: MouseEvent) => {
      if (showMichelinDropdown) {
        const target = event.target as HTMLElement
        const dropdownContainer = target.closest('[data-dropdown="michelin"]')
        if (!dropdownContainer) {
          setShowMichelinDropdown(false)
        }
      }
      if (showGaultMillauDropdown) {
        const target = event.target as HTMLElement
        const dropdownContainer = target.closest('[data-dropdown="gaultmillau"]')
        if (!dropdownContainer) {
          setShowGaultMillauDropdown(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMichelinDropdown, showGaultMillauDropdown])

  useEffect(() => {
    // Charger les restaurants avec leurs photos
    const loadRestaurants = async () => {
      const restaurantData = restaurants.map(restaurant => ({
        ...restaurant,
        photoUrl: restaurant.photoUrl || "https://placehold.co/400x300/cccccc/333333?text=Restaurant"
      }))
      setRestaurantsWithPhotos(restaurantData)
    }

    loadRestaurants()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header avec bouton retour */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Restaurants LEFOODBOB</h1>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700 mr-2">Filtrer par distinction :</span>
            
            {/* Menu déroulant Michelin */}
            <div className="relative" data-dropdown="michelin">
              <button
                onClick={() => setShowMichelinDropdown(!showMichelinDropdown)}
                className={`px-3 py-1 rounded-full text-xs border transition-colors flex items-center gap-1 ${
                  selectedFilters.some(f => f.startsWith('michelin-'))
                    ? "bg-blue-100 border-blue-300 text-blue-800"
                    : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
                }`}
              >
                🔴
                Michelin
                <span className="ml-1">▼</span>
              </button>
              
              {showMichelinDropdown && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 min-w-[180px]">
                  {[
                    { key: "michelin-1", label: "⭐" },
                    { key: "michelin-2", label: "⭐⭐" },
                    { key: "michelin-3", label: "⭐⭐⭐" },
                    { key: "michelin-bib", label: "😋 Bib Gourmand" },
                    { key: "michelin-assiette", label: "🍽️ Assiette" },
                  ].map((option) => (
                    <label key={option.key} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedFilters.includes(option.key)}
                        onChange={() => {
                          setSelectedFilters(prev => 
                            prev.includes(option.key) 
                              ? prev.filter(f => f !== option.key)
                              : [...prev, option.key]
                          )
                        }}
                        className="w-3 h-3"
                      />
                      <div className="flex items-center gap-1">
                        <span className="text-sm">{option.label}</span>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Menu déroulant Gault et Millau */}
            <div className="relative" data-dropdown="gaultmillau">
              <button
                onClick={() => setShowGaultMillauDropdown(!showGaultMillauDropdown)}
                className={`px-3 py-1 rounded-full text-xs border transition-colors flex items-center gap-1 ${
                  selectedFilters.some(f => f.startsWith('gaultmillau-'))
                    ? "bg-blue-100 border-blue-300 text-blue-800"
                    : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
                }`}
              >
                ⚪
                Gault et Millau
                <span className="ml-1">▼</span>
              </button>
              
              {showGaultMillauDropdown && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 min-w-[180px]">
                  {[
                    { key: "gaultmillau-1", label: "★ 1 toque" },
                    { key: "gaultmillau-2", label: "★★ 2 toques" },
                    { key: "gaultmillau-3", label: "★★★ 3 toques" },
                    { key: "gaultmillau-4", label: "★★★★ 4 toques" },
                    { key: "gaultmillau-5", label: "★★★★★ 5 toques" },
                  ].map((option) => (
                    <label key={option.key} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedFilters.includes(option.key)}
                        onChange={() => {
                          setSelectedFilters(prev => 
                            prev.includes(option.key) 
                              ? prev.filter(f => f !== option.key)
                              : [...prev, option.key]
                          )
                        }}
                        className="w-3 h-3"
                      />
                      <div className="flex items-center gap-1">
                        <span className="text-sm">{option.label}</span>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Autres filtres */}
            <button
              onClick={() => {
                setSelectedFilters(prev => 
                  prev.includes("50best") 
                    ? prev.filter(f => f !== "50best")
                    : [...prev, "50best"]
                )
              }}
              className={`px-3 py-1 rounded-full text-xs border transition-colors flex items-center gap-1 ${
                selectedFilters.includes("50best")
                  ? "bg-blue-100 border-blue-300 text-blue-800"
                  : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
              }`}
            >
              ⚫
              50 Best
            </button>

            {selectedFilters.length > 0 && (
              <button
                onClick={() => setSelectedFilters([])}
                className="px-3 py-1 rounded-full text-xs bg-red-100 border border-red-300 text-red-800 hover:bg-red-200"
              >
                Effacer filtres
              </button>
            )}
          </div>
        </div>

        {/* Liste des restaurants */}
        <div className="grid gap-6">
          {restaurantsWithPhotos
            .filter(restaurant => 
              selectedFilters.length === 0 || 
              restaurant.distinctions.some(d => selectedFilters.includes(d))
            )
            .map((restaurant, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigateToRestaurant(restaurant.name)}
              >
                <div className="flex gap-6">
                  <div className="flex-1">
                    <h3 className="font-bold text-xl text-gray-900 mb-2">{restaurant.name}</h3>
                    <p className="text-gray-600 text-base mb-1">{restaurant.city}</p>
                    <p className="text-gray-600 text-base mb-3">{restaurant.priceRange} • Cuisine gastronomique</p>
                    <div className="flex flex-wrap gap-1">
                      {renderDistinctions(restaurant.distinctions)}
                    </div>
                  </div>

                  <div className="w-32 h-32 flex-shrink-0">
                    <img
                      src={restaurant.photoUrl || "/placeholder.svg"}
                      alt={restaurant.name}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "https://placehold.co/128x128/cccccc/333333?text=Image"
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Message si aucun restaurant trouvé */}
        {restaurantsWithPhotos.filter(restaurant => 
          selectedFilters.length === 0 || 
          restaurant.distinctions.some(d => selectedFilters.includes(d))
        ).length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Aucun restaurant trouvé avec ces critères.</p>
          </div>
        )}
      </div>
    </div>
  )
} 
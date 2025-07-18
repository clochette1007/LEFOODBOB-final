"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, X, MapPin, Utensils } from "lucide-react"
import { restaurants, type Restaurant } from "@/lib/restaurants"

interface SearchAutocompleteProps {
  placeholder?: string
  onSearchChange?: (query: string) => void
  onRestaurantSelect?: (restaurant: Restaurant) => void
  className?: string
}

interface SearchSuggestion {
  type: "restaurant" | "city"
  label: string
  value: string
  restaurant?: Restaurant
  count?: number
}

export default function SearchAutocomplete({
  placeholder = "Rechercher un restaurant ou une ville...",
  onSearchChange,
  onRestaurantSelect,
  className = "",
}: SearchAutocompleteProps) {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Générer les suggestions basées sur la requête
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([])
      setIsOpen(false)
      return
    }

    const searchQuery = query.toLowerCase()
    const citySuggestions: SearchSuggestion[] = []
    const restaurantSuggestions: SearchSuggestion[] = []

    // Recherche par ville/arrondissement
    const cityCount: { [key: string]: number } = {}
    restaurants.forEach((restaurant) => {
      const city = restaurant.city
      cityCount[city] = (cityCount[city] || 0) + 1
    })

    Object.entries(cityCount).forEach(([city, count]) => {
      // Chercher dans le nom de la ville/arrondissement
      if (
        city.toLowerCase().includes(searchQuery) ||
        searchQuery.includes("paris") ||
        searchQuery.includes("pari") ||
        searchQuery.startsWith("par")
      ) {
        citySuggestions.push({
          type: "city",
          label: city.replace("arrondissement", "arr."),
          value: city,
          count,
        })
      }
    })

    // Recherche par nom de restaurant
    restaurants.forEach((restaurant) => {
      if (restaurant.name.toLowerCase().includes(searchQuery)) {
        restaurantSuggestions.push({
          type: "restaurant",
          label: restaurant.name,
          value: restaurant.name,
          restaurant,
        })
      }
    })

    // Combiner et limiter les suggestions (4 villes max + 6 restaurants max)
    const newSuggestions = [...citySuggestions.slice(0, 4), ...restaurantSuggestions.slice(0, 6)]

    setSuggestions(newSuggestions)
    setIsOpen(newSuggestions.length > 0)
    setSelectedIndex(-1)
  }, [query])

  // Gérer la navigation au clavier
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev))
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
        break
      case "Enter":
        e.preventDefault()
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex])
        } else {
          // Recherche directe si pas de suggestion sélectionnée
          onSearchChange?.(query)
          setIsOpen(false)
        }
        break
      case "Escape":
        setIsOpen(false)
        setSelectedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  // Gérer le clic sur une suggestion
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.label)
    setIsOpen(false)
    setSelectedIndex(-1)

    if (suggestion.type === "restaurant" && suggestion.restaurant) {
      onRestaurantSelect?.(suggestion.restaurant)
    } else {
      // Recherche par ville
      onSearchChange?.(suggestion.value)
    }
  }

  // Effacer la recherche
  const clearSearch = () => {
    setQuery("")
    setSuggestions([])
    setIsOpen(false)
    setSelectedIndex(-1)
    onSearchChange?.("")
    inputRef.current?.focus()
  }

  // Gérer les changements de texte
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value
    setQuery(newQuery)
    onSearchChange?.(newQuery)
  }

  // Gérer les clics à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className={`relative w-full ${className}`} ref={suggestionsRef}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && suggestions.length > 0 && setIsOpen(true)}
          className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto">
          {(() => {
            const citySuggestions = suggestions.filter((s) => s.type === "city")
            const restaurantSuggestions = suggestions.filter((s) => s.type === "restaurant")
            let currentIndex = 0

            return (
              <>
                {citySuggestions.length > 0 && (
                  <div>
                    <div className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 border-b border-gray-100">
                      QUARTIERS
                    </div>
                    {citySuggestions.map((suggestion, index) => {
                      const globalIndex = currentIndex++
                      return (
                        <div
                          key={`${suggestion.type}-${suggestion.value}`}
                          className={`px-4 py-3 cursor-pointer transition-colors border-b border-gray-50 last:border-b-0 ${
                            globalIndex === selectedIndex ? "bg-blue-50 text-blue-900" : "hover:bg-gray-50"
                          }`}
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full">
                              <MapPin className="w-4 h-4 text-gray-600" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{suggestion.label}</div>
                              <div className="text-sm text-gray-500">
                                Paris • {suggestion.count} restaurant{suggestion.count! > 1 ? "s" : ""}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                {restaurantSuggestions.length > 0 && (
                  <div>
                    <div className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 border-b border-gray-100">
                      RESTAURANTS
                    </div>
                    {restaurantSuggestions.map((suggestion, index) => {
                      const globalIndex = currentIndex++
                      return (
                        <div
                          key={`${suggestion.type}-${suggestion.value}`}
                          className={`px-4 py-3 cursor-pointer transition-colors border-b border-gray-50 last:border-b-0 ${
                            globalIndex === selectedIndex ? "bg-blue-50 text-blue-900" : "hover:bg-gray-50"
                          }`}
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 flex items-center justify-center bg-red-100 rounded-full">
                              <Utensils className="w-4 h-4 text-red-600" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{suggestion.label}</div>
                              <div className="text-sm text-gray-500">
                                {suggestion.restaurant?.city.replace("arrondissement", "arr.")} •{" "}
                                {suggestion.restaurant?.priceRange}
                              </div>
                            </div>
                            {suggestion.restaurant?.distinctions && suggestion.restaurant.distinctions.length > 0 && (
                              <div className="flex items-center gap-1">
                                {suggestion.restaurant.distinctions.slice(0, 2).map((distinction, idx) => (
                                  <div key={idx} className="w-5 h-5">
                                    {distinction.includes("michelin") && (
                                      <img
                                        src="/etoile-michelin.webp"
                                        alt="Michelin"
                                        className="w-full h-full object-contain"
                                      />
                                    )}
                                    {distinction.includes("gaultmillau") && (
                                      <img
                                        src="/1toque.png"
                                        alt="Gault&Millau"
                                        className="w-full h-full object-contain"
                                      />
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </>
            )
          })()}
        </div>
      )}
    </div>
  )
}

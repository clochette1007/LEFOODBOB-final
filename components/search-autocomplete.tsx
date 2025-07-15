"use client"

import { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import { restaurants, createSlug, type Restaurant } from '@/lib/restaurants'

interface SearchAutocompleteProps {
  placeholder?: string
  onSearchChange?: (query: string) => void
  onRestaurantSelect?: (restaurant: Restaurant) => void
  className?: string
}

interface SearchSuggestion {
  type: 'restaurant' | 'city'
  label: string
  value: string
  restaurant?: Restaurant
}

export default function SearchAutocomplete({ 
  placeholder = "Rechercher un restaurant ou une ville...",
  onSearchChange,
  onRestaurantSelect,
  className = ""
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
    const uniqueCities = [...new Set(restaurants.map(r => r.city))]
    uniqueCities.forEach(city => {
      if (city.toLowerCase().includes(searchQuery)) {
        citySuggestions.push({
          type: 'city',
          label: city,
          value: city
        })
      }
    })

    // Recherche par nom de restaurant
    restaurants.forEach(restaurant => {
      if (restaurant.name.toLowerCase().includes(searchQuery)) {
        restaurantSuggestions.push({
          type: 'restaurant',
          label: restaurant.name,
          value: restaurant.name,
          restaurant
        })
      }
    })

    // Combiner et limiter les suggestions (4 villes max + 4 restaurants max)
    const newSuggestions = [
      ...citySuggestions.slice(0, 4),
      ...restaurantSuggestions.slice(0, 4)
    ]

    setSuggestions(newSuggestions)
    setIsOpen(newSuggestions.length > 0)
    setSelectedIndex(-1)
  }, [query])

  // Gérer la navigation au clavier
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex])
        }
        break
      case 'Escape':
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
    
    if (suggestion.type === 'restaurant' && suggestion.restaurant) {
      onRestaurantSelect?.(suggestion.restaurant)
    }
    
    onSearchChange?.(suggestion.value)
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

  // Gérer les clics à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
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
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && suggestions.length > 0 && setIsOpen(true)}
          className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          {(() => {
            const citySuggestions = suggestions.filter(s => s.type === 'city')
            const restaurantSuggestions = suggestions.filter(s => s.type === 'restaurant')
            let currentIndex = 0

            return (
              <>
                {citySuggestions.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 border-b border-gray-200">
                      LIEUX
                    </div>
                    {citySuggestions.map((suggestion, index) => {
                      const globalIndex = currentIndex++
                      return (
                        <div
                          key={`${suggestion.type}-${suggestion.value}`}
                          className={`px-4 py-3 cursor-pointer transition-colors ${
                            globalIndex === selectedIndex 
                              ? 'bg-blue-50 text-blue-900' 
                              : 'hover:bg-gray-50'
                          }`}
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 flex items-center justify-center">
                              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{suggestion.label}</div>
                              <div className="text-sm text-gray-500">Paris, France</div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                {restaurantSuggestions.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 border-b border-gray-200">
                      RESTAURANTS
                    </div>
                    {restaurantSuggestions.map((suggestion, index) => {
                      const globalIndex = currentIndex++
                      return (
                        <div
                          key={`${suggestion.type}-${suggestion.value}`}
                          className={`px-4 py-3 cursor-pointer transition-colors ${
                            globalIndex === selectedIndex 
                              ? 'bg-blue-50 text-blue-900' 
                              : 'hover:bg-gray-50'
                          }`}
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 flex items-center justify-center">
                              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{suggestion.label}</div>
                              <div className="text-sm text-gray-500">
                                {suggestion.restaurant?.city} • {suggestion.restaurant?.priceRange}
                              </div>
                            </div>
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
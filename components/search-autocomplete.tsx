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
    const newSuggestions: SearchSuggestion[] = []

    // Recherche par nom de restaurant
    restaurants.forEach(restaurant => {
      if (restaurant.name.toLowerCase().includes(searchQuery)) {
        newSuggestions.push({
          type: 'restaurant',
          label: restaurant.name,
          value: restaurant.name,
          restaurant
        })
      }
    })

    // Recherche par ville/arrondissement
    const uniqueCities = [...new Set(restaurants.map(r => r.city))]
    
    // Si on tape "Paris", montrer tous les arrondissements disponibles
    if (searchQuery === 'paris' || searchQuery === 'par') {
      uniqueCities.forEach(city => {
        newSuggestions.push({
          type: 'city',
          label: `Paris - ${city.replace('arrondissement', 'arr.')}`,
          value: city
        })
      })
    } else {
      // Recherche normale dans les noms de villes
      uniqueCities.forEach(city => {
        if (city.toLowerCase().includes(searchQuery) || 
            `paris - ${city.replace('arrondissement', 'arr.')}`.toLowerCase().includes(searchQuery)) {
          newSuggestions.push({
            type: 'city',
            label: `Paris - ${city.replace('arrondissement', 'arr.')}`,
            value: city
          })
        }
      })
    }

    // Limiter à 8 suggestions maximum
    setSuggestions(newSuggestions.slice(0, 8))
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
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={`${suggestion.type}-${suggestion.value}`}
              className={`px-4 py-3 cursor-pointer transition-colors ${
                index === selectedIndex 
                  ? 'bg-blue-50 text-blue-900' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="flex items-center gap-3">
                {suggestion.type === 'restaurant' ? (
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium text-sm">R</span>
                  </div>
                ) : (
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 font-medium text-sm">V</span>
                  </div>
                )}
                <div>
                  <div className="font-medium text-gray-900">{suggestion.label}</div>
                  <div className="text-sm text-gray-500">
                                       {suggestion.type === 'restaurant' ? 'Restaurant' : 'Ville'}
                     {suggestion.restaurant && ` • Paris - ${suggestion.restaurant.city.replace('arrondissement', 'arr.')}`}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 
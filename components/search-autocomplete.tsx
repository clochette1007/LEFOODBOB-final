"use client"

import { useState, useRef, useEffect } from "react"
import { Search, X } from "lucide-react"
import { searchRestaurants, type Restaurant } from "@/lib/restaurants"

interface SearchAutocompleteProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  onRestaurantSelect?: (restaurant: Restaurant) => void
}

export default function SearchAutocomplete({
  value,
  onChange,
  placeholder = "Rechercher...",
  onRestaurantSelect,
}: SearchAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<Restaurant[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (value.trim()) {
      const results = searchRestaurants(value).slice(0, 5)
      setSuggestions(results)
      setIsOpen(results.length > 0)
    } else {
      setSuggestions([])
      setIsOpen(false)
    }
  }, [value])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSuggestionClick = (restaurant: Restaurant) => {
    onChange(restaurant.name)
    setIsOpen(false)
    if (onRestaurantSelect) {
      onRestaurantSelect(restaurant)
    }
  }

  const handleClear = () => {
    onChange("")
    inputRef.current?.focus()
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => value.trim() && suggestions.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 lg:py-4 bg-gray-100 border-0 rounded-lg text-sm lg:text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
        />
        {value && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="h-4 w-4 text-gray-400" />
          </button>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {suggestions.map((restaurant) => (
            <button
              key={restaurant.id}
              onClick={() => handleSuggestionClick(restaurant)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
            >
              <div className="font-medium text-gray-900 text-sm lg:text-base">{restaurant.name}</div>
              {restaurant.cuisine && <div className="text-sm text-blue-600 mt-1">{restaurant.cuisine}</div>}
              <div className="text-xs text-gray-500 mt-1 truncate">{restaurant.address}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

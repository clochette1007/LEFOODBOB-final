"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, MapPin, Utensils, Star } from "lucide-react"
import { getAutocompleteSuggestions, searchRestaurants, type Restaurant } from "@/lib/restaurants"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchAutocompleteProps {
  onSearch: (restaurants: Restaurant[]) => void
  onQueryChange?: (query: string) => void
  placeholder?: string
  className?: string
}

export default function SearchAutocomplete({
  onSearch,
  onQueryChange,
  placeholder = "Rechercher un restaurant ou une ville...",
  className = "",
}: SearchAutocompleteProps) {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<
    Array<{ type: "restaurant" | "city" | "cuisine"; value: string; count?: number }>
  >([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Mettre à jour les suggestions quand la query change
  useEffect(() => {
    if (query.trim().length > 0) {
      const newSuggestions = getAutocompleteSuggestions(query)
      setSuggestions(newSuggestions)
      setShowSuggestions(newSuggestions.length > 0)
      setSelectedIndex(-1)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
      setSelectedIndex(-1)
    }
  }, [query])

  // Notifier le parent du changement de query
  useEffect(() => {
    onQueryChange?.(query)
  }, [query, onQueryChange])

  // Gérer la recherche
  const handleSearch = (searchQuery: string = query) => {
    const results = searchRestaurants(searchQuery)
    onSearch(results)
    setShowSuggestions(false)
    setSelectedIndex(-1)
  }

  // Gérer la sélection d'une suggestion
  const handleSuggestionSelect = (suggestion: { type: string; value: string }) => {
    setQuery(suggestion.value)
    handleSearch(suggestion.value)
    inputRef.current?.blur()
  }

  // Gérer les touches du clavier
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === "Enter") {
        handleSearch()
      }
      return
    }

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
          handleSuggestionSelect(suggestions[selectedIndex])
        } else {
          handleSearch()
        }
        break
      case "Escape":
        setShowSuggestions(false)
        setSelectedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  // Gérer le clic en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Icône selon le type de suggestion
  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case "restaurant":
        return <Utensils className="w-4 h-4 text-gray-400" />
      case "city":
        return <MapPin className="w-4 h-4 text-gray-400" />
      case "cuisine":
        return <Star className="w-4 h-4 text-gray-400" />
      default:
        return <Search className="w-4 h-4 text-gray-400" />
    }
  }

  // Label selon le type de suggestion
  const getSuggestionLabel = (type: string) => {
    switch (type) {
      case "restaurant":
        return "Restaurant"
      case "city":
        return "Arrondissement"
      case "cuisine":
        return "Cuisine"
      default:
        return ""
    }
  }

  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestions(true)
            }
          }}
          className="pl-10 pr-20 h-12 text-base border-2 border-gray-200 focus:border-red-500 focus:ring-red-500 rounded-xl"
        />
        <Button
          onClick={() => handleSearch()}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg"
          size="sm"
        >
          Rechercher
        </Button>
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={`${suggestion.type}-${suggestion.value}`}
              onClick={() => handleSuggestionSelect(suggestion)}
              className={`w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 last:border-b-0 transition-colors ${
                index === selectedIndex ? "bg-red-50 border-red-100" : ""
              }`}
            >
              {getSuggestionIcon(suggestion.type)}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 truncate">{suggestion.value}</div>
                <div className="text-sm text-gray-500 flex items-center gap-2">
                  <span>{getSuggestionLabel(suggestion.type)}</span>
                  {suggestion.count && (
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                      {suggestion.count} restaurant{suggestion.count > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

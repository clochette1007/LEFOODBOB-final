"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, MapPin, ChefHat, Building } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { getAutocompleteSuggestions, searchRestaurants, type Restaurant } from "@/lib/restaurants"

interface SearchAutocompleteProps {
  onSearch: (restaurants: Restaurant[]) => void
  placeholder?: string
}

export default function SearchAutocomplete({
  onSearch,
  placeholder = "Rechercher un restaurant...",
}: SearchAutocompleteProps) {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<
    Array<{ type: "restaurant" | "city" | "cuisine"; value: string; count?: number }>
  >([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionRefs = useRef<(HTMLButtonElement | null)[]>([])

  // Générer les suggestions basées sur la requête
  useEffect(() => {
    if (query.trim()) {
      const newSuggestions = getAutocompleteSuggestions(query)
      setSuggestions(newSuggestions)
      setIsOpen(newSuggestions.length > 0)
      setSelectedIndex(-1)
    } else {
      setSuggestions([])
      setIsOpen(false)
      setSelectedIndex(-1)
    }
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
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev))
        break
      case "Enter":
        e.preventDefault()
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex])
        } else {
          handleSearch()
        }
        break
      case "Escape":
        setIsOpen(false)
        setSelectedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  // Faire défiler vers la suggestion sélectionnée
  useEffect(() => {
    if (selectedIndex >= 0 && suggestionRefs.current[selectedIndex]) {
      suggestionRefs.current[selectedIndex]?.scrollIntoView({
        block: "nearest",
      })
    }
  }, [selectedIndex])

  // Gérer la sélection d'une suggestion
  const handleSuggestionClick = (suggestion: { type: string; value: string; count?: number }) => {
    setQuery(suggestion.value)
    setIsOpen(false)
    setSelectedIndex(-1)

    // Effectuer la recherche basée sur le type de suggestion
    const results = searchRestaurants(suggestion.value)
    onSearch(results)
  }

  // Gérer la recherche manuelle
  const handleSearch = () => {
    if (query.trim()) {
      const results = searchRestaurants(query)
      onSearch(results)
      setIsOpen(false)
    }
  }

  // Gérer la soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch()
  }

  // Icône basée sur le type de suggestion
  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case "restaurant":
        return <ChefHat className="h-4 w-4 text-gray-400" />
      case "city":
        return <Building className="h-4 w-4 text-gray-400" />
      case "cuisine":
        return <MapPin className="h-4 w-4 text-gray-400" />
      default:
        return <Search className="h-4 w-4 text-gray-400" />
    }
  }

  // Texte descriptif basé sur le type
  const getSuggestionDescription = (type: string, count?: number) => {
    switch (type) {
      case "restaurant":
        return "Restaurant"
      case "city":
        return count ? `${count} restaurant${count > 1 ? "s" : ""}` : "Arrondissement"
      case "cuisine":
        return count ? `${count} restaurant${count > 1 ? "s" : ""}` : "Type de cuisine"
      default:
        return ""
    }
  }

  return (
    <div className="relative w-full max-w-md">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => suggestions.length > 0 && setIsOpen(true)}
            className="pl-10 pr-20"
          />
          <Button type="submit" size="sm" className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8">
            Rechercher
          </Button>
        </div>
      </form>

      {/* Suggestions dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={`${suggestion.type}-${suggestion.value}`}
              ref={(el) => (suggestionRefs.current[index] = el)}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 last:border-b-0 ${
                index === selectedIndex ? "bg-blue-50 border-blue-200" : ""
              }`}
            >
              {getSuggestionIcon(suggestion.type)}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 truncate">{suggestion.value}</div>
                <div className="text-sm text-gray-500">
                  {getSuggestionDescription(suggestion.type, suggestion.count)}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Overlay pour fermer les suggestions */}
      {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
    </div>
  )
}

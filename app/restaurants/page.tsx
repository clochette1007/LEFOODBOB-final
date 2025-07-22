"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { restaurants, searchRestaurants, type Restaurant } from "@/lib/restaurants"
import RestaurantCard from "@/components/restaurant-card"
import SearchAutocomplete from "@/components/search-autocomplete"
import MobileNav from "@/components/mobile-nav"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function RestaurantsPage() {
  const searchParams = useSearchParams()
  const category = searchParams.get("category")
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>(restaurants)

  useEffect(() => {
    let filtered = restaurants

    // Filtrer par catégorie si spécifiée
    if (category) {
      switch (category) {
        case "streetfood":
          filtered = restaurants.filter(
            (r) =>
              r.cuisine?.toLowerCase().includes("street") ||
              r.cuisine?.toLowerCase().includes("barbecue") ||
              r.priceRange === "€" ||
              r.priceRange === "€€",
          )
          break
        case "gastronomique":
          filtered = restaurants.filter(
            (r) => r.distinction === "michelin_3" || r.distinction === "michelin_2" || r.priceRange === "€€€€",
          )
          break
        case "bistrots":
          filtered = restaurants.filter(
            (r) =>
              r.cuisine?.toLowerCase().includes("bistrot") ||
              r.distinction === "bib_gourmand" ||
              r.distinction === "assiette_michelin",
          )
          break
        case "nouveautes":
          filtered = restaurants.filter((r) => r.distinction === "bob_repere" || r.distinction === "bob_flop")
          break
      }
    }

    // Appliquer la recherche si présente
    if (searchQuery.trim()) {
      filtered = searchRestaurants(searchQuery).filter((r) => !category || filtered.some((f) => f.id === r.id))
    }

    setFilteredRestaurants(filtered)
  }, [category, searchQuery])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const getCategoryTitle = () => {
    switch (category) {
      case "streetfood":
        return "Street Food"
      case "gastronomique":
        return "Gastronomique"
      case "bistrots":
        return "Bistrots"
      case "nouveautes":
        return "Nouveautés"
      default:
        return "Tous les restaurants"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">{getCategoryTitle()}</h1>
          </div>
          <SearchAutocomplete onSearch={handleSearch} />
        </div>
      </div>

      <div className="p-4">
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            {filteredRestaurants.length} restaurant{filteredRestaurants.length > 1 ? "s" : ""} trouvé
            {filteredRestaurants.length > 1 ? "s" : ""}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>

        {filteredRestaurants.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-2">Aucun restaurant trouvé</div>
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="text-blue-600 text-sm font-medium">
                Effacer la recherche
              </button>
            )}
          </div>
        )}
      </div>

      <MobileNav />
    </div>
  )
}

"use client"

import { useState, useMemo } from "react"
import { restaurants, searchRestaurants, type Restaurant } from "@/lib/restaurants"
import RestaurantCard from "@/components/restaurant-card"
import RestaurantModal from "@/components/restaurant-modal"
import SearchAutocomplete from "@/components/search-autocomplete"
import MobileNav from "@/components/mobile-nav"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredRestaurants = useMemo(() => {
    return searchRestaurants(searchQuery)
  }, [searchQuery])

  const handleRestaurantClick = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedRestaurant(null)
  }

  // Catégorisation des restaurants
  const streetFoodRestaurants = restaurants.filter(
    (r) =>
      r.cuisine?.toLowerCase().includes("barbecue") ||
      r.cuisine?.toLowerCase().includes("fusion") ||
      r.priceRange === "€" ||
      r.priceRange === "€€",
  )

  const gastronomicRestaurants = restaurants.filter(
    (r) => r.distinction === "michelin_3" || r.distinction === "michelin_2" || r.priceRange === "€€€€",
  )

  const bistrotRestaurants = restaurants.filter(
    (r) => r.cuisine?.toLowerCase().includes("bistrot") || r.distinction === "bib_gourmand",
  )

  const newRestaurants = restaurants.filter(
    (r) => r.distinction === "michelin_1" || r.distinction === "assiette_michelin",
  )

  const CategorySection = ({
    title,
    restaurants,
    categorySlug,
  }: {
    title: string
    restaurants: Restaurant[]
    categorySlug: string
  }) => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <Link
          href={`/restaurants?category=${categorySlug}`}
          className="flex items-center gap-1 text-blue-600 text-sm font-medium hover:text-blue-700"
        >
          Tout voir
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {restaurants.slice(0, 5).map((restaurant) => (
          <div key={restaurant.id} className="flex-shrink-0 w-64">
            <RestaurantCard restaurant={restaurant} onClick={() => handleRestaurantClick(restaurant)} />
          </div>
        ))}

        {restaurants.length > 5 && (
          <Link href={`/restaurants?category=${categorySlug}`} className="flex-shrink-0 w-64">
            <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 h-full flex flex-col items-center justify-center p-6 hover:bg-gray-100 transition-colors">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-400 mb-2">+{restaurants.length - 5}</div>
                <div className="text-sm text-gray-600 mb-2">restaurants</div>
                <div className="text-xs text-blue-600 font-medium">Voir tout</div>
              </div>
            </div>
          </Link>
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Restaurants</h1>
          <SearchAutocomplete
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Rechercher dans le Guide MICHELIN"
          />
        </div>
      </div>

      {/* Contenu principal */}
      <div className="px-4 py-6">
        {searchQuery ? (
          // Résultats de recherche
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Résultats pour "{searchQuery}" ({filteredRestaurants.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRestaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  onClick={() => handleRestaurantClick(restaurant)}
                />
              ))}
            </div>
            {filteredRestaurants.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500">Aucun restaurant trouvé</div>
              </div>
            )}
          </div>
        ) : (
          // Catégories
          <div>
            <CategorySection title="Street Food" restaurants={streetFoodRestaurants} categorySlug="streetfood" />

            <CategorySection title="Gastronomique" restaurants={gastronomicRestaurants} categorySlug="gastronomique" />

            <CategorySection title="Bistrots" restaurants={bistrotRestaurants} categorySlug="bistrots" />

            <CategorySection title="Nouveautés" restaurants={newRestaurants} categorySlug="nouveautes" />
          </div>
        )}
      </div>

      {/* Modal du restaurant */}
      <RestaurantModal restaurant={selectedRestaurant} isOpen={isModalOpen} onClose={handleCloseModal} />

      {/* Navigation mobile */}
      <MobileNav />
    </div>
  )
}

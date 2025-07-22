"use client"

import { useState } from "react"
import { ChevronRight } from "lucide-react"
import { restaurants, type Restaurant, searchRestaurants } from "@/lib/restaurants"
import RestaurantCard from "@/components/restaurant-card"
import RestaurantModal from "@/components/restaurant-modal"
import SearchAutocomplete from "@/components/search-autocomplete"
import MobileNav from "@/components/mobile-nav"

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredRestaurants = searchQuery ? searchRestaurants(searchQuery) : restaurants

  // Catégorisation des restaurants
  const streetFood = restaurants.filter(
    (r) =>
      r.cuisine?.toLowerCase().includes("barbecue") ||
      r.cuisine?.toLowerCase().includes("street") ||
      r.priceRange === "€" ||
      r.priceRange === "€€",
  )

  const gastronomique = restaurants.filter(
    (r) => r.distinction === "michelin_3" || r.distinction === "michelin_2" || r.priceRange === "€€€€",
  )

  const bistrots = restaurants.filter(
    (r) =>
      r.cuisine?.toLowerCase().includes("bistrot") ||
      r.distinction === "bib_gourmand" ||
      (r.priceRange === "€€" && !streetFood.includes(r)),
  )

  const nouveautes = restaurants.filter(
    (r) =>
      r.distinction === "assiette_michelin" ||
      (!gastronomique.includes(r) && !bistrots.includes(r) && !streetFood.includes(r)),
  )

  const handleRestaurantClick = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedRestaurant(null)
  }

  const CategorySection = ({
    title,
    restaurants: categoryRestaurants,
    showAll = false,
  }: {
    title: string
    restaurants: Restaurant[]
    showAll?: boolean
  }) => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4 px-4 lg:px-0">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        {!showAll && (
          <button className="flex items-center gap-1 text-blue-600 text-sm font-medium hover:underline">
            Tout voir
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>

      <div
        className={
          showAll
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 lg:px-0"
            : "flex gap-4 overflow-x-auto pb-2 px-4 lg:px-0"
        }
      >
        {(showAll ? categoryRestaurants : categoryRestaurants.slice(0, 5)).map((restaurant) => (
          <div key={restaurant.id} className={showAll ? "" : "flex-shrink-0 w-64"}>
            <RestaurantCard restaurant={restaurant} onClick={() => handleRestaurantClick(restaurant)} />
          </div>
        ))}

        {!showAll && categoryRestaurants.length > 5 && (
          <div className="flex-shrink-0 w-64">
            <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 h-full flex items-center justify-center min-h-[200px]">
              <div className="text-center p-4">
                <p className="text-gray-600 font-medium mb-2">+{categoryRestaurants.length - 5} restaurants</p>
                <button className="text-blue-600 text-sm font-medium hover:underline">Tout voir</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-30">
        <div className="w-full max-w-7xl mx-auto px-4 py-4 lg:py-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">Restaurants</h1>

          {/* Barre de recherche */}
          <div className="max-w-md lg:max-w-lg">
            <SearchAutocomplete
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Rechercher dans le Guide MICHELIN"
              onRestaurantSelect={handleRestaurantClick}
            />
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="w-full max-w-7xl mx-auto py-6 lg:py-8">
        {searchQuery ? (
          <div className="px-4 lg:px-0">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Résultats pour "{searchQuery}" ({filteredRestaurants.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
                <p className="text-gray-500">Aucun restaurant trouvé</p>
              </div>
            )}
          </div>
        ) : (
          <>
            <CategorySection title="Street Food" restaurants={streetFood} />
            <CategorySection title="Gastronomique" restaurants={gastronomique} />
            <CategorySection title="Bistrots" restaurants={bistrots} />
            <CategorySection title="Nouveautés" restaurants={nouveautes} />
          </>
        )}
      </div>

      {/* Modal */}
      <RestaurantModal restaurant={selectedRestaurant} isOpen={isModalOpen} onClose={handleCloseModal} />

      {/* Navigation mobile */}
      <MobileNav />
    </div>
  )
}

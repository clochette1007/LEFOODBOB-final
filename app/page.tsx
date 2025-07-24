"use client"

import { useState } from "react"
import { ChevronRight } from "lucide-react"
import RestaurantCard from "@/components/restaurant-card"
import RestaurantModal from "@/components/restaurant-modal"
import SearchAutocomplete from "@/components/search-autocomplete"
import MobileNav from "@/components/mobile-nav"
import { getRestaurantsByCategory, searchRestaurants } from "@/lib/restaurants"
import type { Restaurant } from "@/lib/restaurants"

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const categories = getRestaurantsByCategory()
  const filteredRestaurants = searchRestaurants(searchQuery)

  const handleRestaurantClick = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedRestaurant(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="px-4 py-6">
          <div className="flex items-center gap-3 mb-6">
            <img src="/bob_logo.png" alt="Bob" className="h-8 w-8" />
            <h1 className="text-2xl font-bold text-gray-900">FoodBob</h1>
          </div>
          <SearchAutocomplete onSearch={setSearchQuery} placeholder="Rechercher un restaurant, une cuisine..." />
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {searchQuery ? (
          // Résultats de recherche
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Résultats pour "{searchQuery}" ({filteredRestaurants.length})
            </h2>
            <div className="grid gap-4">
              {filteredRestaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  onClick={() => handleRestaurantClick(restaurant)}
                />
              ))}
            </div>
          </div>
        ) : (
          // Catégories
          <div className="space-y-8">
            {Object.entries(categories).map(([categoryName, restaurants]) => (
              <div key={categoryName}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">{categoryName}</h2>
                  <button className="flex items-center text-blue-600 text-sm font-medium">
                    Tout voir
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {restaurants.slice(0, 5).map((restaurant) => (
                    <div key={restaurant.id} className="flex-shrink-0 w-72">
                      <RestaurantCard restaurant={restaurant} onClick={() => handleRestaurantClick(restaurant)} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedRestaurant && (
        <RestaurantModal restaurant={selectedRestaurant} isOpen={isModalOpen} onClose={closeModal} />
      )}

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  )
}

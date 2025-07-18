"use client"
import { useState } from "react"
import RestaurantMap from "@/components/restaurant-map"
import MobileNav from "@/components/mobile-nav"
import SearchAutocomplete from "@/components/search-autocomplete"
import { restaurants, type Restaurant } from "@/lib/restaurants"
import { useMobile } from "@/hooks/use-mobile"
import RestaurantCard from "@/components/restaurant-card"
import { useRouter } from "next/navigation"

export default function Page() {
  const isMobile = useMobile()
  const router = useRouter()
  const [filteredRestaurants, setFilteredRestaurants] = useState(restaurants)

  const featuredRestaurants = filteredRestaurants.slice(0, 4)

  const handleSearchChange = (query: string) => {
    if (!query) {
      setFilteredRestaurants(restaurants)
      return
    }

    const searchQuery = query.toLowerCase()
    const filtered = restaurants.filter(
      (restaurant) =>
        restaurant.name.toLowerCase().includes(searchQuery) ||
        restaurant.city.toLowerCase().includes(searchQuery) ||
        restaurant.address.toLowerCase().includes(searchQuery),
    )
    setFilteredRestaurants(filtered)
  }

  const handleRestaurantSelect = (restaurant: Restaurant) => {
    router.push(`/restaurant/${restaurant.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`)
  }

  if (isMobile) {
    return (
      <div className="min-h-screen bg-[#faf9f6] pb-24">
        {/* Header */}
        <header className="pt-6 px-4 bg-white">
          <h1 className="text-3xl font-bold mb-4 text-gray-900">Restaurants</h1>
        </header>

        {/* Barre de recherche avec autocomplétion */}
        <div className="px-4 pb-4 bg-white border-b border-gray-100">
          <SearchAutocomplete
            placeholder="Rechercher sur Le Foodbob"
            onSearchChange={handleSearchChange}
            onRestaurantSelect={handleRestaurantSelect}
          />
        </div>

        {/* Section Paris avec carte */}
        <section className="mt-6 px-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-900">Paris</h2>
            <button
              onClick={() => router.push("/restaurants")}
              className="text-sm text-blue-700 font-medium hover:underline"
            >
              Tout Voir
            </button>
          </div>

          {/* Carte */}
          <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-200 mb-6">
            <div className="h-64">
              <RestaurantMap restaurants={filteredRestaurants} />
            </div>
          </div>
        </section>

        {/* Section Restaurants recommandés */}
        <section className="px-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              {filteredRestaurants.length === restaurants.length
                ? "Restaurants recommandés"
                : `Résultats (${filteredRestaurants.length})`}
            </h2>
            <button
              onClick={() => router.push("/restaurants")}
              className="text-sm text-blue-700 font-medium hover:underline"
            >
              Tout voir
            </button>
          </div>

          {/* Liste des restaurants */}
          <div className="space-y-4">
            {featuredRestaurants.length > 0 ? (
              featuredRestaurants.map((restaurant, index) => <RestaurantCard key={index} restaurant={restaurant} />)
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Aucun restaurant trouvé pour cette recherche</p>
              </div>
            )}
          </div>
        </section>

        {/* Navigation mobile */}
        <MobileNav />
      </div>
    )
  }

  // Version Desktop
  return (
    <div className="min-h-screen bg-[#faf9f6]">
      <div className="max-w-7xl mx-auto">
        {/* Header Desktop */}
        <header className="pt-8 px-8">
          <h1 className="text-4xl font-bold mb-6 text-gray-900">Restaurants</h1>

          {/* Barre de recherche desktop avec autocomplétion */}
          <div className="max-w-2xl mb-8">
            <SearchAutocomplete
              placeholder="Rechercher sur Le Foodbob"
              onSearchChange={handleSearchChange}
              onRestaurantSelect={handleRestaurantSelect}
              className="text-lg"
            />
          </div>
        </header>

        {/* Section Paris avec carte */}
        <section className="px-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-semibold text-gray-900">Paris</h2>
            <button
              onClick={() => router.push("/restaurants")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Tout Voir
            </button>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200 h-[500px] mb-8">
            <RestaurantMap restaurants={filteredRestaurants} />
          </div>
        </section>

        {/* Section Restaurants recommandés */}
        <section className="px-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-semibold text-gray-900">
              {filteredRestaurants.length === restaurants.length
                ? "Restaurants recommandés"
                : `Résultats de recherche (${filteredRestaurants.length})`}
            </h2>
            <button
              onClick={() => router.push("/restaurants")}
              className="text-sm text-blue-700 font-medium hover:underline"
            >
              Tout voir
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredRestaurants.length > 0 ? (
              featuredRestaurants.map((restaurant, index) => <RestaurantCard key={index} restaurant={restaurant} />)
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500">
                <p className="text-xl">Aucun restaurant trouvé pour cette recherche</p>
                <p className="mt-2">Essayez avec d'autres mots-clés</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

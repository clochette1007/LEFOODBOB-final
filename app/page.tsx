"use client"
import { useState } from "react"
import RestaurantMap from "@/components/restaurant-map"
import MobileNav from "@/components/mobile-nav"
import { restaurants } from "@/lib/restaurants"
import { useMobile } from "@/hooks/use-mobile"
import RestaurantCard from "@/components/restaurant-card"
import { useRouter } from "next/navigation"

export default function Page() {
  const isMobile = useMobile()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const featuredRestaurants = restaurants.slice(0, 4)

  if (isMobile) {
    return (
      <div className="min-h-screen bg-[#faf9f6] pb-24">
        {/* Header */}
        <header className="pt-6 px-4 bg-white">
          <h1 className="text-3xl font-bold mb-4 text-gray-900">Restaurants</h1>
        </header>

        {/* Barre de recherche */}
        <div className="px-4 pb-4 bg-white border-b border-gray-100">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher sur Le Foodbob"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-gray-200 py-3 px-4 pl-12 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white placeholder-gray-400"
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
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
            <RestaurantMap />
          </div>
        </section>

        {/* Section Restaurants recommandés */}
        <section className="px-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-900">Restaurants recommandés</h2>
            <button
              onClick={() => router.push("/restaurants")}
              className="text-sm text-blue-700 font-medium hover:underline"
            >
              Tout voir
            </button>
          </div>

          {/* Liste des restaurants */}
          <div className="space-y-4">
            {featuredRestaurants.map((restaurant, index) => (
              <RestaurantCard key={index} restaurant={restaurant} />
            ))}
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

          {/* Barre de recherche desktop */}
          <div className="max-w-2xl mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher sur Le Foodbob"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-gray-200 py-4 px-6 pl-14 text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white placeholder-gray-400"
              />
              <svg
                className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </header>

        <div className="flex gap-8 px-8">
          {/* Colonne principale - Carte */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-semibold text-gray-900">Paris</h2>
              <button
                onClick={() => router.push("/restaurants")}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Tout Voir
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200 h-[600px]">
              <RestaurantMap />
            </div>
          </div>

          {/* Sidebar - Restaurants recommandés */}
          <div className="w-96">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Restaurants recommandés</h2>
              <button
                onClick={() => router.push("/restaurants")}
                className="text-sm text-blue-700 font-medium hover:underline"
              >
                Tout voir
              </button>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {featuredRestaurants.map((restaurant, index) => (
                <RestaurantCard key={index} restaurant={restaurant} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

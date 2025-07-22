"use client"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import RestaurantMap from "@/components/restaurant-map"
import SearchAutocomplete from "@/components/search-autocomplete"
import MobileNav from "@/components/mobile-nav"
import { searchRestaurants } from "@/lib/restaurants"

export default function MapPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const filteredRestaurants = searchRestaurants(searchQuery)

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-semibold text-gray-900">Carte des restaurants</h1>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-3 bg-white border-b border-gray-100">
        <SearchAutocomplete onSearch={setSearchQuery} placeholder="Rechercher sur la carte..." />
      </div>

      {/* Map */}
      <div className="flex-1">
        <div className="h-[calc(100vh-140px)]">
          <RestaurantMap restaurants={filteredRestaurants} />
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  )
}

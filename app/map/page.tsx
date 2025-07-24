"use client"

import { useState } from "react"
import RestaurantMap from "@/components/restaurant-map"
import SearchAutocomplete from "@/components/search-autocomplete"
import MobileNav from "@/components/mobile-nav"

export default function MapPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="h-screen flex flex-col">
      {/* Header with search */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-md mx-auto">
          <SearchAutocomplete onSearch={setSearchQuery} placeholder="Rechercher sur la carte..." />
        </div>
      </div>

      {/* Map */}
      <div className="flex-1">
        <RestaurantMap searchQuery={searchQuery} />
      </div>

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  )
}

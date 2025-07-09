"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Settings, ArrowLeft } from "lucide-react"
import RestaurantMap from "./restaurant-map"
import AdminPanel from "./admin-panel"

interface Restaurant {
  id: string
  name: string
  address: string
  city: string
  phone?: string
  website?: string
  category: string
  priceRange: string
  cuisine: string
  description: string
  openingHours?: string
  rating?: number
  tags: string[]
  isNew?: boolean
  isFavorite?: boolean
  photoUrl?: string
  notes?: string
}

export default function RestaurantMapWithAdmin() {
  const [showAdmin, setShowAdmin] = useState(false)
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])

  const handleSaveRestaurants = (newRestaurants: Restaurant[]) => {
    setRestaurants(newRestaurants)
    setShowAdmin(false)
    localStorage.setItem("restaurants", JSON.stringify(newRestaurants))
  }

  const handleBackToMap = () => {
    setShowAdmin(false)
  }

  return (
    <div className="relative">
      {!showAdmin ? (
        <>
          <RestaurantMap />
          <Button
            onClick={() => setShowAdmin(true)}
            className="fixed bottom-4 right-4 rounded-full w-12 h-12 p-0 shadow-lg z-40"
            title="Administration"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </>
      ) : (
        <div className="relative">
          {/* Bouton retour fixe */}
          <Button
            onClick={handleBackToMap}
            className="fixed top-4 left-4 z-50 flex items-center gap-2 shadow-lg bg-transparent"
            variant="outline"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la carte
          </Button>
          <AdminPanel onSave={handleSaveRestaurants} onBack={handleBackToMap} />
        </div>
      )}
    </div>
  )
}

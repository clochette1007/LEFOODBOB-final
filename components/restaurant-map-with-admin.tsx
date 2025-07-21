"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Settings, ArrowLeft } from "lucide-react"
import RestaurantMap from "./restaurant-map" // C'est ici qu'on utilise la carte
import AdminPanel from "./admin-panel"

// Imagine que ça, c'est comme une carte d'identité pour chaque restaurant
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
  // Ceci aide à savoir si on montre la carte ou le panneau pour les réglages
  const [showAdmin, setShowAdmin] = useState(false)
  // C'est la liste de tous tes restaurants
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])

  // Quand tu sauvegardes les restaurants dans le panneau de réglages
  const handleSaveRestaurants = (newRestaurants: Restaurant[]) => {
    setRestaurants(newRestaurants) // On met à jour la liste des restaurants
    setShowAdmin(false) // On retourne voir la carte
    // On garde la liste des restaurants dans une boîte spéciale (local storage)
    localStorage.setItem("restaurants", JSON.stringify(newRestaurants))
  }

  // Quand tu cliques sur le bouton "Retour à la carte"
  const handleBackToMap = () => {
    setShowAdmin(false) // On retourne voir la carte
  }

  return (
    // Ce "grand cadre" doit avoir une hauteur pour que la carte soit visible.
    // "h-screen" veut dire "prend toute la hauteur de l'écran".
    <div className="relative h-screen">
      {!showAdmin ? ( // Si on ne montre PAS le panneau de réglages...
        <>
          <RestaurantMap /> {/* Alors on montre la carte */}
          <Button // Et on met un bouton pour aller aux réglages
            onClick={() => setShowAdmin(true)} // Quand on clique, on passe aux réglages
            className="fixed bottom-4 right-4 rounded-full w-12 h-12 p-0 shadow-lg z-40"
            title="Administration"
          >
            <Settings className="w-5 h-5" /> {/* L'icône des réglages */}
          </Button>
        </>
      ) : ( // SI on montre le panneau de réglages...
        // Ce cadre aussi doit avoir une hauteur pour que le panneau de réglages soit visible.
        <div className="relative h-screen">
          <Button // On met un bouton pour revenir à la carte
            onClick={handleBackToMap}
            className="fixed top-4 left-4 z-50 flex items-center gap-2 shadow-lg bg-transparent"
            variant="outline"
          >
            <ArrowLeft className="w-4 h-4" /> {/* L'icône de la flèche gauche */}
            Retour à la carte
          </Button>
          {/* On montre le panneau de réglages, et on lui dit quoi faire quand on sauvegarde ou quand on revient */}
          <AdminPanel onSave={handleSaveRestaurants} onBack={handleBackToMap} />
        </div>
      )}
    </div>
  )
}

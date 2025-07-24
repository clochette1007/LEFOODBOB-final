"use client"

import { useState } from "react"
import { ArrowLeft, Heart } from "lucide-react"
import Link from "next/link"
import MobileNav from "@/components/mobile-nav"

export default function FavoritesPage() {
  const [favorites] = useState<any[]>([]) // Pour l'instant, liste vide

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-semibold text-gray-900">Mes favoris</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Aucun favori pour le moment</h2>
            <p className="text-gray-600 mb-6">
              Ajoutez des restaurants à vos favoris pour les retrouver facilement ici.
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Découvrir des restaurants
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {favorites.map((restaurant) => (
              <div key={restaurant.id} className="bg-white rounded-lg shadow-sm border p-4">
                <h3 className="font-semibold text-gray-900">{restaurant.name}</h3>
                <p className="text-sm text-blue-600">{restaurant.cuisine}</p>
                <p className="text-sm text-gray-600">{restaurant.address}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  )
}

"use client"

import { ArrowLeft, Heart } from "lucide-react"
import Link from "next/link"
import MobileNav from "@/components/mobile-nav"

export default function FavoritesPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-20">
      {/* Header */}
      <header className="bg-white px-4 pt-12 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Mes Favoris</h1>
        </div>
      </header>

      {/* Contenu */}
      <div className="px-4 py-6">
        <div className="text-center py-12">
          <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Aucun favori pour le moment</h2>
          <p className="text-gray-600 mb-6">Ajoutez des restaurants à vos favoris pour les retrouver ici</p>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Découvrir des restaurants
          </Link>
        </div>
      </div>

      {/* Navigation mobile */}
      <MobileNav />
    </div>
  )
}

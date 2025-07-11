'use client'

import { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { 
  restaurants, 
  createSlug, 
  getDistinctionIcon, 
  getDistinctionText, 
  getBadgeColor, 
  type Restaurant 
} from '@/lib/restaurants'

export default function RestaurantPage({ params }: { params: { slug: string } }) {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)

  useEffect(() => {
    // Trouver le restaurant par slug
    const foundRestaurant = restaurants.find(r => createSlug(r.name) === params.slug)
    setRestaurant(foundRestaurant || null)
  }, [params.slug])

  if (!restaurant) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec bouton retour */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
              ← Retour
            </Link>
            <h1 className="text-xl font-semibold text-gray-900">{restaurant.name}</h1>
            <div className="w-16"></div> {/* Spacer pour centrer le titre */}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Photo de couverture */}
        <div className="w-full h-80 rounded-xl overflow-hidden mb-6">
          <img
            src={restaurant.photoUrl || "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
            alt={restaurant.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = "https://placehold.co/800x320/cccccc/333333?text=Restaurant"
            }}
          />
        </div>

        {/* Informations principales */}
        <div className="bg-white rounded-xl p-6 mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{restaurant.name}</h2>
          
          {/* Adresse */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Adresse</h3>
            <p className="text-gray-700">{restaurant.address}</p>
          </div>

          {/* Distinctions */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Distinctions</h3>
            <div className="flex flex-wrap gap-2">
              {restaurant.distinctions.map((distinction, index) => (
                <span 
                  key={index} 
                  className={`inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full ${getBadgeColor(distinction)}`}
                >
                  <span>{getDistinctionIcon(distinction)}</span>
                  {getDistinctionText(distinction)}
                </span>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Contact</h3>
            
            {restaurant.website && (
              <div className="flex items-center gap-3">
                <span className="text-gray-500">🌐</span>
                <a href={restaurant.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Visiter le site Internet
                </a>
              </div>
            )}
            
            {restaurant.phone && (
              <div className="flex items-center gap-3">
                <span className="text-gray-500">📞</span>
                <a href={`tel:${restaurant.phone}`} className="text-blue-600 hover:underline">
                  {restaurant.phone}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 
'use client'

import { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { useGooglePlacesPhotos } from '@/hooks/use-google-places-photos'
import { 
  restaurants, 
  createSlug, 
  getDistinctionIcon, 
  getDistinctionText, 
  getBadgeColor, 
  type Restaurant 
} from '@/lib/restaurants'

export default function RestaurantPage({ params }: { params: Promise<{ slug: string }> }) {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [slug, setSlug] = useState<string>('')
  
  // Récupérer la vraie photo depuis Google Places API
  const { primaryPhoto, isLoading: photoLoading, error: photoError } = useGooglePlacesPhotos({
    query: restaurant?.query || '',
    maxPhotos: 1,
    maxWidth: 800,
    maxHeight: 400
  })

  useEffect(() => {
    // Récupérer le slug depuis les paramètres Promise
    const getSlug = async () => {
      const resolvedParams = await params
      setSlug(resolvedParams.slug)
    }
    getSlug()
  }, [params])

  useEffect(() => {
    if (slug) {
      // Trouver le restaurant par slug
      const foundRestaurant = restaurants.find(r => createSlug(r.name) === slug)
      setRestaurant(foundRestaurant || null)
    }
  }, [slug])

  if (slug && !restaurant) {
    notFound()
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-gray-600">Chargement...</div>
        </div>
      </div>
    )
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
        {/* Photo de couverture - VRAIE PHOTO GOOGLE */}
        <div className="w-full h-64 md:h-80 rounded-xl overflow-hidden mb-6 bg-gray-200">
          {photoLoading ? (
            <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
              <div className="text-gray-500">Chargement de la photo du restaurant...</div>
            </div>
          ) : primaryPhoto ? (
            <img
              src={primaryPhoto.url}
              alt={`${restaurant.name} - Photo du restaurant`}
              className="w-full h-full object-cover transition-opacity duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="text-lg font-semibold">{restaurant.name}</div>
                <div className="text-sm">Photo non disponible</div>
              </div>
            </div>
          )}
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
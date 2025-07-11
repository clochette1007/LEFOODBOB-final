'use client'

import { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'

interface Restaurant {
  address: string
  name: string
  city: string
  priceRange: string
  query: string
  distinctions: string[]
  phone?: string
  website?: string
  description?: string
  chef?: string
  photoUrl?: string
}

const restaurants: Restaurant[] = [
  {
    address: "5 Rue du Pont Louis-Philippe, 75004 Paris",
    name: "Aldéhyde",
    city: "4e arrondissement",
    priceRange: "€€€€",
    query: "Restaurant Aldéhyde Paris",
    distinctions: ["michelin-1"],
    phone: "+33 9 73 89 43 24",
    website: "https://aldehyde-restaurant.fr",
    chef: "Youssef Marzouk",
    description: "Dans cet établissement intimiste situé près des quais de Seine, le chef Youssef Marzouk orchestre une délicieuse partition culinaire depuis son comptoir-cuisine, sous la forme d'un menu surprise qui mêle subtilement tradition française et parfums du Maghreb. Sa technique assurée se dévoile dans des assiettes aux dressages minutieux, tandis que l'accueil chaleureux de sa compagne en salle parachève cette expérience gastronomique de qualité.",
    photoUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    address: "84 Rue de Varenne, 75007 Paris",
    name: "L'Arpège",
    city: "7e arrondissement",
    priceRange: "€€€€",
    query: "L'Arpège Alain Passard Paris",
    distinctions: ["michelin-3", "50best"],
    phone: "+33 1 47 05 09 06",
    website: "https://alain-passard.com",
    chef: "Alain Passard",
    description: "Restaurant emblématique d'Alain Passard, référence mondiale de la cuisine végétale de haute gastronomie.",
    photoUrl: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    address: "8 Avenue Dutuit, 75008 Paris",
    name: "Alléno Paris",
    city: "8e arrondissement",
    priceRange: "€€€€",
    query: "Alléno Paris Pavillon Ledoyen",
    distinctions: ["michelin-3", "gaultmillau-5"],
    phone: "+33 1 53 05 10 00",
    website: "https://yannick-alleno.com",
    chef: "Yannick Alléno",
    description: "Temple de la haute gastronomie française au sein du Pavillon Ledoyen.",
    photoUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    address: "41 Rue Saint-André-des-Arts, 75006 Paris",
    name: "Allard",
    city: "6e arrondissement",
    priceRange: "€€€",
    query: "Restaurant Allard Paris Ducasse",
    distinctions: ["gaultmillau-3"],
    phone: "+33 1 43 26 48 23",
    chef: "Alain Ducasse",
    description: "Bistrot parisien traditionnel revisité par Alain Ducasse.",
    photoUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    address: "109 Rue du Bac, 75007 Paris",
    name: "L'Ami Jean",
    city: "7e arrondissement",
    priceRange: "€€",
    query: "L'Ami Jean Paris",
    distinctions: ["michelin-bib", "gaultmillau-2"],
    phone: "+33 1 47 05 86 89",
    chef: "Stéphane Jégo",
    description: "Bistrot convivial aux saveurs du Sud-Ouest et de Bretagne.",
    photoUrl: "https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    address: "15 Place Dauphine, 75001 Paris",
    name: "Au Bourguignon du Marais",
    city: "1er arrondissement",
    priceRange: "€€",
    query: "Au Bourguignon du Marais Paris",
    distinctions: ["michelin-assiette", "gaultmillau-1"],
    phone: "+33 1 48 87 15 40",
    description: "Authentique bistrot parisien spécialisé dans la cuisine bourguignonne.",
    photoUrl: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
]

// Fonction pour convertir le nom en slug
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[àâä]/g, 'a')
    .replace(/[éèêë]/g, 'e')
    .replace(/[îï]/g, 'i')
    .replace(/[ôö]/g, 'o')
    .replace(/[ùûü]/g, 'u')
    .replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

// Fonction pour obtenir les icônes des distinctions
const getDistinctionIcon = (distinction: string) => {
  switch(distinction) {
    case "michelin-1": return "⭐"
    case "michelin-2": return "⭐⭐"
    case "michelin-3": return "⭐⭐⭐"
    case "michelin-bib": return "😋"
    case "michelin-assiette": return "🍽️"
    case "50best": return "⚫"
    case "gaultmillau-1": return "★"
    case "gaultmillau-2": return "★★"
    case "gaultmillau-3": return "★★★"
    case "gaultmillau-4": return "★★★★"
    case "gaultmillau-5": return "★★★★★"
    default: return ""
  }
}

// Fonction pour obtenir le texte des distinctions
const getDistinctionText = (distinction: string) => {
  const texts = {
    "michelin-1": "Michelin",
    "michelin-2": "Michelin",
    "michelin-3": "Michelin",
    "michelin-bib": "Bib Gourmand",
    "michelin-assiette": "Assiette Michelin",
    "50best": "50 Best",
    "gaultmillau-1": "1 toque",
    "gaultmillau-2": "2 toques",
    "gaultmillau-3": "3 toques",
    "gaultmillau-4": "4 toques",
    "gaultmillau-5": "5 toques",
  }
  return texts[distinction as keyof typeof texts] || ""
}

// Fonction pour obtenir la couleur de badge
const getBadgeColor = (distinction: string) => {
  if (distinction.startsWith('michelin-')) return "bg-red-100 text-red-800"
  if (distinction.startsWith('gaultmillau-')) return "bg-yellow-100 text-yellow-800"
  if (distinction === '50best') return "bg-purple-100 text-purple-800"
  return "bg-gray-100 text-gray-800"
}

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
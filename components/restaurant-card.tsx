"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Clock, ExternalLink } from "lucide-react"
import type { Restaurant } from "@/lib/restaurants"
import Link from "next/link"

interface RestaurantCardProps {
  restaurant: Restaurant
  className?: string
}

export default function RestaurantCard({ restaurant, className = "" }: RestaurantCardProps) {
  // Fonction pour obtenir l'icône de distinction
  const getDistinctionIcon = (distinction: string) => {
    switch (distinction) {
      case "michelin-1":
        return "/etoile-michelin.webp"
      case "michelin-2":
        return "/etoile-michelin.webp"
      case "michelin-3":
        return "/etoile-michelin.webp"
      case "michelin-bib":
        return "/bibgourmand.jpg"
      case "michelin-assiette":
        return "/assiettemichelin.jpg"
      case "gaultmillau-1":
        return "/1toque.png"
      case "gaultmillau-2":
        return "/2toques.jpg"
      case "gaultmillau-3":
        return "/3toques.jpg"
      case "gaultmillau-4":
        return "/4toques.png"
      case "gaultmillau-5":
        return "/5toques.png"
      case "50best":
        return "/50bestrestaurants.webp"
      default:
        return null
    }
  }

  // Fonction pour obtenir le nombre d'étoiles Michelin
  const getMichelinStars = (distinction: string) => {
    switch (distinction) {
      case "michelin-1":
        return 1
      case "michelin-2":
        return 2
      case "michelin-3":
        return 3
      default:
        return 0
    }
  }

  // Générer le slug pour l'URL
  const slug = restaurant.name.toLowerCase().replace(/[^a-z0-9]/g, "-")

  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 border-2 hover:border-red-200 ${className}`}>
      <CardContent className="p-0">
        <Link href={`/${slug}`} className="block">
          {/* Image du restaurant */}
          <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg overflow-hidden">
            <img
              src={`/placeholder.svg?height=192&width=384&text=${encodeURIComponent(restaurant.name.slice(0, 15))}`}
              alt={restaurant.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {/* Badge de prix */}
            <div className="absolute top-3 right-3">
              <Badge variant="secondary" className="bg-white/90 text-gray-800 font-semibold">
                {restaurant.priceRange}
              </Badge>
            </div>

            {/* Distinctions */}
            {restaurant.distinctions.length > 0 && (
              <div className="absolute top-3 left-3 flex gap-1">
                {restaurant.distinctions.map((distinction, index) => {
                  const icon = getDistinctionIcon(distinction)
                  const stars = getMichelinStars(distinction)

                  if (!icon) return null

                  return (
                    <div key={index} className="flex items-center bg-white/90 rounded-full p-1">
                      {stars > 0 ? (
                        // Afficher plusieurs étoiles pour Michelin
                        Array.from({ length: stars }).map((_, starIndex) => (
                          <img
                            key={starIndex}
                            src={icon || "/placeholder.svg"}
                            alt={`${stars} étoile${stars > 1 ? "s" : ""} Michelin`}
                            className="w-4 h-4 object-contain"
                          />
                        ))
                      ) : (
                        <img src={icon || "/placeholder.svg"} alt={distinction} className="w-4 h-4 object-contain" />
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Contenu de la carte */}
          <div className="p-6">
            {/* Nom du restaurant */}
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
              {restaurant.name}
            </h3>

            {/* Type de cuisine */}
            {restaurant.cuisine && <p className="text-sm text-red-600 font-medium mb-3">{restaurant.cuisine}</p>}

            {/* Description */}
            {restaurant.description && (
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{restaurant.description}</p>
            )}

            {/* Informations pratiques */}
            <div className="space-y-2">
              {/* Adresse */}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">Paris - {restaurant.city.replace("arrondissement", "arr.")}</span>
              </div>

              {/* Téléphone */}
              {restaurant.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span>{restaurant.phone}</span>
                </div>
              )}

              {/* Horaires */}
              {restaurant.openingHours && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{restaurant.openingHours}</span>
                </div>
              )}

              {/* Site web */}
              {restaurant.website && (
                <div className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800">
                  <ExternalLink className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">Site officiel</span>
                </div>
              )}
            </div>

            {/* Call to action */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Voir les détails</span>
                <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                  <svg className="w-3 h-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  )
}

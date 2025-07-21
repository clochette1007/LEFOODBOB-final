"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Globe, Star } from "lucide-react"
import { type Restaurant, getBadgeColor, getDistinctionText } from "@/lib/restaurants"
import Link from "next/link"

interface RestaurantCardProps {
  restaurant: Restaurant
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const slug = restaurant.name.toLowerCase().replace(/[^a-z0-9]/g, "-")

  // Fonction pour obtenir l'icône de distinction
  const getDistinctionIcon = (distinction: string) => {
    switch (distinction) {
      case "michelin-1":
      case "michelin-2":
      case "michelin-3":
        return "/etoile-michelin.webp"
      case "michelin-bib":
        return "/bibgourmand.jpg"
      case "michelin-assiette":
        return "/assiettemichelin.jpg"
      case "50best":
        return "/50bestrestaurants.webp"
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
      default:
        return null
    }
  }

  // Fonction pour obtenir le nombre d'étoiles
  const getStarCount = (distinction: string) => {
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

  return (
    <Link href={`/${slug}`}>
      <Card className="h-full hover:shadow-lg transition-shadow duration-200 cursor-pointer">
        <CardContent className="p-6">
          {/* Image du restaurant */}
          <div className="relative mb-4 h-48 bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={`/placeholder.svg?height=200&width=300&text=${encodeURIComponent(restaurant.name.slice(0, 10))}`}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
            {/* Badge de prix */}
            <div className="absolute top-3 right-3">
              <Badge variant="secondary" className="bg-white/90 text-gray-900">
                {restaurant.priceRange}
              </Badge>
            </div>
          </div>

          {/* Distinctions */}
          {restaurant.distinctions.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {restaurant.distinctions.map((distinction, index) => {
                const icon = getDistinctionIcon(distinction)
                const starCount = getStarCount(distinction)

                return (
                  <div key={index} className="flex items-center gap-1">
                    {icon && (
                      <img src={icon || "/placeholder.svg"} alt={distinction} className="w-5 h-5 object-contain" />
                    )}
                    {starCount > 0 && (
                      <div className="flex">
                        {Array.from({ length: starCount }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    )}
                    <Badge variant="outline" className={`text-xs ${getBadgeColor(distinction)}`}>
                      {distinction.replace("-", " ").toUpperCase()}
                    </Badge>
                  </div>
                )
              })}
            </div>
          )}

          {/* Nom du restaurant */}
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{restaurant.name}</h3>

          {/* Chef */}
          {restaurant.chef && <p className="text-sm text-gray-600 mb-2">Chef : {restaurant.chef}</p>}

          {/* Description */}
          {restaurant.description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">{restaurant.description}</p>
          )}

          {/* Informations pratiques */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MapPin className="h-4 w-4" />
              <span className="truncate">{restaurant.address}</span>
            </div>

            {restaurant.phone && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Phone className="h-4 w-4" />
                <span>{restaurant.phone}</span>
              </div>
            )}

            {restaurant.website && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Globe className="h-4 w-4" />
                <span className="truncate">Site web</span>
              </div>
            )}
          </div>

          {/* Première distinction avec description */}
          {restaurant.distinctions.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 italic">{getDistinctionText(restaurant.distinctions[0])}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}

"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { createSlug, type Restaurant } from "@/lib/restaurants"
import { useGooglePlacesPhotos } from "@/hooks/use-google-places-photos"

interface RestaurantCardProps {
  restaurant: Restaurant
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const router = useRouter()
  const [imageError, setImageError] = useState(false)
  const { photoUrl, isLoading } = useGooglePlacesPhotos(restaurant.query)

  const handleClick = () => {
    router.push(`/restaurant/${createSlug(restaurant.name)}`)
  }

  const getDistinctionImage = (distinction: string) => {
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

  const imageUrl =
    !imageError && photoUrl
      ? photoUrl
      : `/placeholder.svg?height=200&width=300&text=${encodeURIComponent(restaurant.name)}`

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-200"
    >
      {/* Image */}
      <div className="relative h-48 bg-gray-100">
        {isLoading ? (
          <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="text-gray-400 text-sm">Chargement...</div>
          </div>
        ) : (
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={restaurant.name}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
          />
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Distinctions */}
        {restaurant.distinctions && restaurant.distinctions.length > 0 && (
          <div className="flex items-center gap-1 mb-2">
            {restaurant.distinctions.slice(0, 3).map((distinction, index) => {
              const imageSrc = getDistinctionImage(distinction)
              return imageSrc ? (
                <Image
                  key={index}
                  src={imageSrc || "/placeholder.svg"}
                  alt={distinction}
                  width={20}
                  height={20}
                  className="object-contain"
                />
              ) : null
            })}
          </div>
        )}

        {/* Restaurant name */}
        <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-1">{restaurant.name}</h3>

        {/* Location */}
        <p className="text-gray-600 text-sm mb-1">{restaurant.city.replace("arrondissement", "arr.")}</p>

        {/* Price and cuisine type */}
        <div className="flex items-center justify-between">
          <span className="text-gray-600 text-sm">{restaurant.priceRange}</span>
          {restaurant.chef && <span className="text-gray-500 text-xs">Chef {restaurant.chef}</span>}
        </div>
      </div>
    </div>
  )
}

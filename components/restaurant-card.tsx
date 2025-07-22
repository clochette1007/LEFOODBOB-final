"use client"

import Image from "next/image"
import { MapPin } from "lucide-react"
import { type Restaurant, getDistinctionIcons } from "@/lib/restaurants"

interface RestaurantCardProps {
  restaurant: Restaurant
  onClick?: () => void
}

export default function RestaurantCard({ restaurant, onClick }: RestaurantCardProps) {
  const distinctionIcons = getDistinctionIcons(restaurant.distinction)

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
    >
      {/* Photo du restaurant */}
      <div className="h-32 sm:h-40 bg-gray-100 relative">
        <Image
          src={`/placeholder.svg?height=160&width=256&text=${encodeURIComponent(restaurant.name)}`}
          alt={restaurant.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Contenu */}
      <div className="p-3 sm:p-4">
        {/* Titre avec distinctions */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-gray-900 text-sm sm:text-base leading-tight flex-1 min-w-0">
            {restaurant.name}
          </h3>
          {distinctionIcons.length > 0 && (
            <div className="flex items-center gap-1 flex-shrink-0">
              {distinctionIcons.map((icon, index) => (
                <Image
                  key={index}
                  src={icon || "/placeholder.svg"}
                  alt="Distinction"
                  width={20}
                  height={20}
                  className="object-contain"
                />
              ))}
            </div>
          )}
        </div>

        {/* Type de cuisine */}
        {restaurant.cuisine && (
          <p className="text-blue-600 font-medium text-xs sm:text-sm mb-2">{restaurant.cuisine}</p>
        )}

        {/* Adresse */}
        <div className="flex items-start gap-2">
          <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{restaurant.address}</p>
        </div>
      </div>
    </div>
  )
}

"use client"

import Image from "next/image"
import { type Restaurant, getDistinctionIcons } from "@/lib/restaurants"
import { MapPin } from "lucide-react"

interface RestaurantCardProps {
  restaurant: Restaurant
  onClick?: () => void
}

export default function RestaurantCard({ restaurant, onClick }: RestaurantCardProps) {
  const distinctionIcons = getDistinctionIcons(restaurant.distinction)

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow h-full cursor-pointer"
    >
      {/* Photo du restaurant */}
      <div className="h-40 bg-gray-100 relative overflow-hidden">
        <Image
          src={`/placeholder.svg?height=160&width=256&text=${encodeURIComponent(restaurant.name)}`}
          alt={restaurant.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-4">
        {/* Titre avec logos des distinctions */}
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 flex-1">{restaurant.name}</h3>
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

        {/* Type en bleu */}
        {restaurant.cuisine && <p className="text-sm text-blue-600 font-medium mb-2">{restaurant.cuisine}</p>}

        {/* Adresse */}
        <div className="flex items-start gap-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span className="line-clamp-2">{restaurant.address}</span>
        </div>
      </div>
    </div>
  )
}

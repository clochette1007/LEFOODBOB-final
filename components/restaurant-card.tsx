"use client"

import Image from "next/image"
import { MapPin, Phone } from "lucide-react"
import { getDistinctionIcons } from "@/lib/restaurants"
import type { Restaurant } from "@/lib/restaurants"

interface RestaurantCardProps {
  restaurant: Restaurant
  onClick: () => void
}

export default function RestaurantCard({ restaurant, onClick }: RestaurantCardProps) {
  const distinctionIcons = getDistinctionIcons(restaurant.distinctions || [])

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
    >
      {/* Image */}
      <div className="relative h-48 bg-gray-200">
        <Image
          src="/placeholder.jpg"
          alt={restaurant.name}
          fill
          className="object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = "/placeholder.svg?height=200&width=300&text=" + encodeURIComponent(restaurant.name)
          }}
        />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title and Icons */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 text-lg">{restaurant.name}</h3>
          {distinctionIcons.length > 0 && (
            <div className="flex gap-1 ml-2">
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

        {/* Cuisine */}
        <p className="text-blue-600 text-sm font-medium mb-2">{restaurant.cuisine}</p>

        {/* Address */}
        <div className="flex items-start gap-2 text-gray-600 text-sm mb-3">
          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>{restaurant.address}</span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span className="text-green-600 font-semibold">{restaurant.priceRange}</span>
          {restaurant.phone && (
            <div className="flex items-center gap-1 text-gray-500 text-sm">
              <Phone className="h-3 w-3" />
              <span>{restaurant.phone}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

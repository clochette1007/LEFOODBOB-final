"use client"

import { useState } from "react"
import Image from "next/image"
import { X, MapPin, Phone, Clock, Globe, Heart } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { getDistinctionIcons, getDistinctionText } from "@/lib/restaurants"
import type { Restaurant } from "@/lib/restaurants"

interface RestaurantModalProps {
  restaurant: Restaurant
  isOpen: boolean
  onClose: () => void
}

export default function RestaurantModal({ restaurant, isOpen, onClose }: RestaurantModalProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const distinctionIcons = getDistinctionIcons(restaurant.distinction)
  const distinctionText = getDistinctionText(restaurant.distinction)

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header Image */}
        <div className="relative h-64 bg-gray-200">
          <Image
            src="/placeholder.jpg"
            alt={restaurant.name}
            fill
            className="object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = "/placeholder.svg?height=300&width=600&text=" + encodeURIComponent(restaurant.name)
            }}
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full p-2 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <button
            onClick={toggleFavorite}
            className={`absolute top-4 left-4 rounded-full p-2 transition-colors ${
              isFavorite ? "bg-red-500 text-white" : "bg-white/90 hover:bg-white text-gray-700"
            }`}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title and Distinction */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{restaurant.name}</h2>
              {restaurant.cuisine && <p className="text-blue-600 font-medium">{restaurant.cuisine}</p>}
            </div>
            {distinctionIcons.length > 0 && (
              <div className="flex flex-col items-end">
                <div className="flex gap-1 mb-1">
                  {distinctionIcons.map((icon, index) => (
                    <Image
                      key={index}
                      src={icon || "/placeholder.svg"}
                      alt={distinctionText}
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">{distinctionText}</span>
              </div>
            )}
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              {restaurant.priceRange}
            </span>
          </div>

          {/* Description */}
          {restaurant.description && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{restaurant.description}</p>
            </div>
          )}

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Informations</h3>

            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-gray-900">{restaurant.address}</p>
                <p className="text-gray-600 text-sm">{restaurant.city}</p>
              </div>
            </div>

            {restaurant.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <a href={`tel:${restaurant.phone}`} className="text-blue-600 hover:underline">
                  {restaurant.phone}
                </a>
              </div>
            )}

            {restaurant.website && (
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-gray-400" />
                <a
                  href={restaurant.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Site web
                </a>
              </div>
            )}

            {restaurant.openingHours && (
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-gray-900">Horaires</p>
                  <p className="text-gray-600 text-sm">{restaurant.openingHours}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

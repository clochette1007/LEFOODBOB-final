"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Clock, Globe, X } from "lucide-react"
import Image from "next/image"
import { type Restaurant, getDistinctionIcons } from "@/lib/restaurants"

interface RestaurantModalProps {
  restaurant: Restaurant | null
  isOpen: boolean
  onClose: () => void
}

export default function RestaurantModal({ restaurant, isOpen, onClose }: RestaurantModalProps) {
  if (!restaurant) return null

  const distinctionIcons = getDistinctionIcons(restaurant.distinction)

  const handleAddressClick = () => {
    if (restaurant.coordinates) {
      const { lat, lng } = restaurant.coordinates
      const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`
      window.open(googleMapsUrl, "_blank")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-md mx-auto max-h-[90vh] overflow-y-auto p-0 gap-0">
        {/* Header avec bouton fermer */}
        <DialogHeader className="relative p-4 pb-2">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
          >
            <X className="h-4 w-4" />
          </button>
          <DialogTitle className="text-left pr-12 text-lg font-bold">{restaurant.name}</DialogTitle>
        </DialogHeader>

        <div className="px-4 pb-4 space-y-4">
          {/* Photo du restaurant */}
          <div className="h-48 sm:h-56 bg-gray-100 rounded-lg overflow-hidden relative">
            <Image
              src={`/placeholder.svg?height=224&width=400&text=${encodeURIComponent(restaurant.name)}`}
              alt={restaurant.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Titre avec distinctions */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-gray-900 leading-tight">{restaurant.name}</h2>
              {restaurant.cuisine && <p className="text-sm text-blue-600 font-medium mt-1">{restaurant.cuisine}</p>}
            </div>
            {distinctionIcons.length > 0 && (
              <div className="flex items-center gap-1 flex-shrink-0">
                {distinctionIcons.map((icon, index) => (
                  <Image
                    key={index}
                    src={icon || "/placeholder.svg"}
                    alt="Distinction"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          {restaurant.description && <p className="text-gray-700 text-sm leading-relaxed">{restaurant.description}</p>}

          {/* Informations pratiques */}
          <div className="space-y-4">
            {/* Adresse */}
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm mb-1">Adresse</p>
                <button
                  onClick={handleAddressClick}
                  className="text-blue-600 hover:underline text-sm text-left leading-relaxed"
                >
                  {restaurant.address}
                </button>
              </div>
            </div>

            {/* Téléphone */}
            {restaurant.phone && (
              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm mb-1">Téléphone</p>
                  <a href={`tel:${restaurant.phone}`} className="text-blue-600 hover:underline text-sm">
                    {restaurant.phone}
                  </a>
                </div>
              </div>
            )}

            {/* Horaires */}
            {restaurant.openingHours && (
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm mb-1">Horaires</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{restaurant.openingHours}</p>
                </div>
              </div>
            )}

            {/* Site web */}
            {restaurant.website && (
              <div className="flex items-start gap-3">
                <Globe className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm mb-1">Site web</p>
                  <a
                    href={restaurant.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Visiter le site
                  </a>
                </div>
              </div>
            )}

            {/* Prix */}
            <div className="flex items-start gap-3">
              <div className="h-4 w-4 mt-1 flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm mb-2">Prix</p>
                <div className="text-green-600 font-bold text-xl">{restaurant.priceRange}</div>
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-3 pt-4">
            <Button className="flex-1 h-11 text-sm font-medium">Réserver</Button>
            <Button variant="outline" className="flex-1 h-11 text-sm font-medium bg-transparent">
              Favoris
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

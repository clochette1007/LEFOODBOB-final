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
      <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader className="relative">
          <button onClick={onClose} className="absolute right-0 top-0 p-2 hover:bg-gray-100 rounded-full">
            <X className="h-4 w-4" />
          </button>
          <DialogTitle className="text-left pr-8">{restaurant.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Photo du restaurant */}
          <div className="h-48 bg-gray-100 rounded-lg overflow-hidden relative">
            <Image
              src={`/placeholder.svg?height=192&width=400&text=${encodeURIComponent(restaurant.name)}`}
              alt={restaurant.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Titre avec distinctions */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{restaurant.name}</h2>
              {restaurant.cuisine && <p className="text-sm text-blue-600 font-medium mt-1">{restaurant.cuisine}</p>}
            </div>
            {distinctionIcons.length > 0 && (
              <div className="flex items-center gap-1">
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
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-gray-900">Adresse</p>
                <button onClick={handleAddressClick} className="text-blue-600 hover:underline text-left">
                  {restaurant.address}
                </button>
              </div>
            </div>

            {restaurant.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-gray-900">Téléphone</p>
                  <a href={`tel:${restaurant.phone}`} className="text-blue-600 hover:underline">
                    {restaurant.phone}
                  </a>
                </div>
              </div>
            )}

            {restaurant.openingHours && (
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-gray-900">Horaires</p>
                  <p className="text-gray-600">{restaurant.openingHours}</p>
                </div>
              </div>
            )}

            {restaurant.website && (
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-gray-900">Site web</p>
                  <a
                    href={restaurant.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Visiter le site
                  </a>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <div className="h-4 w-4 mt-0.5"></div>
              <div className="text-sm">
                <p className="font-medium text-gray-900">Prix</p>
                <div className="text-green-600 font-bold text-lg mt-1">{restaurant.priceRange}</div>
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-2 pt-4">
            <Button className="flex-1" size="sm">
              Réserver
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent" size="sm">
              Favoris
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

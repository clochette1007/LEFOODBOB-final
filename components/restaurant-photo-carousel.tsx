"use client"

import { restaurants } from '@/lib/restaurants'

interface RestaurantPhotoCarouselProps {
  restaurantQuery: string
  restaurantName: string
  fallbackPhoto?: string
}

export default function RestaurantPhotoCarousel({
  restaurantQuery,
  restaurantName,
  fallbackPhoto
}: RestaurantPhotoCarouselProps) {
  // Récupérer la photo du restaurant depuis les données
  const restaurant = restaurants.find(r => r.name === restaurantName)
  const photoUrl = restaurant?.photoUrl || fallbackPhoto || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"

  return (
    <div className="relative w-full h-80 bg-gray-200 overflow-hidden">
      <img
        src={photoUrl}
        alt={`${restaurantName} - Photo du restaurant`}
        className="w-full h-full object-cover"
      />
    </div>
  )
} 
"use client"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { createSlug, type Restaurant } from "@/lib/restaurants"
import { useGooglePlacesPhotos } from "@/hooks/use-google-places-photos"

interface RestaurantCardProps {
  restaurant: Restaurant
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const router = useRouter()
  const { primaryPhoto, isLoading } = useGooglePlacesPhotos({
    query: restaurant.query,
    maxPhotos: 1,
    maxWidth: 300,
    maxHeight: 200,
  })

  const handleClick = () => {
    const slug = createSlug(restaurant.name)
    router.push(`/${slug}`)
  }

  const renderDistinctions = () => {
    return restaurant.distinctions.map((distinction, index) => {
      let iconSrc = ""

      switch (distinction) {
        case "michelin-1":
          iconSrc = "/etoile-michelin.webp"
          break
        case "michelin-2":
          return (
            <div key={index} className="flex gap-0.5">
              <Image src="/etoile-michelin.webp" alt="Michelin" width={16} height={16} className="object-contain" />
              <Image src="/etoile-michelin.webp" alt="Michelin" width={16} height={16} className="object-contain" />
            </div>
          )
        case "michelin-3":
          return (
            <div key={index} className="flex gap-0.5">
              <Image src="/etoile-michelin.webp" alt="Michelin" width={16} height={16} className="object-contain" />
              <Image src="/etoile-michelin.webp" alt="Michelin" width={16} height={16} className="object-contain" />
              <Image src="/etoile-michelin.webp" alt="Michelin" width={16} height={16} className="object-contain" />
            </div>
          )
        case "michelin-bib":
          iconSrc = "/bibgourmand.jpg"
          break
        case "michelin-assiette":
          iconSrc = "/assiettemichelin.jpg"
          break
        case "50best":
          iconSrc = "/50bestrestaurants.webp"
          break
        case "gaultmillau-1":
          iconSrc = "/1toque.png"
          break
        case "gaultmillau-2":
          iconSrc = "/2toques.jpg"
          break
        case "gaultmillau-3":
          iconSrc = "/3toques.jpg"
          break
        case "gaultmillau-4":
          iconSrc = "/4toques.png"
          break
        case "gaultmillau-5":
          iconSrc = "/5toques.png"
          break
        default:
          return null
      }

      if (iconSrc) {
        return (
          <Image
            key={index}
            src={iconSrc || "/placeholder.svg"}
            alt={distinction}
            width={16}
            height={16}
            className="object-contain"
          />
        )
      }
      return null
    })
  }

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
    >
      {/* Image */}
      <div className="relative h-32 bg-gray-100">
        {isLoading ? (
          <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : primaryPhoto ? (
          <Image src={primaryPhoto.url || "/placeholder.svg"} alt={restaurant.name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-sm">Photo indisponible</span>
          </div>
        )}
      </div>

      {/* Contenu */}
      <div className="p-4">
        {/* Distinctions */}
        <div className="flex items-center gap-1 mb-2 min-h-[20px]">{renderDistinctions()}</div>

        {/* Nom du restaurant */}
        <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">{restaurant.name}</h3>

        {/* Localisation */}
        <p className="text-gray-600 text-sm mb-1">Paris - {restaurant.city.replace("arrondissement", "arr.")}</p>

        {/* Prix et type */}
        <p className="text-gray-600 text-sm">{restaurant.priceRange} • Cuisine gastronomique</p>
      </div>
    </div>
  )
}

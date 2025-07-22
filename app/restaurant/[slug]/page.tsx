import { notFound } from "next/navigation"
import { getRestaurantBySlug, getDistinctionIcon, getDistinctionText } from "@/lib/restaurants"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, MapPin, Phone, Clock, Globe } from "lucide-react"
import MobileNav from "@/components/mobile-nav"

interface RestaurantPageProps {
  params: {
    slug: string
  }
}

export default function RestaurantPage({ params }: RestaurantPageProps) {
  const restaurant = getRestaurantBySlug(params.slug)

  if (!restaurant) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header avec image */}
      <div className="relative h-64 bg-gray-200">
        <Image
          src={`/placeholder.svg?height=256&width=400&text=${encodeURIComponent(restaurant.name)}`}
          alt={restaurant.name}
          fill
          className="object-cover"
        />
        <div className="absolute top-4 left-4">
          <Link href="/" className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white">
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </Link>
        </div>
      </div>

      {/* Contenu */}
      <div className="bg-white -mt-6 relative rounded-t-3xl">
        <div className="p-6">
          {/* Titre et distinction */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{restaurant.name}</h1>
              {restaurant.cuisine && <p className="text-lg text-blue-600 font-medium">{restaurant.cuisine}</p>}
            </div>
            <div className="flex items-center gap-2 ml-4">
              <Image
                src={getDistinctionIcon(restaurant.distinction) || "/placeholder.svg"}
                alt={getDistinctionText(restaurant.distinction)}
                width={32}
                height={32}
                className="object-contain"
              />
              <span className="text-sm font-medium text-gray-600">{getDistinctionText(restaurant.distinction)}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-700 mb-6 leading-relaxed">{restaurant.description}</p>

          {/* Informations pratiques */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-gray-900 font-medium">Adresse</p>
                <p className="text-gray-600">{restaurant.address}</p>
              </div>
            </div>

            {restaurant.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-gray-900 font-medium">Téléphone</p>
                  <a href={`tel:${restaurant.phone}`} className="text-blue-600">
                    {restaurant.phone}
                  </a>
                </div>
              </div>
            )}

            {restaurant.openingHours && (
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-gray-900 font-medium">Horaires</p>
                  <p className="text-gray-600">{restaurant.openingHours}</p>
                </div>
              </div>
            )}

            {restaurant.website && (
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-gray-900 font-medium">Site web</p>
                  <a href={restaurant.website} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                    Visiter le site
                  </a>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="h-5 w-5 flex items-center justify-center">
                <span className="text-green-600 font-bold">{restaurant.priceRange}</span>
              </div>
              <div>
                <p className="text-gray-900 font-medium">Gamme de prix</p>
                <p className="text-gray-600">
                  {restaurant.priceRange === "€" && "Économique"}
                  {restaurant.priceRange === "€€" && "Modéré"}
                  {restaurant.priceRange === "€€€" && "Élevé"}
                  {restaurant.priceRange === "€€€€" && "Très élevé"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MobileNav />
    </div>
  )
}

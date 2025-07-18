import { restaurants } from "@/lib/restaurants"
import { RestaurantPhotoCarousel } from "@/components/restaurant-photo-carousel"
import { Badge } from "@/components/ui/badge"
import { Phone, MapPin, Globe, ChefHat } from "lucide-react"

export default function AutomnePage() {
  const restaurant = restaurants.find(r => r.name === "Automne")
  
  if (!restaurant) {
    return <div>Restaurant non trouvé</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <RestaurantPhotoCarousel restaurant={restaurant} />
          
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{restaurant.name}</h1>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{restaurant.address}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="text-sm">{restaurant.city}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {restaurant.priceSymbol}
                </div>
                <div className="text-sm text-gray-500">{restaurant.priceRange}</div>
              </div>
            </div>

            {restaurant.distinctions && restaurant.distinctions.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {restaurant.distinctions.map((distinction, index) => (
                  <Badge key={index} variant="secondary" className="bg-red-100 text-red-800">
                    {distinction}
                  </Badge>
                ))}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold mb-3 flex items-center">
                  <ChefHat className="h-5 w-5 mr-2" />
                  À propos
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {restaurant.description}
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-3">Informations</h2>
                
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-3 text-gray-400" />
                  <div>
                    <div className="font-medium">Adresse</div>
                    <div className="text-sm text-gray-600">{restaurant.address}</div>
                  </div>
                </div>

                {restaurant.phone && (
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 mr-3 text-gray-400" />
                    <div>
                      <div className="font-medium">Téléphone</div>
                      <div className="text-sm text-gray-600">{restaurant.phone}</div>
                    </div>
                  </div>
                )}

                {restaurant.website && (
                  <div className="flex items-center">
                    <Globe className="h-5 w-5 mr-3 text-gray-400" />
                    <div>
                      <div className="font-medium">Site web</div>
                      <a href={restaurant.website} target="_blank" rel="noopener noreferrer" 
                         className="text-sm text-blue-600 hover:underline">
                        Visiter le site
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

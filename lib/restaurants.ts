export interface Restaurant {
  id: string
  name: string
  address: string
  city: string
  coordinates?: {
    lat: number
    lng: number
  }
  cuisine?: string
  priceRange: "€" | "€€" | "€€€" | "€€€€"
  distinction:
    | "michelin_1"
    | "michelin_2"
    | "michelin_3"
    | "bib_gourmand"
    | "assiette_michelin"
    | "bob_repere"
    | "bob_flop"
  phone?: string
  website?: string
  openingHours?: string
  description?: string
}

export const restaurants: Restaurant[] = [
  {
    id: "1",
    name: "L'Arpège",
    address: "84 Rue de Varenne, 75007 Paris",
    city: "Paris",
    coordinates: { lat: 48.8566, lng: 2.3208 },
    cuisine: "Française contemporaine",
    priceRange: "€€€€",
    distinction: "michelin_3",
    phone: "01 47 05 09 06",
    website: "https://www.alain-passard.com",
    openingHours: "12h00-14h00, 19h30-22h00",
    description: "Restaurant gastronomique d'Alain Passard, spécialisé dans les légumes du potager.",
  },
  {
    id: "2",
    name: "L'Ami Jean",
    address: "27 Rue Malar, 75007 Paris",
    city: "Paris",
    coordinates: { lat: 48.8584, lng: 2.3001 },
    cuisine: "Bistrot moderne",
    priceRange: "€€€",
    distinction: "bib_gourmand",
    phone: "01 47 05 86 89",
    openingHours: "12h00-14h00, 19h00-23h00",
    description: "Bistrot convivial aux saveurs du Sud-Ouest revisitées.",
  },
  {
    id: "3",
    name: "Melt - Slow Smoked Barbecue",
    address: "15 Rue de la Fontaine au Roi, 75011 Paris",
    city: "Paris",
    coordinates: { lat: 48.8675, lng: 2.3708 },
    cuisine: "Barbecue américain",
    priceRange: "€€",
    distinction: "bob_repere",
    phone: "01 43 55 74 22",
    openingHours: "18h00-23h00",
    description: "Authentique barbecue américain avec viandes fumées 12h.",
  },
  {
    id: "4",
    name: "Alleno Paris",
    address: "8 Avenue Dutuit, 75008 Paris",
    city: "Paris",
    coordinates: { lat: 48.8656, lng: 2.3147 },
    cuisine: "Française moderne",
    priceRange: "€€€€",
    distinction: "michelin_2",
    phone: "01 53 05 10 00",
    website: "https://www.yannick-alleno.com",
    openingHours: "19h30-22h00",
    description: "Cuisine moderne de Yannick Alléno au Pavillon Ledoyen.",
  },
  {
    id: "5",
    name: "Au Bourguignon du Marais",
    address: "52 Rue François Miron, 75004 Paris",
    city: "Paris",
    coordinates: { lat: 48.8534, lng: 2.3626 },
    cuisine: "Bistrot traditionnel",
    priceRange: "€€",
    distinction: "assiette_michelin",
    phone: "01 48 87 15 40",
    openingHours: "12h00-15h00, 19h00-23h00",
    description: "Bistrot authentique spécialisé dans les vins de Bourgogne.",
  },
]

export function searchRestaurants(query: string): Restaurant[] {
  if (!query.trim()) return restaurants

  const searchTerm = query.toLowerCase()
  return restaurants.filter(
    (restaurant) =>
      restaurant.name.toLowerCase().includes(searchTerm) ||
      restaurant.cuisine?.toLowerCase().includes(searchTerm) ||
      restaurant.address.toLowerCase().includes(searchTerm) ||
      restaurant.city.toLowerCase().includes(searchTerm),
  )
}

export function getAutocompleteSuggestions(query: string): string[] {
  if (!query.trim()) return []

  const searchTerm = query.toLowerCase()
  const suggestions = new Set<string>()

  restaurants.forEach((restaurant) => {
    if (restaurant.name.toLowerCase().includes(searchTerm)) {
      suggestions.add(restaurant.name)
    }
    if (restaurant.cuisine?.toLowerCase().includes(searchTerm)) {
      suggestions.add(restaurant.cuisine)
    }
    if (restaurant.city.toLowerCase().includes(searchTerm)) {
      suggestions.add(restaurant.city)
    }
  })

  return Array.from(suggestions).slice(0, 5)
}

export function getDistinctionIcons(distinction: Restaurant["distinction"]): string[] {
  switch (distinction) {
    case "michelin_1":
      return ["/etoile-michelin.webp"]
    case "michelin_2":
      return ["/etoile-michelin.webp", "/etoile-michelin.webp"]
    case "michelin_3":
      return ["/etoile-michelin.webp", "/etoile-michelin.webp", "/etoile-michelin.webp"]
    case "bib_gourmand":
      return ["/bibgourmand.jpg"]
    case "assiette_michelin":
      return ["/assiettemichelin.jpg"]
    case "bob_repere":
    case "bob_flop":
      return []
    default:
      return []
  }
}

export function getDistinctionText(distinction: Restaurant["distinction"]): string {
  switch (distinction) {
    case "michelin_1":
      return "1 étoile Michelin"
    case "michelin_2":
      return "2 étoiles Michelin"
    case "michelin_3":
      return "3 étoiles Michelin"
    case "bib_gourmand":
      return "Bib Gourmand"
    case "assiette_michelin":
      return "Assiette Michelin"
    case "bob_repere":
      return "Bob Repère"
    case "bob_flop":
      return "Bob Flop"
    default:
      return ""
  }
}

export function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

export function getBadgeColor(distinction: Restaurant["distinction"]): string {
  switch (distinction) {
    case "michelin_1":
    case "michelin_2":
    case "michelin_3":
      return "bg-yellow-100 text-yellow-800"
    case "bib_gourmand":
      return "bg-red-100 text-red-800"
    case "assiette_michelin":
      return "bg-gray-100 text-gray-800"
    case "bob_repere":
      return "bg-blue-100 text-blue-800"
    case "bob_flop":
      return "bg-orange-100 text-orange-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

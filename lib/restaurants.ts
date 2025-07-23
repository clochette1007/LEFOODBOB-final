export interface Restaurant {
  id: string
  name: string
  address: string
  city: string
  coordinates: {
    lat: number
    lng: number
  }
  distinction:
    | "michelin_1"
    | "michelin_2"
    | "michelin_3"
    | "bib_gourmand"
    | "assiette_michelin"
    | "gault_millau"
    | "bob_repere"
    | "bob_flop"
  cuisine?: string
  description: string
  phone?: string
  website?: string
  priceRange: "€" | "€€" | "€€€" | "€€€€"
  openingHours?: string
  photos?: string[]
}

export const restaurants: Restaurant[] = [
  {
    id: "l-arpege",
    name: "L'Arpège",
    address: "84 Rue de Varenne, 75007 Paris",
    city: "Paris",
    coordinates: { lat: 48.8566, lng: 2.3208 },
    distinction: "michelin_3",
    cuisine: "Française contemporaine",
    description:
      "Restaurant 3 étoiles Michelin d'Alain Passard, spécialisé dans la cuisine végétale de haute gastronomie.",
    phone: "01 47 05 09 06",
    website: "https://www.alain-passard.com",
    priceRange: "€€€€",
    openingHours: "12h00-14h00, 19h30-22h00",
  },
  {
    id: "alleno-paris",
    name: "Alleno Paris",
    address: "8 Avenue Dutuit, 75008 Paris",
    city: "Paris",
    coordinates: { lat: 48.8656, lng: 2.3087 },
    distinction: "michelin_3",
    cuisine: "Française moderne",
    description: "Restaurant 3 étoiles Michelin de Yannick Alléno au Pavillon Ledoyen.",
    phone: "01 53 05 10 00",
    website: "https://www.yannick-alleno.com",
    priceRange: "€€€€",
    openingHours: "12h00-14h00, 19h30-22h00",
  },
  {
    id: "aldehyde",
    name: "Aldehyde",
    address: "8 Rue Saint-Augustin, 75002 Paris",
    city: "Paris",
    coordinates: { lat: 48.8692, lng: 2.3348 },
    distinction: "michelin_1",
    cuisine: "Française créative",
    description: "Restaurant créatif proposant une cuisine française moderne dans un cadre intimiste.",
    phone: "01 42 61 44 09",
    priceRange: "€€€",
    openingHours: "19h00-23h00",
  },
  {
    id: "l-ami-jean",
    name: "L'Ami Jean",
    address: "27 Rue Malar, 75007 Paris",
    city: "Paris",
    coordinates: { lat: 48.858, lng: 2.3065 },
    distinction: "bib_gourmand",
    cuisine: "Bistrot moderne",
    description: "Bistrot convivial proposant une cuisine du Sud-Ouest revisitée.",
    phone: "01 47 05 86 89",
    priceRange: "€€",
    openingHours: "12h00-14h00, 19h00-23h00",
  },
  {
    id: "automne",
    name: "Automne",
    address: "8 Rue Bachaumont, 75002 Paris",
    city: "Paris",
    coordinates: { lat: 48.8665, lng: 2.3456 },
    distinction: "assiette_michelin",
    cuisine: "Française saisonnière",
    description: "Restaurant mettant à l'honneur les produits de saison dans une cuisine française raffinée.",
    phone: "01 42 33 44 55",
    priceRange: "€€€",
    openingHours: "12h00-14h30, 19h00-22h30",
  },
  {
    id: "double",
    name: "Double",
    address: "5 Rue de la Bastille, 75004 Paris",
    city: "Paris",
    coordinates: { lat: 48.8532, lng: 2.3681 },
    distinction: "bob_repere",
    cuisine: "Fusion",
    description: "Concept original proposant une cuisine fusion créative.",
    phone: "01 43 21 98 76",
    priceRange: "€€",
    openingHours: "18h00-01h00",
  },
  {
    id: "via-del-campo",
    name: "Via del Campo",
    address: "12 Rue Monsieur le Prince, 75006 Paris",
    city: "Paris",
    coordinates: { lat: 48.8478, lng: 2.3389 },
    distinction: "bib_gourmand",
    cuisine: "Italienne",
    description: "Trattoria italienne authentique proposant des spécialités de Ligurie.",
    phone: "01 43 26 95 36",
    priceRange: "€€",
    openingHours: "12h00-14h30, 19h00-23h00",
  },
  {
    id: "melt-barbecue",
    name: "Melt Slow Smoked Barbecue",
    address: "15 Rue de la Corderie, 75003 Paris",
    city: "Paris",
    coordinates: { lat: 48.863, lng: 2.3608 },
    distinction: "bob_flop",
    cuisine: "Barbecue américain",
    description: "Restaurant de barbecue américain authentique avec des viandes fumées lentement.",
    phone: "01 42 74 81 19",
    priceRange: "€€",
    openingHours: "18h00-23h00",
  },
]

export function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[àáâãäå]/g, "a")
    .replace(/[èéêë]/g, "e")
    .replace(/[ìíîï]/g, "i")
    .replace(/[òóôõö]/g, "o")
    .replace(/[ùúûü]/g, "u")
    .replace(/[ç]/g, "c")
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

export function getRestaurantBySlug(slug: string): Restaurant | undefined {
  return restaurants.find((restaurant) => createSlug(restaurant.name) === slug)
}

export function searchRestaurants(query: string): Restaurant[] {
  if (!query.trim()) return restaurants

  const searchTerm = query.toLowerCase()
  return restaurants.filter(
    (restaurant) =>
      restaurant.name.toLowerCase().includes(searchTerm) ||
      restaurant.cuisine?.toLowerCase().includes(searchTerm) ||
      restaurant.address.toLowerCase().includes(searchTerm),
  )
}

export function getAutocompleteSuggestions(query: string): string[] {
  if (!query.trim()) return []

  const suggestions = new Set<string>()
  const searchTerm = query.toLowerCase()

  restaurants.forEach((restaurant) => {
    if (restaurant.name.toLowerCase().includes(searchTerm)) {
      suggestions.add(restaurant.name)
    }
    if (restaurant.cuisine?.toLowerCase().includes(searchTerm)) {
      suggestions.add(restaurant.cuisine)
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
    case "gault_millau":
      return ["/Gault_Millau.png"]
    case "bob_repere":
    case "bob_flop":
      return []
    default:
      return []
  }
}

export function getDistinctionText(distinction: Restaurant["distinction"]): string {
  const texts = {
    michelin_1: "1 étoile Michelin",
    michelin_2: "2 étoiles Michelin",
    michelin_3: "3 étoiles Michelin",
    bib_gourmand: "Bib Gourmand",
    assiette_michelin: "Assiette Michelin",
    gault_millau: "Gault & Millau",
    bob_repere: "Bob Repère",
    bob_flop: "Bob Flop",
  }
  return texts[distinction]
}

export function getBadgeColor(distinction: Restaurant["distinction"]): string {
  const colors = {
    michelin_1: "bg-yellow-500",
    michelin_2: "bg-yellow-600",
    michelin_3: "bg-yellow-700",
    bib_gourmand: "bg-red-500",
    assiette_michelin: "bg-gray-500",
    gault_millau: "bg-blue-500",
    bob_repere: "bg-green-500",
    bob_flop: "bg-purple-500",
  }
  return colors[distinction]
}

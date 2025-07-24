export interface Restaurant {
  id: string
  name: string
  cuisine: string
  address: string
  phone?: string
  priceRange: string
  distinctions: string[]
  coordinates?: { lat: number; lng: number }
  photos?: string[]
  description?: string
}

export const restaurants: Restaurant[] = [
  {
    id: "l-arpege",
    name: "L'Arpège",
    cuisine: "Française contemporaine",
    address: "84 Rue de Varenne, 75007 Paris",
    phone: "01 47 05 09 06",
    priceRange: "€€€€",
    distinctions: ["3 étoiles Michelin", "5 toques Gault&Millau"],
    coordinates: { lat: 48.8566, lng: 2.3522 },
    photos: ["/placeholder.jpg"],
    description: "Restaurant gastronomique dirigé par Alain Passard, spécialisé dans la cuisine végétale.",
  },
  {
    id: "l-ami-jean",
    name: "L'Ami Jean",
    cuisine: "Bistrot moderne",
    address: "27 Rue Malar, 75007 Paris",
    phone: "01 47 05 86 89",
    priceRange: "€€€",
    distinctions: ["Bib Gourmand"],
    coordinates: { lat: 48.8584, lng: 2.3048 },
    photos: ["/placeholder.jpg"],
    description: "Bistrot convivial proposant une cuisine du Sud-Ouest revisitée.",
  },
  {
    id: "alleno-paris",
    name: "Alleno Paris",
    cuisine: "Française gastronomique",
    address: "8 Avenue Dutuit, 75008 Paris",
    phone: "01 53 05 10 00",
    priceRange: "€€€€",
    distinctions: ["3 étoiles Michelin"],
    coordinates: { lat: 48.8656, lng: 2.3212 },
    photos: ["/placeholder.jpg"],
    description: "Restaurant gastronomique de Yannick Alléno au Pavillon Ledoyen.",
  },
  {
    id: "aldehyde",
    name: "Aldehyde",
    cuisine: "Française créative",
    address: "8 Rue de l'Isly, 75008 Paris",
    phone: "01 44 63 02 91",
    priceRange: "€€€",
    distinctions: ["1 étoile Michelin"],
    coordinates: { lat: 48.8768, lng: 2.3264 },
    photos: ["/placeholder.jpg"],
    description: "Cuisine créative dans un cadre moderne et élégant.",
  },
  {
    id: "allard",
    name: "Allard",
    cuisine: "Bistrot parisien",
    address: "41 Rue de Saint-André des Arts, 75006 Paris",
    phone: "01 43 26 48 23",
    priceRange: "€€€",
    distinctions: ["Bib Gourmand"],
    coordinates: { lat: 48.8534, lng: 2.3394 },
    photos: ["/placeholder.jpg"],
    description: "Bistrot historique parisien depuis 1932.",
  },
  {
    id: "au-bourguignon-du-marais",
    name: "Au Bourguignon du Marais",
    cuisine: "Française traditionnelle",
    address: "52 Rue François Miron, 75004 Paris",
    phone: "01 48 87 15 40",
    priceRange: "€€",
    distinctions: ["Bib Gourmand"],
    coordinates: { lat: 48.8566, lng: 2.3622 },
    photos: ["/placeholder.jpg"],
    description: "Bistrot authentique spécialisé dans la cuisine bourguignonne.",
  },
  {
    id: "automne",
    name: "Automne",
    cuisine: "Française moderne",
    address: "8 Rue Bachaumont, 75002 Paris",
    phone: "01 40 13 06 95",
    priceRange: "€€€",
    distinctions: ["1 étoile Michelin"],
    coordinates: { lat: 48.8675, lng: 2.3421 },
    photos: ["/placeholder.jpg"],
    description: "Cuisine moderne et créative dans le quartier Montorgueil.",
  },
  {
    id: "brasserie-vendemiaire",
    name: "Brasserie Vendémiaire",
    cuisine: "Brasserie moderne",
    address: "20 Rue de la Sourdière, 75001 Paris",
    phone: "01 42 60 04 06",
    priceRange: "€€",
    distinctions: [],
    coordinates: { lat: 48.8634, lng: 2.3291 },
    photos: ["/placeholder.jpg"],
    description: "Brasserie moderne avec une cuisine de saison.",
  },
  {
    id: "dizen",
    name: "Dizen",
    cuisine: "Française contemporaine",
    address: "14 Rue Mandar, 75002 Paris",
    phone: "01 42 21 95 51",
    priceRange: "€€€",
    distinctions: ["1 étoile Michelin"],
    coordinates: { lat: 48.8668, lng: 2.3445 },
    photos: ["/placeholder.jpg"],
    description: "Cuisine contemporaine raffinée dans un cadre intimiste.",
  },
  {
    id: "double",
    name: "Double",
    cuisine: "Française créative",
    address: "5 Rue de la Bastille, 75004 Paris",
    phone: "01 42 71 40 00",
    priceRange: "€€€",
    distinctions: [],
    coordinates: { lat: 48.8532, lng: 2.3681 },
    photos: ["/placeholder.jpg"],
    description: "Restaurant créatif près de la place de la Bastille.",
  },
]

export function searchRestaurants(query: string): Restaurant[] {
  if (!query.trim()) return restaurants

  const searchTerm = query.toLowerCase().trim()
  return restaurants.filter(
    (restaurant) =>
      restaurant.name.toLowerCase().includes(searchTerm) ||
      restaurant.cuisine.toLowerCase().includes(searchTerm) ||
      restaurant.address.toLowerCase().includes(searchTerm) ||
      restaurant.distinctions.some((distinction) => distinction.toLowerCase().includes(searchTerm)),
  )
}

export function getAutocompleteSuggestions(query: string): string[] {
  if (!query.trim()) return []

  const searchTerm = query.toLowerCase().trim()
  const suggestions = new Set<string>()

  restaurants.forEach((restaurant) => {
    // Noms de restaurants
    if (restaurant.name.toLowerCase().includes(searchTerm)) {
      suggestions.add(restaurant.name)
    }

    // Types de cuisine
    if (restaurant.cuisine.toLowerCase().includes(searchTerm)) {
      suggestions.add(restaurant.cuisine)
    }

    // Distinctions
    restaurant.distinctions.forEach((distinction) => {
      if (distinction.toLowerCase().includes(searchTerm)) {
        suggestions.add(distinction)
      }
    })
  })

  return Array.from(suggestions).slice(0, 5)
}

export function getRestaurantsByCategory(): { [key: string]: Restaurant[] } {
  const categories: { [key: string]: Restaurant[] } = {
    "Étoilés Michelin": [],
    "Bib Gourmand": [],
    "Cuisine française": [],
    Bistrots: [],
  }

  restaurants.forEach((restaurant) => {
    // Étoilés Michelin
    if (restaurant.distinctions.some((d) => d.includes("étoile"))) {
      categories["Étoilés Michelin"].push(restaurant)
    }

    // Bib Gourmand
    if (restaurant.distinctions.some((d) => d.includes("Bib Gourmand"))) {
      categories["Bib Gourmand"].push(restaurant)
    }

    // Cuisine française
    if (restaurant.cuisine.toLowerCase().includes("française")) {
      categories["Cuisine française"].push(restaurant)
    }

    // Bistrots
    if (restaurant.cuisine.toLowerCase().includes("bistrot")) {
      categories["Bistrots"].push(restaurant)
    }
  })

  return categories
}

export function getDistinctionIcon(distinction: string): string {
  if (distinction.includes("3 étoiles")) return "/3toques.jpg"
  if (distinction.includes("2 étoiles")) return "/2toques.jpg"
  if (distinction.includes("1 étoile")) return "/1toque.png"
  if (distinction.includes("Bib Gourmand")) return "/bibgourmand.jpg"
  if (distinction.includes("Gault")) return "/Gault_Millau.png"
  return "/michelin-guide-logo.png"
}

export function getDistinctionText(distinction: string): string {
  return distinction
}

export function getBadgeColor(distinction: string): string {
  if (distinction.includes("3 étoiles")) return "bg-yellow-500"
  if (distinction.includes("2 étoiles")) return "bg-yellow-400"
  if (distinction.includes("1 étoile")) return "bg-yellow-300"
  if (distinction.includes("Bib Gourmand")) return "bg-red-500"
  if (distinction.includes("Gault")) return "bg-blue-500"
  return "bg-gray-500"
}

export function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[àáâãäå]/g, "a")
    .replace(/[èéêë]/g, "e")
    .replace(/[ìíîï]/g, "i")
    .replace(/[òóôõö]/g, "o")
    .replace(/[ùúûü]/g, "u")
    .replace(/[ç]/g, "c")
    .replace(/[^a-z0-9]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

export function getDistinctionIcons(distinctions: string[]): string[] {
  if (!distinctions || !Array.isArray(distinctions)) {
    return []
  }
  return distinctions.map(getDistinctionIcon)
}

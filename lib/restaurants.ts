export interface Restaurant {
  id: string
  name: string
  city: string
  address: string
  priceRange: string
  distinctions: string[]
  lat?: number
  lng?: number
  description?: string
  cuisine?: string
  phone?: string
  website?: string
  openingHours?: string
  photos?: string[]
}

export const restaurants: Restaurant[] = [
  {
    id: "l-arpege",
    name: "L'Arpège",
    city: "7e arrondissement",
    address: "84 Rue de Varenne, 75007 Paris",
    priceRange: "€€€€",
    distinctions: ["michelin-3", "50best"],
    lat: 48.8566,
    lng: 2.3059,
    description: "Restaurant gastronomique d'Alain Passard, spécialisé dans la cuisine végétale de haute volée.",
    cuisine: "Française contemporaine",
    phone: "+33 1 47 05 09 06",
    website: "https://www.alain-passard.com",
    openingHours: "12h00-14h00, 19h30-22h00",
  },
  {
    id: "l-ami-jean",
    name: "L'Ami Jean",
    city: "7e arrondissement",
    address: "27 Rue Malar, 75007 Paris",
    priceRange: "€€€",
    distinctions: ["michelin-bib"],
    lat: 48.8588,
    lng: 2.3047,
    description: "Bistrot basque authentique avec une ambiance chaleureuse et une cuisine généreuse.",
    cuisine: "Basque",
    phone: "+33 1 47 05 86 89",
    openingHours: "12h00-14h00, 19h00-23h00",
  },
  {
    id: "alleno-paris",
    name: "Alleno Paris",
    city: "8e arrondissement",
    address: "8 Avenue Dutuit, 75008 Paris",
    priceRange: "€€€€",
    distinctions: ["michelin-3"],
    lat: 48.8738,
    lng: 2.302,
    description: "Restaurant de Yannick Alléno au Pavillon Ledoyen, temple de la haute gastronomie française.",
    cuisine: "Française moderne",
    phone: "+33 1 53 05 10 00",
    website: "https://www.yannick-alleno.com",
    openingHours: "12h00-14h00, 19h30-22h00",
  },
  {
    id: "adami",
    name: "Adami",
    city: "11e arrondissement",
    address: "8 Rue du Grand Prieuré, 75011 Paris",
    priceRange: "€€€",
    distinctions: ["michelin-1"],
    lat: 48.8594,
    lng: 2.3765,
    description: "Restaurant italien raffiné proposant une cuisine moderne inspirée des traditions transalpines.",
    cuisine: "Italienne moderne",
    phone: "+33 1 43 57 52 88",
    openingHours: "19h30-22h30",
  },
  {
    id: "aldehyde",
    name: "Aldehyde",
    city: "11e arrondissement",
    address: "8 Rue Léon Frot, 75011 Paris",
    priceRange: "€€€",
    distinctions: ["michelin-1"],
    lat: 48.8556,
    lng: 2.3831,
    description: "Restaurant de quartier étoilé proposant une cuisine créative et accessible.",
    cuisine: "Française créative",
    phone: "+33 1 43 72 22 50",
    openingHours: "19h30-22h00",
  },
  {
    id: "allard",
    name: "Allard",
    city: "6e arrondissement",
    address: "41 Rue de Saint-André des Arts, 75006 Paris",
    priceRange: "€€€",
    distinctions: ["michelin-bib"],
    lat: 48.8496,
    lng: 2.3316,
    description: "Bistrot parisien historique servant une cuisine traditionnelle française depuis 1932.",
    cuisine: "Française traditionnelle",
    phone: "+33 1 43 26 40 23",
    openingHours: "12h00-14h30, 19h00-23h00",
  },
  {
    id: "au-bourguignon-du-marais",
    name: "Au Bourguignon du Marais",
    city: "4e arrondissement",
    address: "52 Rue François Miron, 75004 Paris",
    priceRange: "€€",
    distinctions: ["michelin-bib"],
    lat: 48.8566,
    lng: 2.3522,
    description: "Bistrot à vins authentique spécialisé dans la cuisine bourguignonne.",
    cuisine: "Bourguignonne",
    phone: "+33 1 48 87 15 40",
    openingHours: "12h00-15h00, 19h00-23h00",
  },
  {
    id: "automne",
    name: "Automne",
    city: "11e arrondissement",
    address: "13 Rue Basfroi, 75011 Paris",
    priceRange: "€€€",
    distinctions: ["michelin-1"],
    lat: 48.8525,
    lng: 2.3722,
    description: "Restaurant de quartier étoilé proposant une cuisine de saison inventive.",
    cuisine: "Française saisonnière",
    phone: "+33 1 43 67 38 87",
    openingHours: "19h30-22h00",
  },
  {
    id: "brasserie-vendemiaire",
    name: "Brasserie Vendémiaire",
    city: "17e arrondissement",
    address: "20 Rue Tocqueville, 75017 Paris",
    priceRange: "€€",
    distinctions: ["michelin-bib"],
    lat: 48.8848,
    lng: 2.3143,
    description: "Brasserie moderne proposant une cuisine française revisitée dans un cadre contemporain.",
    cuisine: "Française moderne",
    phone: "+33 1 45 22 53 09",
    openingHours: "12h00-14h30, 19h00-22h30",
  },
  {
    id: "dizen",
    name: "Dizen",
    city: "15e arrondissement",
    address: "45 Rue Blomet, 75015 Paris",
    priceRange: "€€€",
    distinctions: ["michelin-1"],
    lat: 48.8422,
    lng: 2.2966,
    description: "Restaurant japonais étoilé proposant une cuisine fusion franco-nippone raffinée.",
    cuisine: "Franco-japonaise",
    phone: "+33 1 45 58 45 95",
    openingHours: "19h30-22h00",
  },
  {
    id: "double",
    name: "Double",
    city: "11e arrondissement",
    address: "5 Rue de la Bastille, 75011 Paris",
    priceRange: "€€€",
    distinctions: ["michelin-1"],
    lat: 48.8533,
    lng: 2.3697,
    description: "Restaurant moderne proposant une cuisine créative dans un décor épuré.",
    cuisine: "Française créative",
    phone: "+33 1 43 67 40 54",
    openingHours: "19h30-22h30",
  },
  {
    id: "janet-by-homer-food-group",
    name: "Janet by Homer Food Group",
    city: "2e arrondissement",
    address: "42 Rue Tiquetonne, 75002 Paris",
    priceRange: "€€€",
    distinctions: ["michelin-1"],
    lat: 48.8697,
    lng: 2.3417,
    description: "Restaurant contemporain proposant une cuisine inventive dans le quartier des Halles.",
    cuisine: "Française contemporaine",
    phone: "+33 1 42 33 93 60",
    openingHours: "19h30-22h00",
  },
  {
    id: "la-datcha",
    name: "La Datcha",
    city: "12e arrondissement",
    address: "9 Rue de Prague, 75012 Paris",
    priceRange: "€€€",
    distinctions: ["michelin-1"],
    lat: 48.8448,
    lng: 2.3776,
    description: "Restaurant slave proposant une cuisine d'Europe de l'Est revisitée avec finesse.",
    cuisine: "Europe de l'Est",
    phone: "+33 1 43 42 93 52",
    openingHours: "19h30-22h00",
  },
  {
    id: "melt-slow-smoked-barbecue",
    name: "Melt Slow Smoked Barbecue",
    city: "3e arrondissement",
    address: "15 Rue de la Corderie, 75003 Paris",
    priceRange: "€€",
    distinctions: ["michelin-bib"],
    lat: 48.863,
    lng: 2.3608,
    description: "Restaurant de barbecue américain authentique avec des viandes fumées lentement.",
    cuisine: "Barbecue américain",
    phone: "+33 1 42 74 81 19",
    openingHours: "18h00-23h00",
  },
  {
    id: "via-del-campo",
    name: "Via del Campo",
    city: "6e arrondissement",
    address: "12 Rue Monsieur le Prince, 75006 Paris",
    priceRange: "€€",
    distinctions: ["michelin-bib"],
    lat: 48.8478,
    lng: 2.3389,
    description: "Trattoria italienne authentique proposant des spécialités de Ligurie.",
    cuisine: "Italienne traditionnelle",
    phone: "+33 1 43 26 95 36",
    openingHours: "12h00-14h30, 19h00-23h00",
  },
  {
    id: "via-emilia",
    name: "Via Emilia",
    city: "14e arrondissement",
    address: "47 Avenue du Maine, 75014 Paris",
    priceRange: "€€",
    distinctions: ["michelin-bib"],
    lat: 48.8338,
    lng: 2.324,
    description: "Restaurant italien familial spécialisé dans la cuisine d'Émilie-Romagne.",
    cuisine: "Italienne régionale",
    phone: "+33 1 43 20 56 96",
    openingHours: "12h00-14h30, 19h30-22h30",
  },
]

// Fonction utilitaire pour rechercher des restaurants
export function searchRestaurants(query: string): Restaurant[] {
  if (!query.trim()) return restaurants

  const searchTerm = query.toLowerCase().trim()

  return restaurants.filter(
    (restaurant) =>
      restaurant.name.toLowerCase().includes(searchTerm) ||
      restaurant.city.toLowerCase().includes(searchTerm) ||
      restaurant.cuisine?.toLowerCase().includes(searchTerm) ||
      restaurant.address.toLowerCase().includes(searchTerm),
  )
}

// Fonction pour obtenir les suggestions d'autocomplétion
export function getAutocompleteSuggestions(
  query: string,
): Array<{ type: "restaurant" | "city" | "cuisine"; value: string; count?: number }> {
  if (!query.trim()) return []

  const searchTerm = query.toLowerCase().trim()
  const suggestions: Array<{ type: "restaurant" | "city" | "cuisine"; value: string; count?: number }> = []

  // Suggestions de restaurants
  restaurants.forEach((restaurant) => {
    if (restaurant.name.toLowerCase().includes(searchTerm)) {
      suggestions.push({
        type: "restaurant",
        value: restaurant.name,
      })
    }
  })

  // Suggestions de villes (arrondissements)
  const cities = [...new Set(restaurants.map((r) => r.city))]
  cities.forEach((city) => {
    if (city.toLowerCase().includes(searchTerm)) {
      const count = restaurants.filter((r) => r.city === city).length
      suggestions.push({
        type: "city",
        value: city,
        count,
      })
    }
  })

  // Suggestions de cuisines
  const cuisines = [...new Set(restaurants.map((r) => r.cuisine).filter(Boolean))]
  cuisines.forEach((cuisine) => {
    if (cuisine!.toLowerCase().includes(searchTerm)) {
      const count = restaurants.filter((r) => r.cuisine === cuisine).length
      suggestions.push({
        type: "cuisine",
        value: cuisine!,
        count,
      })
    }
  })

  return suggestions.slice(0, 8) // Limiter à 8 suggestions
}

// Fonction pour obtenir un restaurant par son ID
export function getRestaurantById(id: string): Restaurant | undefined {
  return restaurants.find((restaurant) => restaurant.id === id)
}

// Fonction pour obtenir un restaurant par son nom (slug)
export function getRestaurantBySlug(slug: string): Restaurant | undefined {
  return restaurants.find((restaurant) => restaurant.name.toLowerCase().replace(/[^a-z0-9]/g, "-") === slug)
}

// Fonction pour obtenir les restaurants par distinction
export function getRestaurantsByDistinction(distinction: string): Restaurant[] {
  return restaurants.filter((restaurant) => restaurant.distinctions.includes(distinction))
}

// Fonction pour obtenir les restaurants par arrondissement
export function getRestaurantsByCity(city: string): Restaurant[] {
  return restaurants.filter((restaurant) => restaurant.city.toLowerCase() === city.toLowerCase())
}

// Fonction pour obtenir les restaurants par gamme de prix
export function getRestaurantsByPriceRange(priceRange: string): Restaurant[] {
  return restaurants.filter((restaurant) => restaurant.priceRange === priceRange)
}

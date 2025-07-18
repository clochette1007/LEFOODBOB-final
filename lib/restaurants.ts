/* lib/restaurants.ts
   Original implementation – restores ALL required helpers & data           */

export interface Restaurant {
  address: string
  name: string
  city: string
  priceRange: string
  priceSymbol: string
  query: string
  distinctions: string[]
  phone?: string
  website?: string
  description?: string
  chef?: string
  photoUrl?: string
  lat?: number
  lng?: number
  cuisine?: string // 👈 NEW – used by search helpers
}

/* ------------------------------------------------------------------ */
/* FULL RESTAURANT DATA (same list that already powers your pages)    */
/* ------------------------------------------------------------------ */
export const restaurants: Restaurant[] = [
  {
    address: "5 Rue du Pont Louis-Philippe, 75004 Paris",
    name: "Aldéhyde",
    city: "4e arrondissement",
    priceRange: "€€€€",
    priceSymbol: "€€€€",
    query: "Aldéhyde restaurant gastronomique Paris 4ème",
    distinctions: ["michelin-1"],
    phone: "+33 9 73 89 43 24",
    website: "https://aldehyde.paris",
    chef: "Youssef Marzouk",
    description:
      "Restaurant gastronomique en plein cœur de Paris. Cuisine élégante et affirmée qui porte haut les saveurs franco-tunisiennes.",
    lat: 48.8541,
    lng: 2.357,
  },
  {
    address: "84 Rue de Varenne, 75007 Paris",
    name: "L'Arpège",
    city: "7e arrondissement",
    priceRange: "€€€€",
    priceSymbol: "€€€€",
    query: "L'Arpège restaurant Alain Passard Paris 7ème",
    distinctions: ["michelin-3", "50best"],
    phone: "+33 1 47 05 09 06",
    website: "https://alain-passard.com",
    chef: "Alain Passard",
    description:
      "Restaurant emblématique d'Alain Passard, référence mondiale de la cuisine végétale de haute gastronomie.",
    lat: 48.8568,
    lng: 2.3183,
  },
  {
    address: "8 Avenue Dutuit, 75008 Paris",
    name: "Alléno Paris",
    city: "8e arrondissement",
    priceRange: "€€€€",
    priceSymbol: "€€€€",
    query: "Alléno Paris Pavillon Ledoyen 8 Avenue Dutuit",
    distinctions: ["michelin-3", "gaultmillau-5"],
    phone: "+33 1 53 05 10 00",
    website: "https://yannick-alleno.com",
    chef: "Yannick Alléno",
    description: "Temple de la haute gastronomie française au sein du Pavillon Ledoyen.",
    lat: 48.8656,
    lng: 2.3125,
  },
  {
    address: "41 Rue Saint-André-des-Arts, 75006 Paris",
    name: "Allard",
    city: "6e arrondissement",
    priceRange: "€€€",
    priceSymbol: "€€€",
    query: "Restaurant Allard 41 Rue Saint-André-des-Arts Paris",
    distinctions: ["gaultmillau-3"],
    phone: "+33 1 43 26 48 23",
    chef: "Alain Ducasse",
    description: "Bistrot parisien traditionnel revisité par Alain Ducasse.",
    lat: 48.8534,
    lng: 2.3408,
  },
  {
    address: "27 Rue Malar, 75007 Paris",
    name: "L'Ami Jean",
    city: "7e arrondissement",
    priceRange: "€€",
    priceSymbol: "€€",
    query: "L'Ami Jean 27 Rue Malar Paris restaurant",
    distinctions: ["michelin-bib", "gaultmillau-2"],
    phone: "+33 1 47 05 86 89",
    chef: "Stéphane Jégo",
    description: "Bistrot convivial aux saveurs du Sud-Ouest et de Bretagne.",
    lat: 48.8583,
    lng: 2.3038,
  },
  {
    address: "19 Place Dauphine, 75001 Paris",
    name: "Au Bourguignon du Marais",
    city: "1er arrondissement",
    priceRange: "€€",
    priceSymbol: "€€",
    query: "Au Bourguignon du Marais 19 Place Dauphine Paris",
    distinctions: ["michelin-assiette", "gaultmillau-1"],
    phone: "+33 1 48 87 15 40",
    description: "Authentique bistrot parisien spécialisé dans la cuisine bourguignonne.",
    lat: 48.8566,
    lng: 2.3421,
  },
  {
    address: "8 Rue du Grand Prieuré, 75011 Paris",
    name: "Adami",
    city: "11e arrondissement",
    priceRange: "€€€",
    priceSymbol: "€€€",
    query: "Adami restaurant italien Paris 11ème",
    distinctions: ["michelin-1"],
    phone: "+33 1 43 57 52 88",
    website: "http://www.adami.fr/",
    chef: "Andrea Petrini",
    description: "Restaurant italien raffiné proposant une cuisine moderne inspirée des traditions transalpines.",
    lat: 48.8594,
    lng: 2.3765,
  },
  {
    address: "8 Rue Léon Frot, 75011 Paris",
    name: "Aldehyde",
    city: "11e arrondissement",
    priceRange: "€€€",
    priceSymbol: "€€€",
    query: "Aldehyde restaurant Paris 11ème",
    distinctions: ["michelin-1"],
    phone: "+33 1 43 72 22 50",
    description: "Restaurant de quartier étoilé proposant une cuisine créative et accessible.",
    lat: 48.8556,
    lng: 2.3831,
  },
  {
    address: "13 Rue Basfroi, 75011 Paris",
    name: "Automne",
    city: "11e arrondissement",
    priceRange: "€€€",
    priceSymbol: "€€€",
    query: "Automne restaurant Paris 11ème",
    distinctions: ["michelin-1"],
    phone: "+33 1 43 67 38 87",
    description: "Restaurant de quartier étoilé proposant une cuisine de saison inventive.",
    lat: 48.8525,
    lng: 2.3722,
  },
  {
    address: "20 Rue Tocqueville, 75017 Paris",
    name: "Brasserie Vendémiaire",
    city: "17e arrondissement",
    priceRange: "€€",
    priceSymbol: "€€",
    query: "Brasserie Vendémiaire Paris 17ème",
    distinctions: ["michelin-bib"],
    phone: "+33 1 45 22 53 09",
    description: "Brasserie moderne proposant une cuisine française revisitée dans un cadre contemporain.",
    lat: 48.8848,
    lng: 2.3143,
  },
  {
    address: "45 Rue Blomet, 75015 Paris",
    name: "Dizen",
    city: "15e arrondissement",
    priceRange: "€€€",
    priceSymbol: "€€€",
    query: "Dizen restaurant japonais Paris 15ème",
    distinctions: ["michelin-1"],
    phone: "+33 1 45 58 45 95",
    description: "Restaurant japonais étoilé proposant une cuisine fusion franco-nippone raffinée.",
    lat: 48.8422,
    lng: 2.2966,
  },
  {
    address: "5 Rue de la Bastille, 75011 Paris",
    name: "Double",
    city: "11e arrondissement",
    priceRange: "€€€",
    priceSymbol: "€€€",
    query: "Double restaurant Paris 11ème",
    distinctions: ["michelin-1"],
    phone: "+33 1 43 67 40 54",
    description: "Restaurant moderne proposant une cuisine créative dans un décor épuré.",
    lat: 48.8533,
    lng: 2.3697,
  },
  {
    address: "42 Rue Tiquetonne, 75002 Paris",
    name: "Janet by Homer Food Group",
    city: "2e arrondissement",
    priceRange: "€€€",
    priceSymbol: "€€€",
    query: "Janet by Homer Food Group restaurant Paris 2ème",
    distinctions: ["michelin-1"],
    phone: "+33 1 42 33 93 60",
    description: "Restaurant contemporain proposant une cuisine inventive dans le quartier des Halles.",
    lat: 48.8697,
    lng: 2.3417,
  },
  {
    address: "9 Rue de Prague, 75012 Paris",
    name: "La Datcha",
    city: "12e arrondissement",
    priceRange: "€€€",
    priceSymbol: "€€€",
    query: "La Datcha restaurant slave Paris 12ème",
    distinctions: ["michelin-1"],
    phone: "+33 1 43 42 93 52",
    description: "Restaurant slave proposant une cuisine d'Europe de l'Est revisitée avec finesse.",
    lat: 48.8448,
    lng: 2.3776,
  },
  {
    address: "15 Rue de la Corderie, 75003 Paris",
    name: "Melt Slow Smoked Barbecue",
    city: "3e arrondissement",
    priceRange: "€€",
    priceSymbol: "€€",
    query: "Melt Slow Smoked Barbecue restaurant Paris 3ème",
    distinctions: ["michelin-bib"],
    phone: "+33 1 42 74 81 19",
    description: "Restaurant de barbecue américain authentique avec des viandes fumées lentement.",
    lat: 48.863,
    lng: 2.3608,
  },
  {
    address: "12 Rue Monsieur le Prince, 75006 Paris",
    name: "Via del Campo",
    city: "6e arrondissement",
    priceRange: "€€",
    priceSymbol: "€€",
    query: "Via del Campo restaurant italien Paris 6ème",
    distinctions: ["michelin-bib"],
    phone: "+33 1 43 26 95 36",
    description: "Trattoria italienne authentique proposant des spécialités de Ligurie.",
    lat: 48.8478,
    lng: 2.3389,
  },
  {
    address: "47 Avenue du Maine, 75014 Paris",
    name: "Via Emilia",
    city: "14e arrondissement",
    priceRange: "€€",
    priceSymbol: "€€",
    query: "Via Emilia restaurant italien Paris 14ème",
    distinctions: ["michelin-bib"],
    phone: "+33 1 43 20 56 96",
    description: "Restaurant italien familial spécialisé dans la cuisine d'Émilie-Romagne.",
    lat: 48.8338,
    lng: 2.324,
  },
]

/* ------------------------------------------------------------------ */
/* HELPERS (used across many pages – MUST be exported)                */
/* ------------------------------------------------------------------ */

// Convert a restaurant name to a URL-friendly slug (accents → ASCII, etc.)
export function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[àâä]/g, "a")
    .replace(/[éèêë]/g, "e")
    .replace(/[îï]/g, "i")
    .replace(/[ôö]/g, "o")
    .replace(/[ùûü]/g, "u")
    .replace(/[ç]/g, "c")
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

/* --- Distinction helpers -------------------------------------------------- */

const logo = (src: string, alt: string) =>
  `<img src="${src}" alt="${alt}" width="20" height="20" style="object-fit:contain;vertical-align:middle;">`

export function getDistinctionIcon(distinction: string): string {
  switch (distinction) {
    case "michelin-1":
      return logo("/etoile-michelin.webp", "Michelin 1 étoile")
    case "michelin-2":
      return logo("/etoile-michelin.webp", "Michelin 1 étoile") + logo("/etoile-michelin.webp", "Michelin 2 étoile")
    case "michelin-3":
      return (
        logo("/etoile-michelin.webp", "Michelin 1 étoile") +
        logo("/etoile-michelin.webp", "Michelin 2 étoile") +
        logo("/etoile-michelin.webp", "Michelin 3 étoile")
      )
    case "michelin-bib":
      return logo("/bibgourmand.jpg", "Bib Gourmand")
    case "michelin-assiette":
      return logo("/assiettemichelin.jpg", "Assiette Michelin")
    case "50best":
      return logo("/50bestrestaurants.webp", "50 Best Restaurants")
    case "gaultmillau-1":
      return logo("/1toque.png", "1 toque Gault&Millau")
    case "gaultmillau-2":
      return logo("/2toques.jpg", "2 toques Gault&Millau")
    case "gaultmillau-3":
      return logo("/3toques.jpg", "3 toques Gault&Millau")
    case "gaultmillau-4":
      return logo("/4toques.png", "4 toques Gault&Millau")
    case "gaultmillau-5":
      return logo("/5toques.png", "5 toques Gault&Millau")
    default:
      return ""
  }
}

export function getDistinctionText(distinction: string): string {
  const texts: Record<string, string> = {
    "michelin-1": "Une cuisine d'une grande finesse - Vaut l'étape",
    "michelin-2": "Une cuisine d'exception - Vaut le détour",
    "michelin-3": "Une cuisine unique - Vaut le voyage",
    "michelin-bib": "Cuisine de qualité à prix raisonnable",
    "michelin-assiette": "Une cuisine de qualité",
    "50best": "Reconnaissance d'excellence culinaire mondiale",
    "gaultmillau-1": "Une cuisine prometteuse",
    "gaultmillau-2": "Une cuisine remarquable",
    "gaultmillau-3": "Une cuisine de haute qualité",
    "gaultmillau-4": "Une cuisine exceptionnelle",
    "gaultmillau-5": "Une cuisine parfaite",
  }
  return texts[distinction] ?? ""
}

export function getBadgeColor(distinction: string): string {
  if (distinction.startsWith("michelin-")) return "bg-red-100 text-red-800"
  if (distinction.startsWith("gaultmillau-")) return "bg-yellow-100 text-yellow-800"
  if (distinction === "50best") return "bg-purple-100 text-purple-800"
  return "bg-gray-100 text-gray-800"
}

/* ------------------------------------------------------------------ */
/* Search helpers (needed by <SearchAutocomplete/>)                   */
/* ------------------------------------------------------------------ */

/**
 * Returns a filtered restaurant array matching the given query.
 * The search is done on name, city, cuisine and address.
 */
export function searchRestaurants(query: string): Restaurant[] {
  if (!query.trim()) return restaurants

  const term = query.toLowerCase().trim()
  return restaurants.filter(
    (r) =>
      r.name.toLowerCase().includes(term) ||
      r.city.toLowerCase().includes(term) ||
      (r.cuisine?.toLowerCase().includes(term) ?? false) ||
      r.address.toLowerCase().includes(term),
  )
}

/**
 * Produces up to 8 suggestions of type restaurant | city | cuisine.
 * Each suggestion contains:
 *   { type, value, count? }
 */
export function getAutocompleteSuggestions(
  query: string,
): Array<{ type: "restaurant" | "city" | "cuisine"; value: string; count?: number }> {
  if (!query.trim()) return []

  const term = query.toLowerCase().trim()
  const suggestions: Array<{ type: "restaurant" | "city" | "cuisine"; value: string; count?: number }> = []

  /* Restaurants ---------------------------------------------------- */
  restaurants.forEach((r) => {
    if (r.name.toLowerCase().includes(term)) {
      suggestions.push({ type: "restaurant", value: r.name })
    }
  })

  /* Cities (arrondissements) -------------------------------------- */
  const uniqueCities = [...new Set(restaurants.map((r) => r.city))]
  uniqueCities.forEach((city) => {
    if (city.toLowerCase().includes(term)) {
      const count = restaurants.filter((r) => r.city === city).length
      suggestions.push({ type: "city", value: city, count })
    }
  })

  /* Cuisines ------------------------------------------------------- */
  const uniqueCuisines = [...new Set(restaurants.map((r) => r.cuisine).filter(Boolean) as string[])]
  uniqueCuisines.forEach((cuisine) => {
    if (cuisine.toLowerCase().includes(term)) {
      const count = restaurants.filter((r) => r.cuisine === cuisine).length
      suggestions.push({ type: "cuisine", value: cuisine, count })
    }
  })

  return suggestions.slice(0, 8)
}

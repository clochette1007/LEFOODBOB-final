export interface Restaurant {
  address: string
  name: string
  city: string
  priceRange: string
  query: string
  distinctions: string[]
  phone?: string
  website?: string
  description?: string
  chef?: string
  photoUrl?: string
  lat?: number
  lng?: number
  priceSymbol?: string
}

export const restaurants: Restaurant[] = [
  {
    address: "5 Rue du Pont Louis-Philippe, 75004 Paris",
    name: "Aldéhyde",
    city: "4e arrondissement",
    priceRange: "€€€€",
    priceSymbol: "€€€€",
    query: "Restaurant Aldéhyde Paris",
    distinctions: ["michelin-1"],
    phone: "+33 9 73 89 43 24",
    website: "https://aldehyde.paris",
    chef: "Youssef Marzouk",
    description: "Restaurant gastronomique en plein cœur de Paris. Cuisine élégante et affirmée qui porte haut les saveurs franco-tunisiennes.",
    photoUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    lat: 48.8541,
    lng: 2.3570
  },
  {
    address: "84 Rue de Varenne, 75007 Paris",
    name: "L'Arpège",
    city: "7e arrondissement",
    priceRange: "€€€€",
    priceSymbol: "€€€€",
    query: "L'Arpège Alain Passard Paris",
    distinctions: ["michelin-3", "50best"],
    phone: "+33 1 47 05 09 06",
    website: "https://alain-passard.com",
    chef: "Alain Passard",
    description: "Restaurant emblématique d'Alain Passard, référence mondiale de la cuisine végétale de haute gastronomie.",
    photoUrl: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    lat: 48.8568,
    lng: 2.3183
  },
  {
    address: "8 Avenue Dutuit, 75008 Paris",
    name: "Alléno Paris",
    city: "8e arrondissement",
    priceRange: "€€€€",
    priceSymbol: "€€€€",
    query: "Alléno Paris Pavillon Ledoyen",
    distinctions: ["michelin-3", "gaultmillau-5"],
    phone: "+33 1 53 05 10 00",
    website: "https://yannick-alleno.com",
    chef: "Yannick Alléno",
    description: "Temple de la haute gastronomie française au sein du Pavillon Ledoyen.",
    photoUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    lat: 48.8656,
    lng: 2.3125
  },
  {
    address: "41 Rue Saint-André-des-Arts, 75006 Paris",
    name: "Allard",
    city: "6e arrondissement",
    priceRange: "€€€",
    priceSymbol: "€€€",
    query: "Restaurant Allard Paris Ducasse",
    distinctions: ["gaultmillau-3"],
    phone: "+33 1 43 26 48 23",
    chef: "Alain Ducasse",
    description: "Bistrot parisien traditionnel revisité par Alain Ducasse.",
    photoUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    lat: 48.8534,
    lng: 2.3408
  },
  {
    address: "27 Rue Malar, 75007 Paris",
    name: "L'Ami Jean",
    city: "7e arrondissement",
    priceRange: "€€",
    priceSymbol: "€€",
    query: "L'Ami Jean Paris",
    distinctions: ["michelin-bib", "gaultmillau-2"],
    phone: "+33 1 47 05 86 89",
    chef: "Stéphane Jégo",
    description: "Bistrot convivial aux saveurs du Sud-Ouest et de Bretagne.",
    photoUrl: "https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    lat: 48.8583,
    lng: 2.3038
  },
  {
    address: "19 Place Dauphine, 75001 Paris",
    name: "Au Bourguignon du Marais",
    city: "1er arrondissement",
    priceRange: "€€",
    priceSymbol: "€€",
    query: "Au Bourguignon du Marais Paris",
    distinctions: ["michelin-assiette", "gaultmillau-1"],
    phone: "+33 1 48 87 15 40",
    description: "Authentique bistrot parisien spécialisé dans la cuisine bourguignonne.",
    photoUrl: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    lat: 48.8566,
    lng: 2.3421
  },
]

// Fonction pour convertir le nom en slug
export function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[àâä]/g, 'a')
    .replace(/[éèêë]/g, 'e')
    .replace(/[îï]/g, 'i')
    .replace(/[ôö]/g, 'o')
    .replace(/[ùûü]/g, 'u')
    .replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

// Fonction pour obtenir les icônes des distinctions
export const getDistinctionIcon = (distinction: string) => {
  switch(distinction) {
    case "michelin-1": return "⭐"
    case "michelin-2": return "⭐⭐"
    case "michelin-3": return "⭐⭐⭐"
    case "michelin-bib": return "😋"
    case "michelin-assiette": return "🍽️"
    case "50best": return "⚫"
    case "gaultmillau-1": return "★"
    case "gaultmillau-2": return "★★"
    case "gaultmillau-3": return "★★★"
    case "gaultmillau-4": return "★★★★"
    case "gaultmillau-5": return "★★★★★"
    default: return ""
  }
}

// Fonction pour obtenir le texte des distinctions
export const getDistinctionText = (distinction: string) => {
  const texts = {
    "michelin-1": "Michelin",
    "michelin-2": "Michelin",
    "michelin-3": "Michelin",
    "michelin-bib": "Bib Gourmand",
    "michelin-assiette": "Assiette Michelin",
    "50best": "50 Best",
    "gaultmillau-1": "1 toque",
    "gaultmillau-2": "2 toques",
    "gaultmillau-3": "3 toques",
    "gaultmillau-4": "4 toques",
    "gaultmillau-5": "5 toques",
  }
  return texts[distinction as keyof typeof texts] || ""
}

// Fonction pour obtenir la couleur de badge
export const getBadgeColor = (distinction: string) => {
  if (distinction.startsWith('michelin-')) return "bg-red-100 text-red-800"
  if (distinction.startsWith('gaultmillau-')) return "bg-yellow-100 text-yellow-800"
  if (distinction === '50best') return "bg-purple-100 text-purple-800"
  return "bg-gray-100 text-gray-800"
} 
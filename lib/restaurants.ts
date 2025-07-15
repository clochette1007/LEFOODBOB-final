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



// Fonction pour obtenir les icônes des distinctions (pour InfoWindows HTML)
export const getDistinctionIcon = (distinction: string) => {
  const logoSize = 'width="20" height="20" style="object-fit: contain; vertical-align: middle;"'
  
  switch(distinction) {
    case "michelin-1": 
      return `<img src="/etoile-michelin.webp" alt="Michelin 1 étoile" ${logoSize}>`
    case "michelin-2": 
      return `<img src="/etoile-michelin.webp" alt="Michelin 1 étoile" ${logoSize}><img src="/etoile-michelin.webp" alt="Michelin 2 étoile" ${logoSize}>`
    case "michelin-3": 
      return `<img src="/etoile-michelin.webp" alt="Michelin 1 étoile" ${logoSize}><img src="/etoile-michelin.webp" alt="Michelin 2 étoile" ${logoSize}><img src="/etoile-michelin.webp" alt="Michelin 3 étoile" ${logoSize}>`
    case "michelin-bib": 
      return `<img src="/bibgourmand.jpg" alt="Bib Gourmand" ${logoSize}>`
    case "michelin-assiette": 
      return `<img src="/assiettemichelin.jpg" alt="Assiette Michelin" ${logoSize}>`
    case "50best": 
      return `<img src="/50bestrestaurants.webp" alt="50 Best Restaurants" ${logoSize}>`
    case "gaultmillau-1": 
      return `<img src="/1toque.png" alt="1 toque Gault&Millau" ${logoSize}>`
    case "gaultmillau-2": 
      return `<img src="/2toques.jpg" alt="2 toques Gault&Millau" ${logoSize}>`
    case "gaultmillau-3": 
      return `<img src="/3toques.jpg" alt="3 toques Gault&Millau" ${logoSize}>`
    case "gaultmillau-4": 
      return `<img src="/4toques.png" alt="4 toques Gault&Millau" ${logoSize}>`
    case "gaultmillau-5": 
      return `<img src="/5toques.png" alt="5 toques Gault&Millau" ${logoSize}>`
    default: return ""
  }
}

// Fonction pour obtenir le texte des distinctions
export const getDistinctionText = (distinction: string) => {
  const texts = {
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
  return texts[distinction as keyof typeof texts] || ""
}

// Fonction pour obtenir la couleur de badge
export const getBadgeColor = (distinction: string) => {
  if (distinction.startsWith('michelin-')) return "bg-red-100 text-red-800"
  if (distinction.startsWith('gaultmillau-')) return "bg-yellow-100 text-yellow-800"
  if (distinction === '50best') return "bg-purple-100 text-purple-800"
  return "bg-gray-100 text-gray-800"
} 
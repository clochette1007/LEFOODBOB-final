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
    query: "Restaurant Aldéhyde 5 Rue du Pont Louis-Philippe Paris",
    distinctions: ["michelin-1"],
    phone: "+33 9 73 89 43 24",
    website: "https://aldehyde.paris",
    chef: "Youssef Marzouk",
    description: "Restaurant gastronomique en plein cœur de Paris. Cuisine élégante et affirmée qui porte haut les saveurs franco-tunisiennes.",
    lat: 48.8541,
    lng: 2.3570
  },
  {
    address: "84 Rue de Varenne, 75007 Paris",
    name: "L'Arpège",
    city: "7e arrondissement",
    priceRange: "€€€€",
    priceSymbol: "€€€€",
    query: "L'Arpège 84 Rue de Varenne Paris Alain Passard",
    distinctions: ["michelin-3", "50best"],
    phone: "+33 1 47 05 09 06",
    website: "https://alain-passard.com",
    chef: "Alain Passard",
    description: "Restaurant emblématique d'Alain Passard, référence mondiale de la cuisine végétale de haute gastronomie.",
    lat: 48.8568,
    lng: 2.3183
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
    lng: 2.3125
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
    lng: 2.3408
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
    lng: 2.3038
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
    lng: 2.3421
  },
  {
    address: "87 rue Lamarck, 75018 Paris",
    name: "Double",
    city: "18e arrondissement",
    priceRange: "€€€",
    priceSymbol: "€€€",
    query: "Double restaurant 87 rue Lamarck Paris Montmartre",
    distinctions: [],
    description: "Restaurant gastronomique situé dans le quartier de Montmartre, offrant une cuisine moderne et créative.",
    lat: 48.8897,
    lng: 2.3387
  },
  {
    address: "11 rue Richard Lenoir, 75011 Paris",
    name: "Automne",
    city: "11e arrondissement",
    priceRange: "€€€",
    priceSymbol: "€€€",
    query: "Automne restaurant 11 rue Richard Lenoir Paris",
    distinctions: [],
    description: "Restaurant de saison proposant une cuisine contemporaine inspirée par les produits de saison.",
    lat: 48.8607,
    lng: 2.3677
  },
  {
    address: "19 bis rue Pierre Fontaine, 75009 Paris",
    name: "Adami",
    city: "9e arrondissement",
    priceRange: "€€",
    priceSymbol: "€€",
    query: "Adami restaurant 19 bis rue Pierre Fontaine Paris",
    distinctions: [],
    description: "Restaurant convivial dans le 9e arrondissement proposant une cuisine méditerranéenne authentique.",
    lat: 48.8817,
    lng: 2.3355
  },
  {
    address: "62 rue Jean-Pierre Timbaud, 75011 Paris",
    name: "La Datcha",
    city: "11e arrondissement",
    priceRange: "€€",
    priceSymbol: "€€",
    query: "La Datcha restaurant 62 rue Jean-Pierre Timbaud Paris",
    distinctions: [],
    description: "Restaurant chaleureux proposant une cuisine de l'Est européenne dans une ambiance décontractée.",
    lat: 48.8672,
    lng: 2.3703
  },
  {
    address: "22 rue La Bruyère, 75009 Paris",
    name: "Via Emilia",
    city: "9e arrondissement",
    priceRange: "€€",
    priceSymbol: "€€",
    query: "Via Emilia restaurant italien 22 rue La Bruyère Paris",
    distinctions: [],
    description: "Authentique restaurant italien spécialisé dans la cuisine de l'Émilie-Romagne.",
    lat: 48.8779,
    lng: 2.3337
  },
  {
    address: "54 Bd de la Tour-Maubourg, 75007 Paris",
    name: "Brasserie Vendémiaire",
    city: "7e arrondissement",
    priceRange: "€€",
    priceSymbol: "€€",
    query: "Brasserie Vendémiaire 54 Boulevard Tour-Maubourg Paris",
    distinctions: [],
    description: "Brasserie traditionnelle parisienne proposant une cuisine française classique dans un cadre élégant.",
    lat: 48.8572,
    lng: 2.3067
  },
  {
    address: "22 rue du Champ de Mars, 75007 Paris",
    name: "Via Del Campo",
    city: "7e arrondissement",
    priceRange: "€€",
    priceSymbol: "€€",
    query: "Via Del Campo restaurant italien 22 rue Champ de Mars Paris",
    distinctions: [],
    description: "Restaurant italien authentique près de la Tour Eiffel, spécialisé dans la cuisine traditionnelle.",
    lat: 48.8566,
    lng: 2.3020
  },
  {
    address: "13 rue Rambuteau, 75004 Paris",
    name: "Janet by Homer Food Group",
    city: "4e arrondissement",
    priceRange: "€€",
    priceSymbol: "€€",
    query: "Janet by Homer Food Group pastrami sandwich 13 rue Rambuteau Paris",
    distinctions: [],
    description: "Deli américain réputé pour ses sandwichs au pastrami et corned beef, par le groupe Homer Food.",
    lat: 48.8608,
    lng: 2.3525
  },
  {
    address: "27 rue Pierre Fontaine, 75009 Paris",
    name: "Dizen",
    city: "9e arrondissement",
    priceRange: "€",
    priceSymbol: "€",
    query: "Dizen street food sabich pita 27 rue Pierre Fontaine Paris",
    distinctions: [],
    description: "Street food israélien spécialisé dans le sabich, sandwich pita traditionnel de Tel Aviv.",
    lat: 48.8817,
    lng: 2.3355
  },
  {
    address: "25 rue des Batignolles, 75017 Paris",
    name: "Melt Slow Smoked Barbecue",
    city: "17e arrondissement",
    priceRange: "€€",
    priceSymbol: "€€",
    query: "Melt Slow Smoked Barbecue brisket pulled pork Paris Batignolles",
    distinctions: [],
    description: "Authentique barbecue texan à Paris. Viandes fumées lentement, brisket fondant et pulled pork savoureux.",
    lat: 48.8848,
    lng: 2.3198
  }
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
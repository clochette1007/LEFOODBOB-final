import MobileNav from "../components/mobile-nav"
import Image from "next/image"

export default function Page() {
  return (
    <div className="min-h-screen bg-[#faf9f6] pb-24">
      {/* Header */}
      <header className="pt-6 px-4 md:px-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Restaurants</h1>
      </header>

      {/* Barre de recherche */}
      <div className="px-4 md:px-8 mt-2">
        <input
          type="text"
          placeholder="Rechercher dans le Guide MICHELIN"
          className="w-full rounded-xl border border-gray-200 py-3 px-4 text-base md:text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white placeholder-gray-400"
        />
      </div>

      {/* Section Autour de moi */}
      <section className="mt-8 px-4 md:px-8">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl md:text-2xl font-semibold">Autour de moi</h2>
          <a href="#" className="text-sm text-blue-700 font-medium hover:underline">Tout Voir</a>
        </div>
        <div className="rounded-2xl overflow-hidden shadow border border-gray-200">
          {/* Remplace par ta vraie carte Google ou Apple Maps ici */}
          <Image src="/carte-michelin-demo.png" alt="Carte" width={600} height={300} className="w-full h-48 md:h-64 object-cover" />
        </div>
      </section>

      {/* Section Favoris */}
      <section className="mt-10 px-4 md:px-8">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl md:text-2xl font-semibold">Mes favoris</h2>
          <a href="#" className="text-sm text-blue-700 font-medium hover:underline">Découvrir la liste</a>
        </div>
        {/* Carrousel horizontal de cartes restaurant */}
        <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
          {/* Exemple de carte restaurant */}
          <div className="min-w-[220px] bg-white rounded-2xl shadow border border-gray-200 overflow-hidden flex-shrink-0">
            <Image src="/demo-restaurant-1.jpg" alt="Christophe Hay" width={220} height={120} className="w-full h-28 object-cover" />
            <div className="p-4">
              <div className="flex items-center gap-1 mb-1">
                <Image src="/etoile-michelin.webp" alt="Michelin" width={18} height={18} />
                <Image src="/etoile-michelin.webp" alt="Michelin" width={18} height={18} />
                <span className="text-green-600 text-lg font-bold ml-1">🌱</span>
              </div>
              <div className="font-semibold text-lg">Christophe Hay</div>
              <div className="text-gray-500 text-sm">Paris</div>
              <div className="text-gray-500 text-sm">€€€ • Cuisine moderne</div>
            </div>
          </div>
          <div className="min-w-[220px] bg-white rounded-2xl shadow border border-gray-200 overflow-hidden flex-shrink-0">
            <Image src="/demo-restaurant-2.jpg" alt="La Côte Saint-Jacques" width={220} height={120} className="w-full h-28 object-cover" />
            <div className="p-4">
              <div className="flex items-center gap-1 mb-1">
                <Image src="/etoile-michelin.webp" alt="Michelin" width={18} height={18} />
                <Image src="/etoile-michelin.webp" alt="Michelin" width={18} height={18} />
                <span className="text-green-600 text-lg font-bold ml-1">🌱</span>
              </div>
              <div className="font-semibold text-lg">La Côte Saint-Jacques</div>
              <div className="text-gray-500 text-sm">Paris</div>
              <div className="text-gray-500 text-sm">€€€ • Cuisine moderne</div>
            </div>
          </div>
          {/* Ajoute d'autres cartes ici */}
        </div>
      </section>

      {/* Barre de navigation mobile */}
      <MobileNav />
    </div>
  )
}

import Link from 'next/link'

export default function LAmiJeanPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec bouton retour */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
              ← Retour
            </Link>
            <h1 className="text-xl font-semibold text-gray-900">L'Ami Jean</h1>
            <div className="w-16"></div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Photo de couverture */}
        <div className="w-full h-80 rounded-xl overflow-hidden mb-6">
          <img
            src="https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            alt="L'Ami Jean"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Informations principales */}
        <div className="bg-white rounded-xl p-6 mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">L'Ami Jean</h2>
          
          {/* Adresse */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Adresse</h3>
            <p className="text-gray-700">109 Rue du Bac, 75007 Paris</p>
          </div>

          {/* Distinctions */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Distinctions</h3>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-red-100 text-red-800">
                <span>😋</span>
                Bib Gourmand
              </span>
              <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-yellow-100 text-yellow-800">
                <span>★★</span>
                2 toques
              </span>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Contact</h3>
            
            <div className="flex items-center gap-3">
              <span className="text-gray-500">📞</span>
              <a href="tel:+33147058689" className="text-blue-600 hover:underline">
                +33 1 47 05 86 89
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
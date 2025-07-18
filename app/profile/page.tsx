'use client'

import Link from 'next/link'

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
              ← Retour
            </Link>
            <h1 className="text-xl font-semibold text-gray-900">Mon Profil</h1>
            <div className="w-16"></div>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl p-6 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl">👤</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Bob Explorer</h2>
            <p className="text-gray-600">Découvreur de bons restaurants</p>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">🍽️ Restaurants visités</h3>
              <p className="text-blue-700">3 restaurants découverts</p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">⭐ Favoris</h3>
              <p className="text-green-700">2 restaurants favoris</p>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="font-semibold text-purple-900 mb-2">🏆 Distinctions découvertes</h3>
              <p className="text-purple-700">5 étoiles Michelin trouvées</p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Fonctionnalité bientôt disponible</strong><br/>
              Créez votre profil et suivez vos découvertes culinaires !
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

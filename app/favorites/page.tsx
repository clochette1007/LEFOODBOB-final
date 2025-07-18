'use client'

import Link from 'next/link'
import { Heart } from 'lucide-react'

export default function FavoritesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
              ← Retour
            </Link>
            <h1 className="text-xl font-semibold text-gray-900">Mes Favoris</h1>
            <div className="w-16"></div>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl p-6 text-center">
          <div className="mb-6">
            <Heart className="w-16 h-16 text-red-200 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Vos Favoris</h2>
            <p className="text-gray-600">Retrouvez ici tous vos restaurants préférés</p>
          </div>

          <div className="space-y-4">
            <div className="bg-red-50 rounded-lg p-6">
              <h3 className="font-semibold text-red-900 mb-2">❤️ Aucun favori pour le moment</h3>
              <p className="text-red-700 mb-4">
                Explorez les restaurants sur la carte et ajoutez-les à vos favoris !
              </p>
              <Link 
                href="/" 
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Découvrir des restaurants
              </Link>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">💡 Astuce</h3>
              <p className="text-blue-700 text-sm">
                Cliquez sur le cœur ❤️ à côté d'un restaurant pour l'ajouter à vos favoris
              </p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Fonctionnalité bientôt disponible</strong><br/>
              Sauvegardez et organisez vos restaurants préférés !
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

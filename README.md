# 🍽️ LEFOODBOB - Restaurant Discovery Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-blue)](https://tailwindcss.com/)

Une plateforme interactive pour découvrir les meilleurs restaurants de Paris avec carte interactive, photos Google Places, et distinctions gastronomiques.

## 🚀 Déploiement

**Site en ligne :** [https://lefoodbob.vercel.app](https://lefoodbob.vercel.app)  
**Repository :** [GitHub - clochette1007/LEFOODBOB-final](https://github.com/clochette1007/LEFOODBOB-final)

## ✅ Corrections Apportées

### 🔧 Problèmes Corrigés

1. **📸 Photos des restaurants** - CORRIGÉ ✅
   - Fiches détaillées utilisent maintenant le même système de photos que les miniatures
   - Intégration Google Places API pour récupérer les photos en temps réel
   - Fallback intelligent en cas d'échec

2. **🔒 Configuration sécurisée** - CORRIGÉ ✅
   - Suppression des flags dangereux `ignoreBuildErrors` et `ignoreDuringBuilds`
   - Configuration Next.js sécurisée avec patterns d'images
   - Variables d'environnement correctement configurées

3. **📱 Navigation mobile** - CORRIGÉ ✅
   - Création des pages `/profile` et `/favorites`
   - Navigation mobile fonctionnelle sans erreurs 404
   - Design cohérent avec le reste de l'application

4. **🧹 Nettoyage projet** - CORRIGÉ ✅
   - Suppression du fichier inutile `bobflop.png`
   - Code optimisé et unifié
   - Documentation complète ajoutée

## 🛠️ Installation

### Prérequis

- **Node.js >= 20.0.0** (requis pour Next.js 15)
- **npm** ou **pnpm**
- **Clé API Google Maps** avec Places API activée

### 1. Installation de Node.js 20

```bash
# Installer Node.js 20 via site officiel
# Ou avec nvm (si installé) :
nvm install 20
nvm use 20
```

### 2. Installation des dépendances

```bash
npm install
# ou
pnpm install
```

### 3. Configuration des variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=votre_cle_api_google_maps_ici
```

📋 **Voir [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) pour les instructions détaillées**

### 4. Lancement du serveur de développement

```bash
npm run dev
# ou
pnpm dev
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000)

## 🏗️ Build et Déploiement

```bash
# Build de production
npm run build

# Démarrage du serveur de production
npm start
```

## 🗂️ Structure du Projet

```
lefoodbob/
├── app/                    # Pages Next.js 15 (App Router)
│   ├── aldehyde/          # Page restaurant Aldéhyde
│   ├── allard/            # Page restaurant Allard
│   ├── alleno-paris/      # Page restaurant Alléno Paris
│   ├── au-bourguignon-du-marais/  # Page restaurant Au Bourguignon du Marais
│   ├── favorites/         # Page favoris (nouvellement créée)
│   ├── l-ami-jean/        # Page restaurant L'Ami Jean
│   ├── l-arpege/          # Page restaurant L'Arpège
│   ├── profile/           # Page profil (nouvellement créée)
│   ├── restaurant/[slug]/ # Page restaurant dynamique
│   ├── restaurants/       # Liste des restaurants
│   └── layout.tsx         # Layout principal
├── components/            # Composants réutilisables
│   ├── ui/               # Composants UI (shadcn/ui)
│   ├── admin-panel.tsx   # Panel d'administration
│   ├── mobile-nav.tsx    # Navigation mobile
│   ├── restaurant-map.tsx # Carte interactive
│   └── restaurant-photo-carousel.tsx # Carousel photos (corrigé)
├── lib/                  # Utilitaires et données
│   ├── restaurants.ts    # Base de données restaurants
│   └── utils.ts         # Fonctions utilitaires
├── hooks/               # Hooks personnalisés
│   └── use-google-places-photos.ts # Hook photos Google Places
├── public/              # Assets statiques
│   ├── bob_logo.png     # Logo de l'application
│   ├── bobrepere.png    # Marqueur de carte
│   └── [distinctions]   # Logos des distinctions gastronomiques
└── styles/              # Styles CSS
    └── globals.css      # Styles globaux
```

## 🏆 Fonctionnalités

### ✨ Principales
- **Carte interactive** avec restaurants géolocalisés
- **Photos en temps réel** via Google Places API
- **Distinctions gastronomiques** (Michelin, Gault&Millau, 50 Best)
- **Pages détaillées** pour chaque restaurant
- **Navigation mobile** optimisée
- **Recherche et filtrage** des restaurants

### 🔍 Recherche
- Recherche par nom de restaurant
- Filtrage par ville/arrondissement
- Autocomplete intelligent

### 🗺️ Carte
- Géolocalisation utilisateur
- Marqueurs personnalisés
- InfoWindows avec photos
- Zoom et navigation fluides

### 📱 Mobile
- Design responsive
- Navigation mobile dédiée
- Optimisé pour les écrans tactiles

## 🎯 Restaurants Inclus

1. **Aldéhyde** - 1 étoile Michelin
2. **L'Arpège** - 3 étoiles Michelin + 50 Best
3. **Alléno Paris** - 3 étoiles Michelin + 5 toques G&M
4. **Allard** - 3 toques Gault&Millau
5. **L'Ami Jean** - Bib Gourmand + 2 toques G&M
6. **Au Bourguignon du Marais** - Assiette Michelin + 1 toque G&M

## 🔧 APIs Utilisées

- **Google Maps JavaScript API** - Carte interactive
- **Google Places API** - Photos et informations restaurants
- **Google Geocoding API** - Géolocalisation des adresses

## 🚀 Technologies

- **Next.js 15** - Framework React full-stack
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS utilitaire
- **React 19** - Bibliothèque UI
- **Google Maps API** - Cartographie et géolocalisation
- **Lucide React** - Icônes
- **shadcn/ui** - Composants UI

## 📈 Performances

- ⚡ **Optimisation Next.js 15** avec App Router
- 🖼️ **Images optimisées** avec Next.js Image
- 📱 **Responsive design** mobile-first
- 🚀 **Déploiement Vercel** avec CDN mondial

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/amazing-feature`)
3. Commitez vos changements (`git commit -m 'Add amazing feature'`)
4. Push sur la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request

## 📝 License

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🆘 Support

- 📧 **Issues GitHub** : [Signaler un problème](https://github.com/clochette1007/LEFOODBOB-final/issues)
- 📖 **Documentation** : [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md)
- 🔧 **Setup Google Maps** : [GOOGLE_MAPS_SETUP.md](./GOOGLE_MAPS_SETUP.md)

---

**Développé avec ❤️ par l'équipe LEFOODBOB** 
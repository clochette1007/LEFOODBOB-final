# Configuration Google Maps API

## Problème actuel
Les photos des restaurants ne se chargent pas correctement car l'API Google Maps n'est pas configurée correctement.

## Solution

### 1. Obtenir une clé API Google Maps
1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez les APIs suivantes :
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. Créez une clé API dans "Credentials"

### 2. Configurer la clé API
Créez un fichier `.env.local` à la racine du projet :

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=votre_clé_api_ici
```

### 3. Redémarrer le serveur
```bash
npm run dev
```

## Clé API actuelle
La clé API actuelle (`AIzaSyCcfMwhQwKmsAnRYfQCtYKsWpB4EI3NIq4`) semble ne pas être valide ou ne pas avoir les bonnes permissions.

## Fallback
En cas d'erreur, le système affiche maintenant une photo générique au lieu d'un message d'erreur. 
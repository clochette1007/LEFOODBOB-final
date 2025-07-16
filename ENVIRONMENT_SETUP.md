# Configuration des Variables d'Environnement - LEFOODBOB

## Variables nécessaires

Pour que l'application fonctionne correctement, vous devez configurer les variables d'environnement suivantes :

### 1. Google Maps API Key

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=votre_cle_api_google_maps_ici
```

#### Comment obtenir votre clé API Google Maps :

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez les APIs suivantes :
   - **Maps JavaScript API**
   - **Places API** 
   - **Geocoding API**
4. Créez une clé API dans "Identifiants"
5. Configurez les restrictions :
   - **Restriction d'application** : Sites web
   - **Restriction d'API** : Maps JavaScript API, Places API, Geocoding API
   - **Domaines autorisés** : `localhost`, `*.vercel.app`, votre domaine

## Configuration

1. Créez un fichier `.env.local` à la racine du projet
2. Ajoutez votre clé API :

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyC4l2J9X8hKp5eQ2vN9mR7tY6uI8oP3qW1
```

⚠️ **Sécurité importante** : Ne commitez jamais votre clé API dans le repository Git !

## Déploiement sur Vercel

1. Allez dans les paramètres de votre projet Vercel
2. Ajoutez la variable d'environnement `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
3. Redéployez votre application

## Problèmes fréquents

- **Photos ne s'affichent pas** : Vérifiez que Places API est activée
- **Carte ne charge pas** : Vérifiez que Maps JavaScript API est activée  
- **Erreur de géocodage** : Vérifiez que Geocoding API est activée
- **Quota dépassé** : Vérifiez vos quotas dans Google Cloud Console 
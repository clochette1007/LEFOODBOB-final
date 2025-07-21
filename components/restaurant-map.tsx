"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Loader } from "@googlemaps/js-api-loader"
import { restaurants as defaultRestaurants, type Restaurant } from "@/lib/restaurants"

// IMPORTANT : Ajoutez ces lignes si votre type Restaurant ne les a pas déjà.
// Ces propriétés sont utilisées dans le code pour afficher les marqueurs et distinctions.
declare module '@/lib/restaurants' {
  interface Restaurant {
    distinctions?: string[];
    lat?: number;
    lng?: number;
  }
}


interface RestaurantMapProps {
  restaurants?: Restaurant[]
}

export default function RestaurantMap({ restaurants = defaultRestaurants }: RestaurantMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [markers, setMarkers] = useState<google.maps.Marker[]>([])
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null)
  const [hasValidApiKey, setHasValidApiKey] = useState(false)
  const [error, setError] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const retryCountRef = useRef(0)
  const maxRetries = 3

  const googleMapsClasses = useRef<{
    Map: typeof google.maps.Map | null
    Marker: typeof google.maps.Marker | null
    InfoWindow: typeof google.maps.InfoWindow | null
    SymbolPath: typeof google.maps.SymbolPath | null
    event: typeof google.maps.event | null
  }>({
    Map: null,
    Marker: null,
    InfoWindow: null,
    SymbolPath: null,
    event: null,
  })


  const cleanup = useCallback(() => {
    if (markers.length > 0) {
      markers.forEach((marker) => marker.setMap(null))
      setMarkers([])
    }
    if (infoWindow) {
      infoWindow.close()
      setInfoWindow(null);
    }
    if (map) {
      setMap(null);
    }
    googleMapsClasses.current = { Map: null, Marker: null, InfoWindow: null, SymbolPath: null, event: null };

  }, [markers, infoWindow, map])

  const diagnoseError = useCallback((err: any) => {
    const currentDomain = typeof window !== "undefined" ? window.location.hostname : "unknown"
    const isDevelopment = currentDomain === "localhost" || currentDomain === "127.0.0.1"
    const isVercel = currentDomain.includes("vercel.app")

    console.group("🗺️ Diagnostic Google Maps")
    console.log("Domaine actuel:", currentDomain)
    console.log("Environnement:", isDevelopment ? "Développement" : isVercel ? "Production Vercel" : "Production")
    console.log("Erreur brute:", err)
    console.groupEnd()

    const errorMessage = err?.message || err?.error?.message || "Erreur inconnue"

    if (errorMessage.includes("RefererNotAllowedMapError") || errorMessage.includes("InvalidKeyMapError")) {
      return `Erreur de restriction de domaine ou clé invalide. Le domaine ${currentDomain} n'est pas autorisé pour cette clé API ou la clé est incorrecte.`
    }

    if (errorMessage.includes("ApiNotActivatedMapError")) {
      return "L'API Maps JavaScript n'est pas activée pour cette clé dans Google Cloud Console."
    }

    if (errorMessage.includes("RequestDenied")) {
      return "Requête refusée. Vérifiez les restrictions de la clé API ou les paramètres de facturation."
    }

    if (err instanceof Error && err.message.includes("is not a constructor")) {
      return "Les bibliothèques Google Maps n'ont pas été chargées correctement. Vérifiez votre clé API et les bibliothèques activées."
    }

    return `Erreur de chargement: ${errorMessage}`
  }, [])

  const initMap = useCallback(async () => {
    if (!mapRef.current) {
      console.error("Map ref is null, cannot initialize map.")
      setError("Erreur: Impossible de trouver l'élément HTML de la carte.");
      setIsLoading(false);
      return
    }

    const { Map, InfoWindow, event } = googleMapsClasses.current;
    if (!Map || !InfoWindow || !event) {
        console.warn("Google Maps core classes not yet loaded for map initialization. Retrying load.");
        return;
    }

    try {
      console.log("🗺️ Initialisation de la carte Google Maps...");
      setIsLoading(true);

      const mapOptions: google.maps.MapOptions = {
        center: { lat: 48.8566, lng: 2.3522 },
        zoom: 12,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        // mapId: "VOTRE_ID_DE_CARTE_REEL_ICI", // <-- CETTE LIGNE EST MAINTENANT COMMENTÉE OU SUPPRIMÉE
        styles: [
          { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
          { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
          { elementType: "labels.text.stroke", stylers: [{ color: "#f5f5f5" }] },
          { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
          { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
          { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
          { featureType: "poi", elementType: "geometry", stylers: [{ color: "#eeeeee" }] },
          { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#e8e8e8" }] },
          { featureType: "water", elementType: "geometry", stylers: [{ color: "#4fc3f7" }] },
          { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
          { featureType: "administrative", elementType: "geometry", stylers: [{ visibility: "off" }] },
          { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
          { featureType: "road", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
          { featureType: "transit", stylers: [{ visibility: "off" }] },
        ],
      };

      const mapInstance = new Map(mapRef.current, mapOptions);
      const infoWindowInstance = new InfoWindow();

      mapInstance.addListener("error", (err: any) => {
        console.error("❌ Erreur de la carte Google Maps (via listener):", err)
        const errorMessage = diagnoseError(err)
        setError(errorMessage)
        setHasValidApiKey(false)
        setIsLoading(false)
      })

      mapInstance.addListener("idle", () => {
        console.log("✅ Google Maps chargé avec succès")
        setHasValidApiKey(true)
        setError("")
        setIsLoading(false)
        retryCountRef.current = 0
      })

      setMap(mapInstance)
      setInfoWindow(infoWindowInstance)

    } catch (err) {
      console.error("❌ Erreur lors de l'initialisation de Google Maps:", err)
      const errorMessage = diagnoseError(err)
      setError(errorMessage)
      setHasValidApiKey(false)
      setIsLoading(false)
    }
  }, [diagnoseError])


  const loadGoogleMaps = useCallback(
    async (apiKey: string) => {
      try {
        console.log("📥 Chargement de Google Maps via Loader...")
        const loader = new Loader({
          apiKey: apiKey,
          version: "weekly",
          libraries: ["places", "marker"],
        })

        const { Map } = await loader.importLibrary("maps")
        const { Marker } = await loader.importLibrary("marker")
        const { InfoWindow } = await loader.importLibrary("places")

        const SymbolPath = window.google?.maps?.SymbolPath || null
        const event = window.google?.maps?.event || null;

        if (!Map || !Marker || !InfoWindow || !SymbolPath || !event) {
            throw new Error("One or more Google Maps core libraries failed to load.");
        }

        googleMapsClasses.current = {
          Map,
          Marker,
          InfoWindow,
          SymbolPath,
          event,
        };

        console.log("✅ Google Maps API chargée via Loader et classes stockées")
        await initMap()
      } catch (err) {
        console.error("❌ Erreur lors du chargement via Loader:", err)
        setError(diagnoseError(err));
        setHasValidApiKey(false);
        setIsLoading(false);
        throw err
      }
    },
    [initMap, diagnoseError],
  )

  const retryLoadMap = useCallback(
    async (apiKey: string) => {
      if (retryCountRef.current >= maxRetries) {
        setError(`Échec après ${maxRetries} tentatives. Veuillez vérifier votre connexion internet et la configuration de votre clé API.`);
        setIsLoading(false);
        return;
      }

      retryCountRef.current++;
      const delay = Math.pow(2, retryCountRef.current) * 1000;

      console.log(`🔄 Tentative ${retryCountRef.current}/${maxRetries} dans ${delay}ms...`);

      setTimeout(async () => {
        try {
          await loadGoogleMaps(apiKey);
        } catch (err) {
          console.error(`❌ Tentative ${retryCountRef.current} échouée:`, err);
          retryLoadMap(apiKey);
        }
      }, delay);
    },
    [loadGoogleMaps],
  )

  useEffect(() => {
    if (!mapRef.current) return

    // CORRIGÉ : Le nom de la variable d'environnement doit être Maps_API_KEY
    const apiKey = process.env.NEXT_PUBLIC_Maps_API_KEY as string;

    console.log("🔑 Vérification de la clé API:", apiKey ? "✅ Présente" : "❌ Manquante")

    if (!apiKey) {
      setError("Clé API Google Maps manquante dans les variables d'environnement (NEXT_PUBLIC_Maps_API_KEY).");
      setHasValidApiKey(false);
      setIsLoading(false);
      return;
    }

    const initializeMapFlow = async () => {
      try {
        await loadGoogleMaps(apiKey);
      } catch (err) {
        console.error("❌ Échec du chargement initial via loadGoogleMaps:", err);
        retryLoadMap(apiKey);
      }
    };

    initializeMapFlow();

    return () => {
      cleanup();
    };
  }, [cleanup, loadGoogleMaps, retryLoadMap]);


  useEffect(() => {
    const { Marker, InfoWindow, event, Map: MapClass } = googleMapsClasses.current;
    if (!map || !infoWindow || !hasValidApiKey || !Marker || !InfoWindow || !event || !MapClass) {
      console.warn("Cannot set markers: Map or Google Maps classes not fully loaded.");
      return;
    }

    markers.forEach((marker) => marker.setMap(null));
    const newMarkers: google.maps.Marker[] = [];

    restaurants.forEach((restaurant) => {
      let lat = restaurant.lat
      let lng = restaurant.lng

      if (!lat || !lng) {
        const arrondissementCoords: { [key: string]: { lat: number; lng: number } } = {
          "1er arrondissement": { lat: 48.8606, lng: 2.3376 },
          "2e arrondissement": { lat: 48.8697, lng: 2.3417 },
          "3e arrondissement": { lat: 48.863, lng: 2.3608 },
          "4e arrondissement": { lat: 48.8566, lng: 2.3522 },
          "5e arrondissement": { lat: 48.8462, lng: 2.3372 },
          "6e arrondissement": { lat: 48.8496, lng: 2.3316 },
          "7e arrondissement": { lat: 48.8566, lng: 2.3059 },
          "8e arrondissement": { lat: 48.8738, lng: 2.302 },
          "9e arrondissement": { lat: 48.8771, lng: 2.3341 },
          "10e arrondissement": { lat: 48.876, lng: 2.359 },
          "11e arrondissement": { lat: 48.8594, lng: 2.3765 },
          "12e arrondissement": { lat: 48.8448, lng: 2.3776 },
          "13e arrondissement": { lat: 48.8322, lng: 2.3561 },
          "14e arrondissement": { lat: 48.8338, lng: 2.324 },
          "15e arrondissement": { lat: 48.8422, lng: 2.2966 },
          "16e arrondissement": { lat: 48.8662, lng: 2.2734 },
          "17e arrondissement": { lat: 48.8848, lng: 2.3143 },
          "18e arrondissement": { lat: 48.8922, lng: 2.3444 },
          "19e arrondissement": { lat: 48.8799, lng: 2.3781 },
          "20e arrondissement": { lat: 48.8663, lng: 2.3969 },
        }

        const coords = arrondissementCoords[restaurant.city]
        if (coords) {
          lat = coords.lat + (Math.random() - 0.5) * 0.01
          lng = coords.lng + (Math.random() - 0.5) * 0.01
        } else {
          lat = 48.8566 + (Math.random() - 0.5) * 0.1
          lng = 2.3522 + (Math.random() - 0.5) * 0.1
        }
      }

      try {
        const marker = new Marker({
          position: { lat, lng },
          map: map,
          title: restaurant.name,
          icon: {
            url: "/bobrepere.png",
            scaledSize: new window.google.maps.Size(40, 40),
            anchor: new window.google.maps.Point(20, 40),
          },
        })

        marker.addListener("click", () => {
          const distinctionIcons = (restaurant.distinctions || [])
            .map((distinction) => {
              switch (distinction) {
                case "michelin-1":
                  return `<img src="/etoile-michelin.webp" alt="Michelin 1 étoile" style="width: 20px; height: 20px; object-fit: contain; margin-right: 4px;">`
                case "michelin-2":
                  return `<img src="/etoile-michelin.webp" alt="Michelin 1 étoile" style="width: 20px; height: 20px; object-fit: contain; margin-right: 2px;"><img src="/etoile-michelin.webp" alt="Michelin 2 étoiles" style="width: 20px; height: 20px; object-fit: contain; margin-right: 4px;">`
                case "michelin-3":
                  return `<img src="/etoile-michelin.webp" alt="Michelin 1 étoile" style="width: 20px; height: 20px; object-fit: contain; margin-right: 2px;"><img src="/etoile-michelin.webp" alt="Michelin 2 étoiles" style="width: 20px; height: 20px; object-fit: contain; margin-right: 2px;"><img src="/etoile-michelin.webp" alt="Michelin 3 étoiles" style="width: 20px; height: 20px; object-fit: contain; margin-right: 4px;">`
                case "michelin-bib":
                  return `<img src="/bibgourmand.jpg" alt="Bib Gourmand" style="width: 20px; height: 20px; object-fit: contain; margin-right: 4px;">`
                case "michelin-assiette":
                  return `<img src="/assiettemichelin.jpg" alt="Assiette Michelin" style="width: 20px; height: 20px; object-fit: contain; margin-right: 4px;">`
                case "gaultmillau-1":
                  return `<img src="/1toque.png" alt="1 toque Gault&Millau" style="width: 20px; height: 20px; object-fit: contain; margin-right: 4px;">`
                case "gaultmillau-2":
                  return `<img src="/2toques.jpg" alt="2 toques Gault&Millau" style="width: 20px; height: 20px; object-fit: contain; margin-right: 4px;">`
                case "gaultmillau-3":
                  return `<img src="/3toques.jpg" alt="3 toques Gault&Millau" style="width: 20px; height: 20px; object-fit: contain; margin-right: 4px;">`
                case "gaultmillau-4":
                  return `<img src="/4toques.png" alt="4 toques Gault&Millau" style="width: 20px; height: 20px; object-fit: contain; margin-right: 4px;">`
                case "gaultmillau-5":
                  return `<img src="/5toques.png" alt="5 toques Gault&Millau" style="width: 20px; height: 20px; object-fit: contain; margin-right: 4px;">`
                case "50best":
                  return `<img src="/50bestrestaurants.webp" alt="50 Best Restaurants" style="width: 20px; height: 20px; object-fit: contain; margin-right: 4px;">`
                default:
                  return ""
              }
            })
            .join("")

          const content = `
            <div style="padding: 16px; max-width: 320px; cursor: pointer;" onclick="window.location.href='/${restaurant.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}'">
              <div style="display: flex; gap: 12px; align-items: flex-start;">
                <img src="/placeholder.svg?height=80&width=80&text=${encodeURIComponent(restaurant.name.slice(0, 10))}"
                     alt="${restaurant.name}"
                     style="width: 80px; height: 80px; object-fit: cover; border-radius: 12px; flex-shrink: 0; background-color: #f3f4f6;" />
                <div style="flex: 1; min-width: 0;">
                  <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 8px; min-height: 20px;">
                    ${distinctionIcons}
                  </div>
                  <h3 style="margin: 0 0 4px 0; font-size: 18px; font-weight: 700; color: #111827; line-height: 1.3;">${restaurant.name}</h3>
                  <p style="margin: 0 0 2px 0; font-size: 13px; color: #6b7280; line-height: 1.2;">Paris - ${restaurant.city.replace("arrondissement", "arr.")}</p>
                  <p style="margin: 0; font-size: 13px; color: #6b7280; line-height: 1.2;">${restaurant.priceRange} • Cuisine gastronomique</p>
                </div>
              </div>
            </div>
          `

          infoWindow.setContent(content)
          infoWindow.open(map, marker)
        })

        newMarkers.push(marker)
      } catch (err) {
        console.error("❌ Erreur lors de la création du marqueur:", err)
      }
    })

    setMarkers(newMarkers)

    if (newMarkers.length > 0 && event && MapClass) {
      try {
        const bounds = new MapClass.LatLngBounds()
        newMarkers.forEach((marker) => {
          const position = marker.getPosition()
          if (position) bounds.extend(position)
        })
        map.fitBounds(bounds)

        const listener = event.addListener(map, "idle", () => {
          if (map.getZoom()! > 15) map.setZoom(15)
          event.removeListener(listener)
        })
      } catch (err) {
        console.error("❌ Erreur lors de l'ajustement des bounds:", err)
      }
    }
  }, [map, infoWindow, restaurants, hasValidApiKey])


  if (isLoading) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-200 max-w-md mx-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Chargement de la carte</h3>
          <p className="text-gray-600 text-sm">
            {retryCountRef.current > 0
              ? `Tentative ${retryCountRef.current}/${maxRetries}...`
              : "Initialisation de Google Maps..."}
          </p>
        </div>
      </div>
    )
  }

  if (!hasValidApiKey) {
    const currentDomain = typeof window !== "undefined" ? window.location.hostname : "unknown"
    const isVercel = currentDomain.includes("vercel.app")

    return (
      <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-red-500 rounded-full"></div>
          <div className="absolute top-32 right-16 w-16 h-16 bg-blue-500 rounded-full"></div>
          <div className="absolute bottom-20 left-20 w-12 h-12 bg-green-500 rounded-full"></div>
          <div className="absolute bottom-32 right-32 w-24 h-24 bg-yellow-500 rounded-full"></div>
        </div>

        <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-200 max-w-md mx-4">
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Carte temporairement indisponible</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              {isVercel
                ? "La carte ne peut pas s'afficher sur ce domaine. Problème de configuration détecté."
                : "Pour afficher la carte interactive avec les restaurants, vérifiez la configuration de votre clé API Google Maps."}
            </p>
            {error && (
              <div className="text-red-600 text-xs mt-2 font-mono bg-red-50 p-3 rounded border border-red-200">
                <strong>Diagnostic:</strong>
                <br />
                {error}
              </div>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left mb-4">
            <h4 className="font-semibold text-blue-900 mb-2 text-sm">
              {isVercel ? "Solution pour Vercel:" : "Configuration requise:"}
            </h4>
            <ol className="text-xs text-blue-800 space-y-1">
              {isVercel ? (
                <>
                  <li>1. Allez dans Google Cloud Console</li>
                  <li>2. Credentials → Votre clé API</li>
                  <li>3. Ajoutez <code className="bg-blue-100 px-1 rounded">{currentDomain}/*</code> aux domaines autorisés</li>
                  <li>4. Redéployez votre application</li>
                </>
              ) : (
                <>
                  <li>1. Créez une clé API Google Maps</li>
                  <li>2. Activez Maps JavaScript API</li>
                  <li>3. Configurez les restrictions de domaine</li>
                  <li>4. Ajoutez <code className="bg-blue-100 px-1 rounded">NEXT_PUBLIC_Maps_API_KEY</code> dans votre fichier <code className="bg-blue-100 px-1 rounded">.env.local</code></li>
                </>
              )}
            </ol>
          </div>

          <div className="text-xs text-gray-500 mb-4">
            Domaine: <code className="bg-gray-100 px-1 rounded">{currentDomain}</code>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {restaurants.slice(0, 4).map((restaurant, index) => (
              <div key={index} className="text-center">
                <div className="w-8 h-8 bg-red-500 rounded-full mx-auto mb-1 flex items-center justify-center">
                  <img src="/bobrepere.png" alt="Bob Repère" className="w-6 h-6" />
                </div>
                <p className="text-xs text-gray-600 truncate">{restaurant.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return <div ref={mapRef} className="w-full h-full" />
}

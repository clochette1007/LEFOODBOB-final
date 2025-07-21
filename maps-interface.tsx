"use client"

import { useEffect, useRef, useState } from "react"
import { Loader } from "@googlemaps/js-api-loader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Palette, Plus, Trash2 } from "lucide-react"

interface CustomMarker {
  id: string
  position: { lat: number; lng: number }
  title: string
  description: string
  color: string
  // Store the actual Google Maps Marker instance
  googleMapsMarker?: google.maps.Marker
}

// Define types for Google Maps objects to avoid 'any' for better type safety
type GoogleMap = google.maps.Map | null
type GoogleMarker = typeof google.maps.Marker | null
type GoogleInfoWindow = typeof google.maps.InfoWindow | null
type GoogleMapsEvent = typeof google.maps.event | null

const mapStyles = {
  standard: [],
  dark: [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
      featureType: "administrative.locality",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ color: "#263c3f" }],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [{ color: "#6b9a76" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#38414e" }],
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{ color: "#212a37" }],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9ca5b3" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#746855" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{ color: "#1f2835" }],
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [{ color: "#f3d19c" }],
    },
    {
      featureType: "transit",
      elementType: "geometry",
      stylers: [{ color: "#2f3948" }],
    },
    {
      featureType: "transit.station",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#17263c" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#515c6d" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#17263c" }],
    },
  ],
  retro: [
    { elementType: "geometry", stylers: [{ color: "#ebe3cd" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#523735" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#f5f1e6" }] },
    {
      featureType: "administrative",
      elementType: "geometry.stroke",
      stylers: [{ color: "#c9b2a6" }],
    },
    {
      featureType: "administrative.land_parcel",
      elementType: "geometry.stroke",
      stylers: [{ color: "#dcd2be" }],
    },
    {
      featureType: "administrative.land_parcel",
      elementType: "labels.text.fill",
      stylers: [{ color: "#ae9e90" }],
    },
    {
      featureType: "landscape.natural",
      elementType: "geometry",
      stylers: [{ color: "#dfd2ae" }],
    },
    {
      featureType: "poi",
      elementType: "geometry",
      stylers: [{ color: "#dfd2ae" }],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#93817c" }],
    },
    {
      featureType: "poi.park",
      elementType: "geometry.fill",
      stylers: [{ color: "#a5b076" }],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [{ color: "#447530" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#f5f1e6" }],
    },
    {
      featureType: "road.arterial",
      elementType: "geometry",
      stylers: [{ color: "#fdfcf8" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#f8c967" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{ color: "#e9bc62" }],
    },
    {
      featureType: "road.highway.controlled_access",
      elementType: "geometry",
      stylers: [{ color: "#e98d58" }],
    },
    {
      featureType: "road.highway.controlled_access",
      elementType: "geometry.stroke",
      stylers: [{ color: "#db8555" }],
    },
    {
      featureType: "road.local",
      elementType: "labels.text.fill",
      stylers: [{ color: "#806b63" }],
    },
    {
      featureType: "transit.line",
      elementType: "geometry",
      stylers: [{ color: "#dfd2ae" }],
    },
    {
      featureType: "transit.line",
      elementType: "labels.text.fill",
      stylers: [{ color: "#8f7d77" }],
    },
    {
      featureType: "transit.line",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#ebe3cd" }],
    },
    {
      featureType: "transit.station",
      elementType: "geometry",
      stylers: [{ color: "#dfd2ae" }],
    },
    {
      featureType: "water",
      elementType: "geometry.fill",
      stylers: [{ color: "#b9d3c2" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#92998d" }],
    },
  ],
}

export default function MapsInterface() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<GoogleMap>(null)
  const [markers, setMarkers] = useState<CustomMarker[]>([])
  const [selectedStyle, setSelectedStyle] = useState<keyof typeof mapStyles>("standard")
  const [newMarker, setNewMarker] = useState({
    title: "",
    description: "",
    color: "#FF0000",
  })
  const [isAddingMarker, setIsAddingMarker] = useState(false)
  const [clickListener, setClickListener] = useState<google.maps.MapsEventListener | null>(null)

  // State to hold references to loaded Google Maps classes
  const [googleMaps, setGoogleMaps] = useState<{
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

  useEffect(() => {
    const initMap = async () => {
      // Ensure the mapRef is available before trying to create a map
      if (!mapRef.current) {
        console.error("Map ref is null, cannot initialize map.")
        return
      }

      try {
        const loader = new Loader({
          apiKey: "AIzaSyCcfMwhQwKmsAnRYfQCtYKsWpB4EI3NIq4", // Your confirmed API key
          version: "weekly",
          libraries: ["marker"], // Explicitly load the marker library for SymbolPath
        })

        // Import all necessary libraries and store them
        const { Map } = await loader.importLibrary("maps")
        const { Marker } = await loader.importLibrary("marker") // Marker library often includes SymbolPath
        const { InfoWindow } = await loader.importLibrary("places") // InfoWindow is often part of places or maps itself

        // Directly assign event from the global google.maps object after loading
        const event = window.google?.maps?.event || null;
        const SymbolPath = window.google?.maps?.SymbolPath || null;


        if (!Map || !Marker || !InfoWindow || !event || !SymbolPath) {
          console.error("Failed to load one or more Google Maps libraries.", { Map, Marker, InfoWindow, event, SymbolPath })
          return
        }

        setGoogleMaps({ Map, Marker, InfoWindow, SymbolPath, event })

        const mapOptions: google.maps.MapOptions = {
          center: { lat: 48.8566, lng: 2.3522 }, // Paris coordinates
          zoom: 12,
          styles: mapStyles[selectedStyle],
          // IMPORTANT: If you are using Cloud-based map styling, you need a Map ID.
                                // If not using Cloud styling, remove this line or replace with a valid ID.
                                // If you don't have one and this is causing issues, remove it.
        }

        const mapInstance = new Map(mapRef.current, mapOptions)
        setMap(mapInstance)

        // Re-add existing markers to the new map instance if they exist
        // This is important if initMap runs again for any reason
        markers.forEach(addMarkerToMap);

      } catch (error) {
        console.error("Error loading Google Maps API:", error)
      }
    }

    initMap()

    // Cleanup function: remove map and listeners if component unmounts
    return () => {
        if (map) {
            // Dispose of map instance if possible (depends on Maps API implementation)
            // For simple cleanup, just nullify the state
            setMap(null);
        }
        if (clickListener) {
            googleMaps.event?.removeListener(clickListener);
            setClickListener(null);
        }
    };
  }, [selectedStyle]) // Re-run initMap if selectedStyle changes

  useEffect(() => {
    // Only update styles if the map object exists and style has changed
    if (map && googleMaps.Map) { // Ensure Map class is loaded
      map.setOptions({ styles: mapStyles[selectedStyle] })
    }
  }, [map, selectedStyle, googleMaps.Map])


  const addMarkerToMap = (marker: CustomMarker) => {
    // Ensure all necessary Google Maps objects are loaded
    if (!map || !googleMaps.Marker || !googleMaps.InfoWindow || !googleMaps.SymbolPath) {
      console.warn("Google Maps objects not fully loaded yet for adding marker.")
      return
    }

    const mapMarker = new googleMaps.Marker({
      position: marker.position,
      map: map,
      title: marker.title,
      icon: {
        path: googleMaps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: marker.color,
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: "#FFFFFF",
      },
    })

    const infoWindow = new googleMaps.InfoWindow({
      content: `
        <div>
          <h3 style="margin: 0 0 8px 0; font-weight: bold;">${marker.title}</h3>
          <p style="margin: 0;">${marker.description}</p>
        </div>
      `,
    })

    mapMarker.addListener("click", () => {
      infoWindow.open(map, mapMarker)
    })

    // Update the marker in the state with its Google Maps instance
    setMarkers((prev) =>
      prev.map((m) => (m.id === marker.id ? { ...m, googleMapsMarker: mapMarker } : m))
    )
  }

  const handleAddMarker = () => {
    if (!map || !newMarker.title || !googleMaps.event) { // Ensure event object is loaded
      console.warn("Map or new marker title or Google Maps event object not ready.")
      return
    }

    setIsAddingMarker(true)

    // Remove any existing click listener before adding a new one
    if (clickListener) {
      googleMaps.event.removeListener(clickListener)
    }

    const listener = map.addListener("click", (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        const marker: CustomMarker = {
          id: Date.now().toString(),
          position: {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
          },
          title: newMarker.title,
          description: newMarker.description,
          color: newMarker.color,
        }

        setMarkers((prev) => [...prev, marker]) // Add the new marker to the state first
        addMarkerToMap(marker) // Then add it to the map

        setNewMarker({ title: "", description: "", color: "#FF0000" })
        setIsAddingMarker(false)

        // Remove the listener once a marker is placed
        if (googleMaps.event) {
            googleMaps.event.removeListener(listener)
            setClickListener(null) // Clear the listener from state
        }
      }
    })

    setClickListener(listener)
  }

  const removeMarker = (id: string) => {
    setMarkers((prev) => {
      const markerToRemove = prev.find((marker) => marker.id === id)
      if (markerToRemove && markerToRemove.googleMapsMarker) {
        // Set map to null to remove the marker from the map
        markerToRemove.googleMapsMarker.setMap(null)
      }
      return prev.filter((marker) => marker.id !== id)
    })
  }

  const cancelAddMarker = () => {
    setIsAddingMarker(false)
    if (clickListener && googleMaps.event) {
      googleMaps.event.removeListener(clickListener)
      setClickListener(null)
    }
  }

  // Effect to re-render markers when the `markers` state changes
  // This is crucial for adding previously existing markers after map initialization
  useEffect(() => {
    // Only run this effect if the map and Google Maps objects are loaded
    if (map && googleMaps.Marker && googleMaps.InfoWindow && googleMaps.SymbolPath) {
      // Clear all existing markers from the map before re-adding
      markers.forEach(m => {
          if (m.googleMapsMarker) {
              m.googleMapsMarker.setMap(null);
          }
      });
      // Add all current markers from state to the map
      markers.forEach(addMarkerToMap);
    }
  }, [markers, map, googleMaps.Marker, googleMaps.InfoWindow, googleMaps.SymbolPath]);


  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white shadow-lg overflow-y-auto">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <MapPin className="h-6 w-6" />
            Ma Carte Personnalisée
          </h1>

          {/* Style Selection */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Style de la carte
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedStyle} onValueChange={(value: keyof typeof mapStyles) => setSelectedStyle(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="dark">Sombre</SelectItem>
                  <SelectItem value="retro">Rétro</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Add Marker */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Ajouter un repère
              </CardTitle>
              <CardDescription>
                {isAddingMarker
                  ? "Cliquez sur la carte pour placer le repère"
                  : "Remplissez les informations et cliquez sur Ajouter"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  value={newMarker.title}
                  onChange={(e) => setNewMarker({ ...newMarker, title: e.target.value })}
                  placeholder="Nom du lieu"
                  disabled={isAddingMarker}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newMarker.description}
                  onChange={(e) => setNewMarker({ ...newMarker, description: e.target.value })}
                  placeholder="Description du lieu"
                  disabled={isAddingMarker}
                />
              </div>
              <div>
                <Label htmlFor="color">Couleur</Label>
                <div className="flex gap-2">
                  <Input
                    id="color"
                    type="color"
                    value={newMarker.color}
                    onChange={(e) => setNewMarker({ ...newMarker, color: e.target.value })}
                    className="w-16 h-10"
                    disabled={isAddingMarker}
                  />
                  <Input
                    value={newMarker.color}
                    onChange={(e) => setNewMarker({ ...newMarker, color: e.target.value })}
                    placeholder="#FF0000"
                    disabled={isAddingMarker}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                {!isAddingMarker ? (
                  <Button onClick={handleAddMarker} disabled={!newMarker.title} className="flex-1">
                    Ajouter
                  </Button>
                ) : (
                  <Button onClick={cancelAddMarker} variant="outline" className="flex-1 bg-transparent">
                    Annuler
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Markers List */}
          <Card>
            <CardHeader>
              <CardTitle>Mes repères ({markers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {markers.length === 0 ? (
                <p className="text-gray-500 text-sm">Aucun repère ajouté</p>
              ) : (
                <div className="space-y-2">
                  {markers.map((marker) => (
                    <div key={marker.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full border border-white"
                          style={{ backgroundColor: marker.color }}
                        />
                        <div>
                          <p className="font-medium text-sm">{marker.title}</p>
                          <p className="text-xs text-gray-500">{marker.description}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => removeMarker(marker.id)} className="h-8 w-8 p-0">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <div ref={mapRef} className="w-full h-full" />
        {isAddingMarker && (
          <div className="absolute top-4 left-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg">
            Cliquez sur la carte pour placer votre repère
          </div>
        )}
      </div>
    </div>
  )
}

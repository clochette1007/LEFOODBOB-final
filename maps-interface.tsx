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
}

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
  const [map, setMap] = useState<any>(null)
  const [markers, setMarkers] = useState<CustomMarker[]>([])
  const [selectedStyle, setSelectedStyle] = useState<keyof typeof mapStyles>("standard")
  const [newMarker, setNewMarker] = useState({
    title: "",
    description: "",
    color: "#FF0000",
  })
  const [isAddingMarker, setIsAddingMarker] = useState(false)
  const [clickListener, setClickListener] = useState<any>(null)

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: "AIzaSyCcfMwhQwKmsAnRYfQCtYKsWpB4EI3NIq4",
        version: "weekly",
      })

      const { Map } = await loader.importLibrary("maps")

      const mapOptions = {
        center: { lat: 48.8566, lng: 2.3522 }, // Paris coordinates
        zoom: 12,
        styles: mapStyles[selectedStyle],
      }

      const mapInstance = new Map(mapRef.current as HTMLDivElement, mapOptions)
      setMap(mapInstance)
    }

    initMap()
  }, [])

  useEffect(() => {
    if (map) {
      map.setOptions({ styles: mapStyles[selectedStyle] })
    }
  }, [map, selectedStyle])

  const addMarkerToMap = (marker: CustomMarker) => {
    if (!map) return

    const mapMarker = new window.google.maps.Marker({
      position: marker.position,
      map: map,
      title: marker.title,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: marker.color,
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: "#FFFFFF",
      },
    })

    const infoWindow = new window.google.maps.InfoWindow({
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
  }

  const handleAddMarker = () => {
    if (!map || !newMarker.title) return

    setIsAddingMarker(true)

    const listener = map.addListener("click", (event: any) => {
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

        setMarkers((prev) => [...prev, marker])
        addMarkerToMap(marker)

        setNewMarker({ title: "", description: "", color: "#FF0000" })
        setIsAddingMarker(false)

        if (clickListener) {
          window.google.maps.event.removeListener(clickListener)
        }
      }
    })

    setClickListener(listener)
  }

  const removeMarker = (id: string) => {
    setMarkers((prev) => prev.filter((marker) => marker.id !== id))
    // Note: In a real implementation, you'd also need to remove the marker from the map
    // This would require storing references to the Google Maps marker objects
  }

  const cancelAddMarker = () => {
    setIsAddingMarker(false)
    if (clickListener) {
      window.google.maps.event.removeListener(clickListener)
      setClickListener(null)
    }
  }

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

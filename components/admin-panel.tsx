"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, Save, X, MapPin, Star, ArrowLeft } from "lucide-react"

interface Restaurant {
  id: string
  name: string
  address: string
  city: string
  phone?: string
  website?: string
  category: string
  priceRange: string
  cuisine: string
  description: string
  openingHours?: string
  rating?: number
  tags: string[]
  isNew?: boolean
  isFavorite?: boolean
  photoUrl?: string
  notes?: string
}

const categories = ["Restaurant", "Café", "Bar", "Boulangerie", "Pâtisserie", "Épicerie fine", "Marché", "Autre"]

const cuisineTypes = [
  "Française",
  "Italienne",
  "Japonaise",
  "Chinoise",
  "Thaï",
  "Indienne",
  "Mexicaine",
  "Méditerranéenne",
  "Végétarienne",
  "Fusion",
  "Autre",
]

const priceRanges = ["€", "€€", "€€€", "€€€€"]

export default function AdminPanel({
  onSave,
  onBack,
}: {
  onSave: (restaurants: Restaurant[]) => void
  onBack: () => void
}) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<Partial<Restaurant>>({
    name: "",
    address: "",
    city: "Paris",
    category: "Restaurant",
    priceRange: "€€",
    cuisine: "Française",
    description: "",
    tags: [],
    isNew: false,
    isFavorite: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newRestaurant: Restaurant = {
      id: editingId || Date.now().toString(),
      name: formData.name || "",
      address: formData.address || "",
      city: formData.city || "Paris",
      phone: formData.phone,
      website: formData.website,
      category: formData.category || "Restaurant",
      priceRange: formData.priceRange || "€€",
      cuisine: formData.cuisine || "Française",
      description: formData.description || "",
      openingHours: formData.openingHours,
      rating: formData.rating,
      tags: formData.tags || [],
      isNew: formData.isNew || false,
      isFavorite: formData.isFavorite || false,
      notes: formData.notes,
    }

    if (editingId) {
      setRestaurants((prev) => prev.map((r) => (r.id === editingId ? newRestaurant : r)))
    } else {
      setRestaurants((prev) => [...prev, newRestaurant])
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      city: "Paris",
      category: "Restaurant",
      priceRange: "€€",
      cuisine: "Française",
      description: "",
      tags: [],
      isNew: false,
      isFavorite: false,
    })
    setEditingId(null)
    setShowForm(false)
  }

  const handleEdit = (restaurant: Restaurant) => {
    setFormData(restaurant)
    setEditingId(restaurant.id)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    setRestaurants((prev) => prev.filter((r) => r.id !== id))
  }

  const addTag = (tag: string) => {
    if (tag && !formData.tags?.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tag],
      }))
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((tag) => tag !== tagToRemove) || [],
    }))
  }

  const exportData = () => {
    const dataStr = JSON.stringify(restaurants, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = "restaurants.json"
    link.click()
  }

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string)
          setRestaurants(imported)
        } catch (error) {
          alert("Erreur lors de l'importation du fichier")
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Administration des Lieux</h1>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Ajouter un lieu
          </Button>
          <Button variant="outline" onClick={exportData}>
            Exporter
          </Button>
          <div>
            <input type="file" accept=".json" onChange={importData} className="hidden" id="import-file" />
            <Button variant="outline" onClick={() => document.getElementById("import-file")?.click()}>
              Importer
            </Button>
          </div>
          <Button onClick={() => onSave(restaurants)} className="bg-green-600 hover:bg-green-700">
            <Save className="w-4 h-4 mr-2" />
            Sauvegarder sur la carte
          </Button>
        </div>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list">Liste des lieux ({restaurants.length})</TabsTrigger>
          <TabsTrigger value="categories">Par catégories</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {restaurants.map((restaurant) => (
            <Card key={restaurant.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {restaurant.name}
                      {restaurant.isNew && <Badge variant="destructive">NOUVEAU</Badge>}
                      {restaurant.isFavorite && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {restaurant.address}
                      </span>
                      <Badge variant="secondary">{restaurant.category}</Badge>
                      <Badge variant="outline">{restaurant.cuisine}</Badge>
                      <span>{restaurant.priceRange}</span>
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(restaurant)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(restaurant.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {restaurant.description && (
                <CardContent>
                  <p className="text-gray-600">{restaurant.description}</p>
                  {restaurant.tags.length > 0 && (
                    <div className="flex gap-1 mt-2">
                      {restaurant.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          {categories.map((category) => {
            const categoryRestaurants = restaurants.filter((r) => r.category === category)
            if (categoryRestaurants.length === 0) return null

            return (
              <Card key={category}>
                <CardHeader>
                  <CardTitle>
                    {category} ({categoryRestaurants.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryRestaurants.map((restaurant) => (
                      <div key={restaurant.id} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{restaurant.name}</h4>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(restaurant)}>
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(restaurant.id)}>
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{restaurant.address}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {restaurant.cuisine}
                          </Badge>
                          <span className="text-xs">{restaurant.priceRange}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>
      </Tabs>

      {/* Formulaire d'ajout/édition */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{editingId ? "Modifier" : "Ajouter"} un lieu</CardTitle>
                <Button variant="ghost" size="sm" onClick={resetForm}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nom *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Catégorie</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Adresse *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                    placeholder="123 Rue de la Paix, 75001 Paris"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">Ville</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cuisine">Type de cuisine</Label>
                    <Select
                      value={formData.cuisine}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, cuisine: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {cuisineTypes.map((cuisine) => (
                          <SelectItem key={cuisine} value={cuisine}>
                            {cuisine}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="priceRange">Gamme de prix</Label>
                    <Select
                      value={formData.priceRange}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, priceRange: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {priceRanges.map((price) => (
                          <SelectItem key={price} value={price}>
                            {price}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                      placeholder="01 23 45 67 89"
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">Site web</Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Décrivez ce lieu..."
                  />
                </div>

                <div>
                  <Label htmlFor="openingHours">Horaires d'ouverture</Label>
                  <Input
                    id="openingHours"
                    value={formData.openingHours}
                    onChange={(e) => setFormData((prev) => ({ ...prev, openingHours: e.target.value }))}
                    placeholder="Lun-Ven: 12h-14h, 19h-22h"
                  />
                </div>

                <div>
                  <Label>Tags</Label>
                  <div className="flex gap-2 mb-2">
                    {formData.tags?.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                        {tag} <X className="w-3 h-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                  <Input
                    placeholder="Ajouter un tag (Entrée pour valider)"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addTag(e.currentTarget.value)
                        e.currentTarget.value = ""
                      }
                    }}
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Notes personnelles</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                    placeholder="Vos notes privées sur ce lieu..."
                  />
                </div>

                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isNew}
                      onChange={(e) => setFormData((prev) => ({ ...prev, isNew: e.target.checked }))}
                    />
                    Nouveau lieu
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isFavorite}
                      onChange={(e) => setFormData((prev) => ({ ...prev, isFavorite: e.target.checked }))}
                    />
                    Favori
                  </label>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingId ? "Modifier" : "Ajouter"}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Annuler
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

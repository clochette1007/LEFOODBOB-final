"use client"

import { useState } from "react"
import { Menu, X, Home, Map, Heart, User, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navigation = [
  { name: "Accueil", href: "/", icon: Home },
  { name: "Restaurants", href: "/restaurants", icon: Search },
  { name: "Carte", href: "/", icon: Map },
  { name: "Favoris", href: "/favorites", icon: Heart },
  { name: "Profil", href: "/profile", icon: User },
]

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Ouvrir le menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <img src="/bob_logo.png" alt="Bob" className="h-8 w-8" />
              <span className="text-xl font-bold">FoodBob</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-6 w-6" />
            </Button>
          </div>

          <nav className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive ? "bg-red-50 text-red-600 font-medium" : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="text-sm text-gray-500 mb-4">Découvrez les meilleurs restaurants de Paris</div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <img src="/bobrepere.png" alt="Bob Repère" className="h-4 w-4" />
              <span>Avec Bob comme guide</span>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

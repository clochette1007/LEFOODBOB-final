"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Map, Heart } from "lucide-react"

export default function MobileNav() {
  const pathname = usePathname()

  const navItems = [
    {
      href: "/",
      icon: Home,
      label: "Accueil",
      active: pathname === "/",
    },
    {
      href: "/map",
      icon: Map,
      label: "Carte",
      active: pathname === "/map",
    },
    {
      href: "/favorites",
      icon: Heart,
      label: "Favoris",
      active: pathname === "/favorites",
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
                item.active ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Icon className="h-6 w-6 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

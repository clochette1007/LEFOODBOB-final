"use client"

import { usePathname, useRouter } from "next/navigation"
import { Home, User, Heart } from "lucide-react"

export default function MobileNav() {
  const pathname = usePathname()
  const router = useRouter()

  const navItems = [
    {
      name: "Accueil",
      icon: Home,
      path: "/",
      active: pathname === "/",
    },
    {
      name: "Espace personnel",
      icon: User,
      path: "/profile",
      active: pathname === "/profile",
    },
    {
      name: "Favoris",
      icon: Heart,
      path: "/favorites",
      active: pathname === "/favorites",
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.name}
              onClick={() => router.push(item.path)}
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors ${
                item.active ? "text-red-600 bg-red-50" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium">{item.name}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

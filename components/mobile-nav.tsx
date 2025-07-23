"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Map, User } from "lucide-react"

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
      href: "/profile",
      icon: User,
      label: "Profil",
      active: pathname === "/profile",
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-colors ${
                item.active ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

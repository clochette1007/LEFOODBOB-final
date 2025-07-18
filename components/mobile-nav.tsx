"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"

export default function MobileNav() {
  const pathname = usePathname()

  const navItems = [
    {
      href: "/",
      icon: <Image src="/bob_logo.png" alt="Accueil" width={24} height={24} className="object-contain" />,
      label: "Accueil",
    },
    {
      href: "/profile",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
      label: "Espace personnel",
    },
    {
      href: "/favorites",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      ),
      label: "Favoris",
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 md:hidden z-50 safe-area-pb">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-6 py-3 rounded-xl transition-all duration-200 ${
                isActive ? "text-blue-600 bg-blue-50 scale-105" : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              <div className={`transition-transform duration-200 ${isActive ? "scale-110" : ""}`}>{item.icon}</div>
              <span className="text-xs font-medium text-center leading-tight">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

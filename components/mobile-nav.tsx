"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, User, Heart } from 'lucide-react'
import Image from 'next/image'

export default function MobileNav() {
  const pathname = usePathname()

  const navItems = [
    {
      href: '/',
      icon: <Image src="/bob_logo.png" alt="Home" width={24} height={24} className="object-contain" />,
      label: 'Accueil'
    },
    {
      href: '/profile',
      icon: <span className="text-xl">👤</span>,
      label: 'Profil'
    },
    {
      href: '/favorites',
      icon: <span className="text-xl">❤️</span>,
      label: 'Favoris'
    }
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 md:hidden z-50">
      <div className="flex justify-around items-center py-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'text-blue-600 bg-blue-50 scale-105' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <div className={`transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
                {item.icon}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
} 
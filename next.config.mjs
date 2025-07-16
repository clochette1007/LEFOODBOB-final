/** @type {import('next').NextConfig} */
const nextConfig = {
  // Suppression des flags dangereux qui masquent les erreurs
  // eslint: { ignoreDuringBuilds: true }, - SUPPRIMÉ
  // typescript: { ignoreBuildErrors: true }, - SUPPRIMÉ
  
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'resizer.otstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'maps.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'places.googleapis.com',
      }
    ]
  },
  
  // Variables d'environnement
  env: {
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  },
  
  // Configuration Vercel
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
}

export default nextConfig

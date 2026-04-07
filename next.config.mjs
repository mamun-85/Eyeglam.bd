/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        // Allow any https image source for flexibility
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

export default nextConfig

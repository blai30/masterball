import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    // turbopackFileSystemCacheForDev: true,
    viewTransition: true,
  },
  output: 'export',
  reactCompiler: true,
  reactStrictMode: true,
  basePath: process.env.NEXT_PUBLIC_BASEPATH ?? undefined,
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ['brianpc'],
  typedRoutes: true,
  // logging: {
  //   fetches: {
  //     fullUrl: true,
  //   },
  // },
}

export default nextConfig

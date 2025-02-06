import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  basePath: process.env.NEXT_PUBLIC_BASEPATH ?? undefined,
  images: {
    unoptimized: true,
  },
}

export default nextConfig

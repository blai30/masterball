/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  basePath: process.env.NODE_ENV === 'development' ? undefined : '/next-master',
  images: {
    unoptimized: true,
  },
}

export default nextConfig

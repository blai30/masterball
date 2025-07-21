import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
    viewTransition: true,
    // Optimize bundle splitting
    optimizePackageImports: ['lucide-react', 'clsx'],
  },
  output: 'export',
  reactStrictMode: true,
  basePath: process.env.NEXT_PUBLIC_BASEPATH ?? undefined,
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ['brianpc'],
  
  // Bundle optimization
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Optimize client-side bundle
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: false,
            // Vendor chunk for React and Next.js
            framework: {
              chunks: 'all',
              name: 'framework',
              test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
              priority: 40,
              enforce: true,
            },
            // Chunk for common libraries
            lib: {
              test: /[\\/]node_modules[\\/]/,
              name: 'lib',
              chunks: 'all',
              priority: 30,
            },
            // Common components chunk
            commons: {
              name: 'commons',
              minChunks: 2,
              chunks: 'all',
              priority: 20,
            },
            // Default chunk configuration
            defaultVendors: {
              minChunks: 2,
              priority: 10,
              reuseExistingChunk: true,
            },
          },
        },
      }
    }
    
    return config
  },
  
  // Performance optimization
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
  
  // Reduce build memory usage
  poweredByHeader: false,
  
  // Compression
  compress: true,
  
  // logging: {
  //   fetches: {
  //     fullUrl: true,
  //   },
  // },
}

export default nextConfig

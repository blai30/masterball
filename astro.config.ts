import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

import { fetchAndExportData, shouldFetchData } from './scripts/fetch-data'

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL,
  base: process.env.PUBLIC_BASEPATH,
  vite: {
    // @ts-ignore
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-dom/client'],
    },
    resolve: {
      alias: {
        '@': new URL('.', import.meta.url).pathname,
      },
    },
  },
  integrations: [
    react(),
    {
      // Custom integration to run pre-build script for fetching data
      name: 'fetch-data',
      hooks: {
        'astro:build:start': async ({ logger }) => {
          if (shouldFetchData()) {
            logger.info('Running pre-build script to fetch data...')
            await fetchAndExportData()
          }
        },
      },
    },
  ],
})

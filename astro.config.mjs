import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  site: process.env.PUBLIC_FULL_URL || 'http://localhost:3000',
  base: process.env.PUBLIC_BASEPATH || '/',
  devToolbar: {
    enabled: false,
  },
  integrations: [react()],
  vite: {
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
})

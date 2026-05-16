import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

const DATA_PATH = path.resolve('build/data.json')

const shouldFetchData = () => {
  if (process.env.NODE_ENV === 'development') return false
  if (!fs.existsSync(DATA_PATH)) return true
  const mtime = fs.statSync(DATA_PATH).mtimeMs
  const ageHours = (Date.now() - mtime) / (1000 * 60 * 60)
  if (ageHours > 24) {
    console.log('Cached data is older than 24h, re-fetching...')
    return true
  }
  console.log('Using cached data...')
  return false
}

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL,
  base: process.env.PUBLIC_BASEPATH,
  integrations: [react()],
  hooks: {
    'astro:build:start': async () => {
      if (shouldFetchData()) {
        execSync('npx tsx scripts/fetch-data.ts', { stdio: 'inherit', cwd: process.cwd() })
      }
    },
  },
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

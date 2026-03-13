import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  output: 'static',
  integrations: [react()],
  vite: {
    // @ts-expect-error - tailwindcss vite plugin type mismatch with vite version
    plugins: [tailwindcss()],
  },
  base: process.env.PUBLIC_BASEPATH ?? '/',
})

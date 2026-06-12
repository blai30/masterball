import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

import { getCache, getStats, seedCache } from './pokeapi'

// Persist pokeapi responses inside node_modules/.astro: it is already git-ignored, and
// crucially it is the one directory Cloudflare Pages restores between builds for Astro
// projects (GitHub Actions caches the same path explicitly), so the cache survives.
const CACHE_FILE = resolve('node_modules/.astro/pokeapi-cache.json')

// Load the persisted responses into the in-memory cache so a build (or dev server)
// can reuse them instead of refetching every resource from the network.
export function loadCache(): void {
  if (!existsSync(CACHE_FILE)) {
    // No file means the CI cache step did not restore anything (or this is the first
    // build), so every request will go to the network. Surface it loudly.
    console.log(`[pokeapi-cache] no cache file at ${CACHE_FILE}, fetching from network`)
    return
  }

  const raw = readFileSync(CACHE_FILE, 'utf-8')
  const data = JSON.parse(raw) as Record<string, unknown>
  seedCache(data)
  console.log(`[pokeapi-cache] loaded ${Object.keys(data).length} responses from disk`)
}

// Persist everything fetched during the build so the next build can reuse it.
export function saveCache(): void {
  // Report how the build actually used the cache. High misses on a build that
  // claimed to load responses means the cache is stale or not covering everything.
  const stats = getStats()
  console.log(
    `[pokeapi-cache] ${stats.hits} cache hits, ${stats.misses} network fetches this build`
  )

  const cache = getCache()
  if (cache.size === 0) return

  const data = Object.fromEntries(cache)
  mkdirSync(dirname(CACHE_FILE), { recursive: true })
  writeFileSync(CACHE_FILE, JSON.stringify(data))
  console.log(`[pokeapi-cache] saved ${cache.size} responses to disk`)
}

import fs from 'node:fs'
import path from 'node:path'

import type { NamedAPIResourceList } from 'pokedex-promise-v2'

const BASE_URL = 'https://pokeapi.co/api/v2/'

// Module-level cache for build-time request deduplication.
// Lazily seeded from build/data.json (populated by the pre-build script).
const cache = new Map<string, unknown>()
let fileCacheLoaded = false

const loadFileCache = () => {
  if (fileCacheLoaded) return

  const fileCachePath = path.resolve('build/data.json')
  if (!fs.existsSync(fileCachePath)) return

  const raw = fs.readFileSync(fileCachePath, 'utf-8')
  const data = JSON.parse(raw) as Record<string, unknown>
  for (const [url, value] of Object.entries(data)) {
    cache.set(url, value)
  }
  fileCacheLoaded = true
}

const cachedFetch = async <T>(url: string): Promise<T> => {
  loadFileCache()

  if (cache.has(url)) {
    return cache.get(url) as T
  }

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`)
  }

  const data = await response.json()
  cache.set(url, data)
  return data
}

const pokeapi = {
  /**
   * Gets a list of resources with pagination
   */
  getList: async (endpoint: string, limit = 1025, offset = 0): Promise<NamedAPIResourceList> => {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    })

    const url = new URL(endpoint, BASE_URL)
    url.search = params.toString()
    return await cachedFetch<NamedAPIResourceList>(url.toString())
  },

  /**
   * Gets a resource by name or ID
   */
  getByName: async <T>(endpoint: string, nameOrId?: string | number): Promise<T> => {
    const url = new URL(endpoint, BASE_URL)
    if (nameOrId) {
      url.pathname += `/${nameOrId}`
    }
    return await cachedFetch<T>(url.toString())
  },

  /**
   * Gets a resource from a full URL
   */
  getResource: async <T>(url: string): Promise<T> => {
    return await cachedFetch<T>(url)
  },
}

export default pokeapi

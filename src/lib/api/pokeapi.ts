import fs from 'node:fs'
import path from 'node:path'
import type { NamedAPIResourceList } from 'pokedex-promise-v2'

const BASE_URL = 'https://pokeapi.co/api/v2/'
const DATA_PATH = path.resolve('build/data.json')

// Pre-loaded data from cached JSON (build-time) or fetched live (dev-time).
let dataCache: Map<string, unknown> | null = null

function loadCachedData(): Map<string, unknown> {
  if (dataCache) return dataCache
  dataCache = new Map<string, unknown>()
  if (fs.existsSync(DATA_PATH)) {
    const raw = fs.readFileSync(DATA_PATH, 'utf-8')
    const json: Record<string, unknown> = JSON.parse(raw)
    for (const [url, value] of Object.entries(json)) {
      dataCache.set(url, value)
    }
  }
  return dataCache
}

// Module-level cache for build-time request deduplication.
// Stores Promises (not resolved values) so concurrent requests for the same URL share a single in-flight fetch.
const requestCache = new Map<string, Promise<unknown>>()

async function fetchFromCacheOrNetwork<T>(url: string): Promise<T> {
  const cache = loadCachedData()
  if (cache.has(url)) {
    return cache.get(url) as T
  }

  if (!requestCache.has(url)) {
    requestCache.set(
      url,
      fetch(url).then((res) => {
        if (!res.ok) {
          console.log(res)
          throw new Error(`Failed to fetch ${url}: ${res.statusText}`)
        }
        return res.json()
      })
    )
  }
  return requestCache.get(url) as Promise<T>
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
    return fetchFromCacheOrNetwork<NamedAPIResourceList>(url.toString())
  },

  /**
   * Gets a resource by name or ID
   */
  getByName: async <T>(endpoint: string, nameOrId?: string | number): Promise<T> => {
    const url = new URL(endpoint, BASE_URL)
    if (nameOrId) {
      url.pathname += `/${nameOrId}`
    }
    return fetchFromCacheOrNetwork<T>(url.toString())
  },

  /**
   * Gets a resource from a full URL
   */
  getResource: async <T>(url: string): Promise<T> => {
    return fetchFromCacheOrNetwork<T>(url)
  },
}

export default pokeapi

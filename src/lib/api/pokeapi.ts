import type { NamedAPIResourceList } from 'pokedex-promise-v2'

const BASE_URL = 'https://pokeapi.co/api/v2/'

const fetchJson = async <T>(url: string): Promise<T> => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`)
  }

  return await response.json()
}

// Module-level cache for build-time request deduplication. Stores the in-flight
// promise so concurrent identical requests collapse into a single fetch, backed by
// a per-URL disk cache that persists across builds (see cache.ts).
const memoryCache = new Map<string, Promise<unknown>>()

const loadOrFetch = async <T>(url: string): Promise<T> => {
  // Disk cache only exists at build time. The dynamic import is guarded by SSR so
  // cache.ts (and its node:fs / process.env usage) is dead-code-eliminated from the
  // client bundle, where pokeapi is reachable via pokeapi-helpers.
  const diskCache = import.meta.env.SSR ? await import('@/lib/api/cache') : null

  if (diskCache) {
    const cached = await diskCache.readCache<T>(url)
    if (cached !== undefined) return cached
  }

  const data = await fetchJson<T>(url)
  if (diskCache) await diskCache.writeCache(url, data)
  return data
}

const cachedFetch = <T>(url: string): Promise<T> => {
  const existing = memoryCache.get(url)
  if (existing) return existing as Promise<T>

  const promise = loadOrFetch<T>(url)
  // Drop failed requests so a later call can retry instead of inheriting the rejection.
  promise.catch(() => memoryCache.delete(url))
  memoryCache.set(url, promise)
  return promise
}

const pokeapi = {
  /**
   * Gets a list of resources with pagination.
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
   * Gets a resource by name or Id.
   */
  getByName: async <T>(endpoint: string, nameOrId?: string | number): Promise<T> => {
    const url = new URL(endpoint, BASE_URL)
    if (nameOrId) {
      url.pathname += `/${nameOrId}`
    }
    return await cachedFetch<T>(url.toString())
  },

  /**
   * Gets a resource from a full URL.
   */
  getResource: async <T>(url: string): Promise<T> => {
    return await cachedFetch<T>(url)
  },
}

export default pokeapi

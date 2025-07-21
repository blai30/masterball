import type { NamedAPIResourceList } from 'pokedex-promise-v2'
import pMap from 'p-map'

const BASE_URL = 'https://pokeapi.co/api/v2/'

// Optimized concurrency - PokeAPI can handle more concurrent requests
const DEFAULT_CONCURRENCY = 8

// Request deduplication map
const pendingRequests = new Map<string, Promise<any>>()

// Runtime cache for client-side usage
const runtimeCache = new Map<string, any>()

/**
 * Enhanced fetch with request deduplication and error handling
 */
const enhancedFetch = async <T>(url: string): Promise<T> => {
  // Check if request is already pending
  if (pendingRequests.has(url)) {
    return pendingRequests.get(url)!
  }

  // Create new request
  const request = fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`)
    }
    return res.json()
  }).finally(() => {
    // Clean up pending request
    pendingRequests.delete(url)
  })

  pendingRequests.set(url, request)
  return request
}

/**
 * Enhanced fetch with caching (build-time only, runtime for client-side)
 */
const cachedFetch = async <T>(url: string, cacheKey?: string): Promise<T> => {
  const key = cacheKey || url
  
  // Check runtime cache first
  if (runtimeCache.has(key)) {
    return runtimeCache.get(key)
  }

  // For build-time caching, we'll handle this in the data service
  const data = await enhancedFetch<T>(url)
  
  // Cache in runtime cache
  runtimeCache.set(key, data)
  
  return data
}

const pokeapi = {
  /**
   * Gets a list of resources with pagination
   */
  getList: async (
    endpoint: string,
    limit = 1025,
    offset = 0
  ): Promise<NamedAPIResourceList> => {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    })
    const url = new URL(endpoint, BASE_URL)
    url.search = params.toString()
    
    const cacheKey = `list:${endpoint}:${limit}:${offset}`
    return cachedFetch<NamedAPIResourceList>(url.toString(), cacheKey)
  },

  /**
   * Gets a resource by name or ID
   */
  getByName: async <T>(
    endpoint: string,
    nameOrId?: string | number
  ): Promise<T> => {
    const url = new URL(endpoint, BASE_URL)
    if (nameOrId) {
      url.pathname += `/${nameOrId}`
    }
    
    const cacheKey = `byName:${endpoint}:${nameOrId}`
    return cachedFetch<T>(url.toString(), cacheKey)
  },

  /**
   * Gets a resource from a full URL
   */
  getResource: async <T>(url: string): Promise<T> => {
    return cachedFetch<T>(url)
  },

  /**
   * Batch fetch multiple resources in parallel with optimized concurrency
   */
  batchFetch: async <T>(
    urls: string[],
    concurrency = DEFAULT_CONCURRENCY
  ): Promise<T[]> => {
    return pMap(urls, (url) => cachedFetch<T>(url), { concurrency })
  },

  /**
   * Batch fetch with transformation
   */
  batchFetchAndTransform: async <T, R>(
    items: T[],
    transformer: (item: T) => Promise<R>,
    concurrency = DEFAULT_CONCURRENCY
  ): Promise<R[]> => {
    return pMap(items, transformer, { concurrency })
  },
}

export default pokeapi

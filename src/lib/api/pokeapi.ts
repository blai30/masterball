import type { NamedAPIResourceList } from 'pokedex-promise-v2'

const BASE_URL = 'https://pokeapi.co/api/v2/'

// Module-level cache for build-time request deduplication.
// Stores Promises (not resolved values) so concurrent requests for the same URL share a single in-flight fetch.
const cache = new Map<string, Promise<unknown>>()

function cachedFetch<T>(url: string): Promise<T> {
  if (!cache.has(url)) {
    cache.set(
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
  return cache.get(url) as Promise<T>
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
    return cachedFetch<NamedAPIResourceList>(url.toString())
  },

  /**
   * Gets a resource by name or ID
   */
  getByName: async <T>(endpoint: string, nameOrId?: string | number): Promise<T> => {
    const url = new URL(endpoint, BASE_URL)
    if (nameOrId) {
      url.pathname += `/${nameOrId}`
    }
    return cachedFetch<T>(url.toString())
  },

  /**
   * Gets a resource from a full URL
   */
  getResource: async <T>(url: string): Promise<T> => {
    return cachedFetch<T>(url)
  },
}

export default pokeapi

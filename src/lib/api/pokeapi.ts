import type { NamedAPIResourceList } from 'pokedex-promise-v2'

const BASE_URL = 'https://pokeapi.co/api/v2/'

async function fetchWithRetry(url: string, retries = 3, delayMs = 1000): Promise<Response> {
  let lastError: Error | null = null
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url)
      if (res.ok) return res
      if (attempt < retries && (res.status === 429 || res.status >= 500)) {
        await new Promise((r) => setTimeout(r, delayMs * 2 ** attempt))
        continue
      }
      console.log(res)
      throw new Error(`Failed to fetch ${url}: ${res.statusText}`)
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err))
      if (attempt < retries) {
        console.warn(`Attempt ${attempt + 1} failed for ${url}, retrying...`)
        await new Promise((r) => setTimeout(r, delayMs * 2 ** attempt))
        continue
      }
    }
  }
  throw lastError || new Error(`Failed to fetch ${url} after ${retries} retries`)
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
    return fetchWithRetry(url.toString()).then((res) => res.json())
  },

  /**
   * Gets a resource by name or ID
   */
  getByName: async <T>(endpoint: string, nameOrId?: string | number): Promise<T> => {
    const url = new URL(endpoint, BASE_URL)
    if (nameOrId) {
      url.pathname += `/${nameOrId}`
    }
    return fetchWithRetry(url.toString()).then((res) => res.json())
  },

  /**
   * Gets a resource from a full URL
   */
  getResource: async <T>(url: string): Promise<T> => {
    return fetchWithRetry(url).then((res) => res.json())
  },
}

export default pokeapi

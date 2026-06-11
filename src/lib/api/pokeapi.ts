import type { NamedAPIResourceList } from 'pokedex-promise-v2'

const BASE_URL = 'https://pokeapi.co/api/v2/'

const fetchJson = async <T>(url: string): Promise<T> => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`)
  }

  return await response.json()
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
    return await fetchJson<NamedAPIResourceList>(url.toString())
  },

  /**
   * Gets a resource by name or Id.
   */
  getByName: async <T>(endpoint: string, nameOrId?: string | number): Promise<T> => {
    const url = new URL(endpoint, BASE_URL)
    if (nameOrId) {
      url.pathname += `/${nameOrId}`
    }
    return await fetchJson<T>(url.toString())
  },

  /**
   * Gets a resource from a full URL.
   */
  getResource: async <T>(url: string): Promise<T> => {
    return await fetchJson<T>(url)
  },
}

export default pokeapi

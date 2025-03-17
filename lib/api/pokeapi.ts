import path from 'path'
import type { NamedAPIResourceList } from 'pokedex-promise-v2'

const BASE_URL = 'https://pokeapi.co/api/v2'

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
    return fetch(path.join(BASE_URL, endpoint, `?${params.toString()}`)).then(
      (res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch ${endpoint}: ${res.statusText}`)
        }
        return res.json()
      }
    )
  },

  /**
   * Gets a resource by name or ID
   */
  get: async <T>(endpoint: string, nameOrId?: string | number): Promise<T> => {
    const url = path.join(
      BASE_URL,
      endpoint,
      nameOrId !== undefined ? `${nameOrId}` : ''
    )
    return fetch(url).then((res) => {
      if (!res.ok) {
        throw new Error(`Failed to fetch ${endpoint}: ${res.statusText}`)
      }
      return res.json()
    })
  },

  /**
   * Gets a resource from a full URL
   */
  getResource: async <T>(url: string): Promise<T> => {
    return fetch(url).then((res) => {
      if (!res.ok) {
        throw new Error(`Failed to fetch ${url}: ${res.statusText}`)
      }
      return res.json()
    })
  },
}

export default pokeapi

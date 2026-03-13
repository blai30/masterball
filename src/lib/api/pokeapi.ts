import type { NamedAPIResourceList } from 'pokedex-promise-v2'

const BASE_URL = 'https://pokeapi.co/api/v2/'

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
    return fetch(url.toString()).then((res) => {
      if (!res.ok) {
        console.log(res)
        throw new Error(`Failed to fetch ${endpoint}: ${res.statusText}`)
      }
      return res.json()
    })
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
    return fetch(url).then((res) => {
      if (!res.ok) {
        console.log(res)
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
        console.log(res)
        throw new Error(`Failed to fetch ${url}: ${res.statusText}`)
      }
      return res.json()
    })
  },
}

export default pokeapi

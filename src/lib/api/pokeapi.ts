import fs from 'node:fs'
import path from 'node:path'
import type { NamedAPIResourceList } from 'pokedex-promise-v2'

const BASE_URL = 'https://pokeapi.co/api/v2/'

// Load cached data if available (local-first, network fallback)
const localCache = new Map<string, unknown>()
const dataPath = path.resolve(process.cwd(), 'build', 'data.json')
try {
  if (fs.existsSync(dataPath)) {
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
    for (const [k, v] of Object.entries(data)) {
      localCache.set(k, v)
    }
    console.log('Loaded local PokeAPI cache from build/data.json')
  }
} catch {
  // Ignore - will fall back to network
}

// Resolve from local cache, fall back to network fetch
async function resolve<T>(url: string): Promise<T> {
  const cached = localCache.get(url)
  if (cached !== undefined) return cached as T

  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.statusText}`)
  return res.json()
}

const pokeapi = {
  getList: async (endpoint: string, limit = 1025, offset = 0): Promise<NamedAPIResourceList> => {
    const url = new URL(endpoint, BASE_URL)
    url.search = new URLSearchParams({ limit: String(limit), offset: String(offset) }).toString()
    return resolve<NamedAPIResourceList>(url.toString())
  },

  getByName: async <T>(endpoint: string, nameOrId: string | number): Promise<T> => {
    const url = new URL(endpoint, BASE_URL)
    url.pathname += `/${nameOrId}`
    return resolve<T>(url.toString())
  },

  getResource: async <T>(url: string): Promise<T> => resolve<T>(url),

  isLocal: () => localCache.size > 0,
}

export default pokeapi

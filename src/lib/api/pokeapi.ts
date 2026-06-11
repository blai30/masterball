import type { NamedAPIResourceList } from 'pokedex-promise-v2'

const BASE_URL = 'https://pokeapi.co/api/v2/'

// Process-global cache for build-time request deduplication and cross-build
// persistence. Backed by globalThis so the single in-memory Map is shared between
// the build integration (which loads/saves it to disk) and the page/SSR modules
// that read and populate it, even though they are separate module instances.
const globalCache = globalThis as typeof globalThis & {
  __pokeapiCache__?: Map<string, unknown>
  __pokeapiStats__?: { hits: number; misses: number }
}
const cache = (globalCache.__pokeapiCache__ ??= new Map<string, unknown>())
// Hit/miss counters share globalThis with the cache for the same reason: the build
// integration and the page modules are separate module instances, so module-local
// counters would split the tally and report zero where the work actually happened.
const stats = (globalCache.__pokeapiStats__ ??= { hits: 0, misses: 0 })

/**
 * Gets the cache as read-only for dumping to disk.
 */
export const getCache = (): ReadonlyMap<string, unknown> => {
  return cache
}

/**
 * Gets per-build cache hit/miss counters for logging.
 */
export const getStats = (): { hits: number; misses: number; size: number } => {
  return { hits: stats.hits, misses: stats.misses, size: cache.size }
}

/**
 * Seed the cache with persisted API data. Used by the disk-cache loader.
 */
export function seedCache(data: Record<string, unknown>): void {
  for (const [url, value] of Object.entries(data)) {
    cache.set(url, value)
  }
}

// A build-time crawl makes thousands of requests to pokeapi, so each request is
// bounded by a timeout and retried with exponential backoff to ride out transient
// network failures and rate limits instead of aborting the whole build.
const MAX_RETRIES = 7
const REQUEST_TIMEOUT_MS = 30_000
const MAX_BACKOFF_MS = 30_000

// pokeapi sits behind Cloudflare, which serves transient 5xx and 429 under load,
// especially to shared CI egress IPs. Those (and status-less network/timeout errors)
// are worth retrying; a genuine 4xx like 404 is not and should fail fast.
const isRetryable = (status: number | undefined): boolean =>
  status === undefined || status === 408 || status === 429 || status >= 500

const fetchJson = async <T>(url: string): Promise<T> => {
  const response = await fetch(url, { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) })
  if (!response.ok) {
    throw Object.assign(
      new Error(`Failed to fetch ${url} - ${response.status} ${response.statusText}`),
      { status: response.status }
    )
  }
  return response.json()
}

const cachedFetch = async <T>(url: string): Promise<T> => {
  if (cache.has(url)) {
    stats.hits++
    return cache.get(url) as T
  }

  stats.misses++
  for (let attempt = 0; ; attempt++) {
    try {
      const data = await fetchJson<T>(url)
      cache.set(url, data)
      return data
    } catch (error) {
      const status = (error as { status?: number }).status
      if (!isRetryable(status) || attempt >= MAX_RETRIES) throw error
      // Exponential backoff capped at MAX_BACKOFF_MS, plus random jitter so a burst of
      // concurrent requests does not retry in lockstep and re-trip the rate limit.
      const backoff = Math.min(2 ** attempt * 1000, MAX_BACKOFF_MS)
      await new Promise((resolve) => setTimeout(resolve, backoff + Math.random() * 1000))
    }
  }
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
   * Gets a resource by name or id.
   */
  getByName: async <T>(endpoint: string, nameOrId?: string | number): Promise<T> => {
    const url = new URL(endpoint, BASE_URL)
    if (nameOrId) {
      url.pathname += `/${nameOrId}`
    }
    return await cachedFetch<T>(url.toString())
  },

  /**
   * Gets a resource from a full url.
   */
  getResource: async <T>(url: string): Promise<T> => {
    return await cachedFetch<T>(url)
  },
}

export default pokeapi

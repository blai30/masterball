import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

// Per-URL disk cache for pokeapi responses. Lives under node_modules/.cache so it
// is gitignored and persists across builds (Vercel keeps node_modules/.cache; other
// CI restores it via a cache step). Entries never expire; clear by deleting the dir.
const CACHE_DIR = path.resolve('node_modules/.cache/pokeapi')

// Set FRESH_DATA=1 to bypass reads and refetch everything (still rewrites the cache).
const FRESH = process.env.FRESH_DATA === '1'
const BASE_URL = 'https://pokeapi.co/api/v2/'

let dirReady: Promise<void> | undefined

const ensureDir = (): Promise<void> => {
  if (!dirReady) {
    dirReady = mkdir(CACHE_DIR, { recursive: true }).then(() => undefined)
  }
  return dirReady
}

// Readable, collision-safe filename: strip the API prefix and replace non-alphanumeric
// runs with underscores. Query params (e.g. ?limit=1025) stay part of the name, so list
// endpoints remain distinct.
const cacheFilePath = (url: string): string => {
  const name = url.replace(BASE_URL, '').replace(/[^a-z0-9]+/gi, '_')
  return path.join(CACHE_DIR, `${name}.json`)
}

export const readCache = async <T>(url: string): Promise<T | undefined> => {
  if (FRESH) return undefined
  try {
    const raw = await readFile(cacheFilePath(url), 'utf-8')
    return JSON.parse(raw) as T
  } catch {
    // Missing file or unreadable entry: treat as a cache miss.
    return undefined
  }
}

export const writeCache = async <T>(url: string, data: T): Promise<void> => {
  await ensureDir()
  await writeFile(cacheFilePath(url), JSON.stringify(data))
}

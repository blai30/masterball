import { promises as fs } from 'fs'
import { join } from 'path'
import { createHash } from 'crypto'

const CACHE_DIR = join(process.cwd(), '.next-cache')
const CACHE_VERSION = '1.0.0'

type CacheEntry<T> = {
  version: string
  timestamp: number
  ttl: number
  data: T
}

class BuildCache {
  private async ensureCacheDir(): Promise<void> {
    try {
      await fs.access(CACHE_DIR)
    } catch {
      await fs.mkdir(CACHE_DIR, { recursive: true })
    }
  }

  private getCacheKey(key: string): string {
    return createHash('md5').update(key).digest('hex')
  }

  private getCachePath(key: string): string {
    const hashedKey = this.getCacheKey(key)
    return join(CACHE_DIR, `${hashedKey}.json`)
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      await this.ensureCacheDir()
      const cachePath = this.getCachePath(key)
      const data = await fs.readFile(cachePath, 'utf-8')
      const entry: CacheEntry<T> = JSON.parse(data)

      // Check version and TTL
      if (
        entry.version !== CACHE_VERSION ||
        Date.now() > entry.timestamp + entry.ttl
      ) {
        await this.delete(key)
        return null
      }

      return entry.data
    } catch {
      return null
    }
  }

  async set<T>(key: string, data: T, ttlMs: number = 24 * 60 * 60 * 1000): Promise<void> {
    try {
      await this.ensureCacheDir()
      const cachePath = this.getCachePath(key)
      const entry: CacheEntry<T> = {
        version: CACHE_VERSION,
        timestamp: Date.now(),
        ttl: ttlMs,
        data,
      }
      await fs.writeFile(cachePath, JSON.stringify(entry), 'utf-8')
    } catch (error) {
      console.warn('Failed to write to cache:', error)
    }
  }

  async delete(key: string): Promise<void> {
    try {
      const cachePath = this.getCachePath(key)
      await fs.unlink(cachePath)
    } catch {
      // Ignore errors if file doesn't exist
    }
  }

  async clear(): Promise<void> {
    try {
      const files = await fs.readdir(CACHE_DIR)
      await Promise.all(
        files.map((file) => fs.unlink(join(CACHE_DIR, file)))
      )
    } catch {
      // Ignore errors if directory doesn't exist
    }
  }

  async has(key: string): Promise<boolean> {
    const data = await this.get(key)
    return data !== null
  }
}

export const buildCache = new BuildCache()
export default buildCache
import fs from 'node:fs'
import path from 'node:path'

import { seedCache } from '@/lib/api/pokeapi'

let initialized = false

export function init(): void {
  if (initialized) return
  initialized = true

  const fileCachePath = path.resolve('build/data.json')
  if (!fs.existsSync(fileCachePath)) return

  const raw = fs.readFileSync(fileCachePath, 'utf-8')
  const data = JSON.parse(raw) as Record<string, unknown>
  seedCache(data)
  console.log('Cache seeded with pre-fetched data')
}

// Auto-initialize on import
init()

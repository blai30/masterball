import { resolvePath } from '@/lib/utils/path'
import type { MovesDataMap, MovesDescriptionsMap } from '@/lib/utils/pokeapi-helpers'

// Shared move datasets are static JSON files generated at build time. Each is
// fetched at most once per session; the in-flight promise is memoized so multiple
// components (and repeat calls) reuse the same request, and the browser HTTP cache
// covers navigations across pages.

let movesDataPromise: Promise<MovesDataMap> | null = null
let descriptionsPromise: Promise<MovesDescriptionsMap> | null = null

export function loadMovesData(): Promise<MovesDataMap> {
  if (!movesDataPromise) {
    movesDataPromise = fetch(resolvePath('/data/moves-data.json')).then((response) => {
      if (!response.ok) throw new Error(`Failed to load moves data: ${response.status}`)
      return response.json() as Promise<MovesDataMap>
    })
  }
  return movesDataPromise
}

export function loadMovesDescriptions(): Promise<MovesDescriptionsMap> {
  if (!descriptionsPromise) {
    descriptionsPromise = fetch(resolvePath('/data/moves-descriptions.json')).then((response) => {
      if (!response.ok) throw new Error(`Failed to load move descriptions: ${response.status}`)
      return response.json() as Promise<MovesDescriptionsMap>
    })
  }
  return descriptionsPromise
}

import type { APIRoute } from 'astro'
import pMap from 'p-map'
import type { Move } from 'pokedex-promise-v2'

import pokeapi from '@/lib/api/pokeapi'
import { buildMoveDescriptions, type MovesDescriptionsMap } from '@/lib/utils/pokeapi-helpers'

// Shared per-version move descriptions, keyed by slug then version group.
// Prerendered to a static /data/moves-descriptions.json file, fetched lazily
// only when a user expands a move row in a non-default version group.
export const GET: APIRoute = async () => {
  const list = await pokeapi.getList('move', 1200)
  const moves = await pMap(list.results, (result) => pokeapi.getResource<Move>(result.url), {
    concurrency: 10,
  })

  const descriptions: MovesDescriptionsMap = {}
  for (const move of moves) {
    descriptions[move.name] = buildMoveDescriptions(move)
  }

  return new Response(JSON.stringify(descriptions), {
    headers: { 'Content-Type': 'application/json' },
  })
}

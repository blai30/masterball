import type { APIRoute } from 'astro'
import pMap from 'p-map'
import type { Move } from 'pokedex-promise-v2'

import pokeapi from '@/lib/api/pokeapi'
import { buildMoveData, type MovesDataMap } from '@/lib/utils/pokeapi-helpers'

// Shared, version-invariant move data for every move, keyed by slug.
// Prerendered to a static /data/moves-data.json file, loaded once on the client.
export const GET: APIRoute = async () => {
  const list = await pokeapi.getList('move', 1200)
  const moves = await pMap(list.results, (result) => pokeapi.getResource<Move>(result.url), {
    concurrency: 10,
  })

  const data: MovesDataMap = {}
  for (const move of moves) {
    data[move.name] = buildMoveData(move)
  }

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  })
}

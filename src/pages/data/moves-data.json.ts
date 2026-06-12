import type { APIRoute } from 'astro'

import { buildMovesDataMap } from '@/lib/domain/moves'

// Shared, version-invariant move data for every move, keyed by slug.
// Prerendered to a static /data/moves-data.json file, loaded once on the client.
export const GET: APIRoute = async () => {
  return new Response(JSON.stringify(await buildMovesDataMap()), {
    headers: { 'Content-Type': 'application/json' },
  })
}

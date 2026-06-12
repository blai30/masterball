import type { APIRoute } from 'astro'

import { buildMovesDescriptionsMap } from '@/lib/domain/moves'

// Shared per-version move descriptions, keyed by slug then version group.
// Prerendered to a static /data/moves-descriptions.json file, fetched lazily
// only when a user expands a move row in a non-default version group.
export const GET: APIRoute = async () => {
  return new Response(JSON.stringify(await buildMovesDescriptionsMap()), {
    headers: { 'Content-Type': 'application/json' },
  })
}

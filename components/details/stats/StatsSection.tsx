import type { Pokemon } from 'pokedex-promise-v2'
import StatsTabs from '@/components/details/stats/StatsTabs'

export default async function StatsSection({ pokemon }: { pokemon: Pokemon }) {
  const title = 'Stats'
  return <StatsTabs title={title} pokemon={pokemon} />
}

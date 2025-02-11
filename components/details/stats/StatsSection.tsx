import { Pokemon } from 'pokedex-promise-v2'
import { pokeapi } from '@/lib/providers'
import GlassCard from '@/components/GlassCard'
import StatsBarChart from '@/components/details/stats/StatsBarChart'
import StatsRadarChart from '@/components/details/stats/StatsRadarChart'

export default async function StatsSection({ pokemon }: { pokemon: Pokemon }) {
  const title = 'Stats'
  const stats = await pokeapi.getStatByName(
    pokemon.stats.map((stat) => stat.stat.name)
  )

  return (
    <section className="flex grow flex-col gap-4 px-4 py-6">
      <h2 className="text-xl font-medium text-black dark:text-white">
        {title}
      </h2>
      <div className="flex w-full flex-col items-start gap-2">
        <GlassCard className="w-full p-4">
          <StatsBarChart pokemon={pokemon} stats={stats} />
        </GlassCard>

        <GlassCard className="flex w-full flex-col items-center px-8 py-10">
          {/* Radar chart */}
          <StatsRadarChart pokemon={pokemon} stats={stats} />
        </GlassCard>
      </div>
    </section>
  )
}

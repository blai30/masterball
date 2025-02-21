import { Pokemon } from 'pokedex-promise-v2'
import { pokeapi } from '@/lib/providers'
import StatsBarChart from '@/components/details/stats/StatsBarChart'
import StatsRadarChart from '@/components/details/stats/StatsRadarChart'

export default async function StatsSection({ pokemon }: { pokemon: Pokemon }) {
  const title = 'Stats'
  const stats = await pokeapi.getStatByName(
    pokemon.stats.map((stat) => stat.stat.name)
  )

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-medium text-black dark:text-white">
        {title}
      </h2>
      <div className="flex h-full w-full flex-col items-start gap-2 md:flex-row lg:flex-col xl:flex-row">
        <div className="w-full">
          <StatsBarChart pokemon={pokemon} stats={stats} />
        </div>

        <div className="flex h-full w-full flex-col items-center justify-center px-6 py-8">
          {/* Radar chart */}
          <StatsRadarChart pokemon={pokemon} stats={stats} />
        </div>
      </div>
    </section>
  )
}

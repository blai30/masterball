import clsx from 'clsx/lite'
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
    <section className="flex min-h-max flex-1 flex-col gap-4 sm:min-h-full lg:min-h-max xl:min-h-full">
      <h2 className="sr-only text-xl font-medium text-black dark:text-white">
        {title}
      </h2>
      <div className="flex h-full w-full flex-col items-start gap-2">
        <div
          className={clsx(
            'w-full p-4',
            'rounded-tl-2xl rounded-tr-2xl sm:rounded-tr-none lg:rounded-tr-2xl xl:rounded-tr-none'
          )}
        >
          <StatsBarChart pokemon={pokemon} stats={stats} />
        </div>

        <div className="flex h-full w-full flex-col items-center justify-center rounded-bl-none px-8 py-10 sm:rounded-bl-2xl lg:rounded-bl-none xl:rounded-bl-2xl">
          {/* Radar chart */}
          <StatsRadarChart pokemon={pokemon} stats={stats} />
        </div>
      </div>
    </section>
  )
}

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
    <section className="flex grow flex-col gap-4">
      {/* <h2 className="text-xl font-medium text-black dark:text-white">
        {title}
      </h2> */}
      <div className="flex w-full flex-col items-start gap-2">
        <GlassCard
          className={clsx(
            'w-full p-4',
            'rounded-tl-2xl rounded-tr-2xl sm:rounded-tr-none lg:rounded-tr-2xl xl:rounded-tr-none'
          )}
        >
          <StatsBarChart pokemon={pokemon} stats={stats} />
        </GlassCard>

        <GlassCard
          className={clsx('flex w-full flex-col items-center px-8 py-10 rounded-bl-none sm:rounded-bl-2xl lg:rounded-bl-none xl:rounded-bl-2xl')}
        >
          {/* Radar chart */}
          <StatsRadarChart pokemon={pokemon} stats={stats} />
        </GlassCard>
      </div>
    </section>
  )
}

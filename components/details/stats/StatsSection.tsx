import type { Pokemon } from 'pokedex-promise-v2'
import StatsBarChart from '@/components/details/stats/StatsBarChart'
import StatsRadarChart from '@/components/details/stats/StatsRadarChart'

export default async function StatsSection({ pokemon }: { pokemon: Pokemon }) {
  const title = 'Stats'

  return (
    <section className="@container/stats flex flex-col gap-4 rounded-xl p-4 inset-ring-1 inset-ring-zinc-200 dark:inset-ring-zinc-800">
      <h2 className="text-xl font-medium text-black dark:text-white">
        {title}
      </h2>
      <div className="flex h-full w-full flex-col items-start gap-2 @2xl/stats:flex-row">
        <div className="w-full">
          <StatsBarChart pokemon={pokemon} />
        </div>
        <div className="flex h-full w-full flex-col items-center justify-center pt-5 pb-8 @2xl/stats:pt-0">
          <StatsRadarChart pokemon={pokemon} />
        </div>
      </div>
    </section>
  )
}

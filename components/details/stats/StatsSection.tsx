import clsx from 'clsx/lite'
import { Pokemon } from 'pokedex-promise-v2'
import { pokeapi } from '@/lib/providers'
import {
  getTranslation,
  StatLabels,
  StatName,
} from '@/lib/utils/pokeapiHelpers'
import StatsRadarChart from '@/components/details/stats/StatsRadarChart'

export default async function StatsSection({ pokemon }: { pokemon: Pokemon }) {
  const title = 'Stats'
  const stats = await pokeapi.getStatByName(
    pokemon.stats.map((stat) => stat.stat.name)
  )
  const statTotal = pokemon.stats.reduce((acc, stat) => acc + stat.base_stat, 0)

  return (
    <section className="flex flex-col gap-4 px-4 py-6">
      <h2 className="text-xl font-medium text-black dark:text-white">
        {title}
      </h2>
      <div className="flex w-full flex-col items-start gap-2 md:flex-row">
        <div
          className={clsx(
            'w-full p-4 md:w-1/2',
            'rounded-l-sm rounded-tr-sm rounded-br-xl backdrop-blur-md',
            'bg-gradient-to-br from-zinc-100/60 to-zinc-200/60 to-75% inset-ring-1 inset-ring-zinc-200/60 transition-colors dark:from-zinc-800/60 dark:to-zinc-900/60 dark:inset-ring-zinc-800/60'
          )}
        >
          {/* Bar chart */}
          <ul className="flex flex-col">
            {stats.map((stat) => {
              const name = getTranslation(stat.names, 'name')
              const pokemonStat = pokemon.stats.find(
                (s) => s.stat.name === stat.name
              )!
              const fillPercentage = (
                (pokemonStat.base_stat / 255) *
                100
              ).toFixed(4)
              return (
                <li key={stat.id} className="flex flex-row items-center gap-4">
                  <abbr
                    title={name}
                    aria-label={name}
                    className="xs:min-w-20 min-w-16 font-normal text-zinc-700 no-underline dark:text-zinc-300"
                  >
                    {StatLabels[stat.name as StatName]}
                  </abbr>
                  <p className="font-num xs:min-w-12 min-w-8 text-right text-black tabular-nums dark:text-white">
                    {pokemonStat.base_stat.toLocaleString()}
                  </p>

                  {/* Progress bar visualization */}
                  {/* <div className="2xs:w-36 xs:w-44 flex h-5 w-28 flex-row items-center sm:w-72"> */}
                  <div className="flex h-5 w-full flex-row items-center">
                    <div className="h-full max-w-full flex-grow rounded-l-xs rounded-tr-xs rounded-br-md bg-white dark:bg-black">
                      <div
                        className="h-full rounded-l-xs bg-black dark:bg-white"
                        style={{
                          width: `${fillPercentage}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
          <p>—</p>
          <div className="flex flex-row items-center gap-4">
            <abbr
              title="Base stat total"
              aria-label="Base stat total"
              className="xs:min-w-20 min-w-16 font-normal text-black no-underline dark:text-white"
            >
              Total
            </abbr>
            <p className="font-num xs:min-w-12 min-w-8 text-right text-black tabular-nums dark:text-white">
              {statTotal.toLocaleString()}
            </p>
          </div>
        </div>

        <div
          className={clsx(
            'flex w-full flex-col items-center px-4 py-10 md:w-1/2',
            'rounded-l-sm rounded-tr-sm rounded-br-xl backdrop-blur-md',
            'bg-gradient-to-br from-zinc-100/60 to-zinc-200/60 to-75% inset-ring-1 inset-ring-zinc-200/60 transition-colors dark:from-zinc-800/60 dark:to-zinc-900/60 dark:inset-ring-zinc-800/60'
          )}
        >
          {/* Radar chart */}
          <StatsRadarChart pokemon={pokemon} stats={stats} />
        </div>
      </div>
    </section>
  )
}

import clsx from 'clsx/lite'
import { Pokemon } from 'pokedex-promise-v2'
import { pokeapi } from '@/lib/providers'
import { getTranslation } from '@/lib/utils/pokeapiHelpers'
import StatsRadarChart from '@/components/StatsRadarChart'

const labelMap: Record<string, string> = {
  ['hp']: 'HP',
  ['attack']: 'Attack',
  ['defense']: 'Defense',
  ['special-attack']: 'Sp. Atk',
  ['special-defense']: 'Sp. Def',
  ['speed']: 'Speed',
}

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
      <div className="flex flex-row items-start gap-2">
        <div
          className={clsx(
            'p-2',
            'rounded-l-sm rounded-tr-sm rounded-br-xl',
            'bg-gradient-to-br to-zinc-100 to-75% inset-ring-1 inset-ring-zinc-200 dark:from-zinc-900 dark:to-zinc-950 dark:inset-ring-zinc-800'
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
                    className="min-w-20 font-normal text-black no-underline dark:text-white"
                  >
                    {labelMap[stat.name]}
                  </abbr>
                  <p className="font-num min-w-12 text-right text-black tabular-nums dark:text-white">
                    {pokemonStat.base_stat.toLocaleString()}
                  </p>

                  {/* Progress bar visualization */}
                  <div className="flex h-5 w-72 flex-row items-center">
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
              className="min-w-20 font-normal text-black no-underline dark:text-white"
            >
              Total
            </abbr>
            <p className="font-num min-w-12 text-right text-black tabular-nums dark:text-white">
              {statTotal.toLocaleString()}
            </p>
          </div>

          {/* Radar chart */}
          <StatsRadarChart />
        </div>
      </div>
    </section>
  )
}

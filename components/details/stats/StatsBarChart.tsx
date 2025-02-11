import {
  getTranslation,
  StatLabels,
  StatName,
} from '@/lib/utils/pokeapiHelpers'
import { Pokemon, Stat } from 'pokedex-promise-v2'

export default async function StatsBarChart({
  pokemon,
  stats,
}: {
  pokemon: Pokemon
  stats: Stat[]
}) {
  const statTotal = pokemon.stats.reduce((acc, stat) => acc + stat.base_stat, 0)

  return (
    <div className="w-full">
      {/* Bar chart */}
      <ul className="flex flex-col">
        {stats.map((stat) => {
          const name = getTranslation(stat.names, 'name')
          const pokemonStat = pokemon.stats.find(
            (s) => s.stat.name === stat.name
          )!
          const fillPercentage = ((pokemonStat.base_stat / 255) * 100).toFixed(
            4
          )
          return (
            <li key={stat.id} className="flex flex-row items-center gap-3">
              <p className="flex flex-row items-center justify-between">
                <abbr
                  title={name}
                  aria-label={name}
                  className="min-w-16 font-normal text-zinc-700 no-underline sm:min-w-20 lg:min-w-16 xl:min-w-20 dark:text-zinc-300"
                >
                  {StatLabels[stat.name as StatName]}
                </abbr>
                <span className="font-num min-w-10 text-right text-black tabular-nums sm:min-w-12 lg:min-w-10 xl:min-w-12 dark:text-white">
                  {pokemonStat.base_stat.toLocaleString()}
                </span>
              </p>

              {/* Progress bar visualization */}
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
      <div className="flex flex-row items-center gap-3">
        <p className="flex flex-row items-center justify-between">
          <abbr
            title="Base stat total"
            aria-label="Base stat total"
            className="min-w-16 font-normal text-zinc-700 no-underline sm:min-w-20 lg:min-w-16 xl:min-w-20 dark:text-zinc-300"
          >
            Total
          </abbr>
          <span className="font-num min-w-10 text-right text-black tabular-nums sm:min-w-12 lg:min-w-10 xl:min-w-12 dark:text-white">
            {statTotal.toLocaleString()}
          </span>
        </p>
      </div>
    </div>
  )
}

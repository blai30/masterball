import { Pokemon, Stat } from 'pokedex-promise-v2'
import { getTranslation } from '@/lib/utils/pokeapiHelpers'

const labelMap: Record<string, string> = {
  ['hp']: 'HP',
  ['attack']: 'Attack',
  ['defense']: 'Defense',
  ['special-attack']: 'Sp. Atk',
  ['special-defense']: 'Sp. Def',
  ['speed']: 'Speed',
}

export default function Stats({
  pokemon,
  stats,
}: {
  pokemon: Pokemon
  stats: Stat[]
}) {
  const title = 'Stats'
  const statTotal = pokemon.stats.reduce((acc, stat) => acc + stat.base_stat, 0)

  return (
    <section className="flex flex-col gap-4 px-4 py-6">
      <h2 className="text-lg font-medium text-black dark:text-white">
        {title}
      </h2>
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
            <li key={stat.id} className="flex flex-row items-center gap-4">
              <abbr
                title={name}
                aria-label={name}
                className="min-w-20 font-normal text-black no-underline dark:text-white"
              >
                {labelMap[stat.name]}
              </abbr>
              <p className="min-w-12 text-right text-black tabular-nums dark:text-white">
                {pokemonStat.base_stat.toLocaleString()}
              </p>

              {/* Progress bar visualization */}
              <div className="flex h-5 w-72 flex-row items-center">
                <div className="h-full max-w-full flex-grow rounded-br-md rounded-l-xs rounded-tr-xs bg-zinc-200 dark:bg-zinc-900">
                  <div
                    className="h-full bg-black dark:bg-white rounded-l-xs"
                    style={{
                      width: `${fillPercentage}%`,
                    }}
                  ></div>
                </div>
              </div>
            </li>
          )
        })}
        <p>—</p>
        <li className="flex flex-row items-center gap-4">
          <abbr
            title="Base stat total"
            aria-label="Base stat total"
            className="min-w-20 font-normal text-black no-underline dark:text-white"
          >
            Total
          </abbr>
          <p className="min-w-12 text-right text-black tabular-nums dark:text-white">
            {statTotal.toLocaleString()}
          </p>
        </li>
      </ul>
    </section>
  )
}

import { Pokemon, Stat } from 'pokedex-promise-v2'
import { getTranslation } from '@/lib/utils/pokeapiHelpers'

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
          const pokemonStat = pokemon.stats.find(
            (s) => s.stat.name === stat.name
          )!
          const fillPercentage = ((pokemonStat.base_stat / 255) * 100).toFixed(
            4
          )
          return (
            <li key={stat.id} className="flex flex-row items-center gap-4">
              <h3 className="w-36 font-normal text-black dark:text-white">
                {getTranslation(stat.names, 'name')}
              </h3>
              <p className="w-10 text-right text-black dark:text-white">
                {pokemonStat.base_stat.toLocaleString()}
              </p>

              {/* Progress bar visualization */}
              <div className="flex h-5 w-72 flex-row items-center">
                <div className="h-full w-full rounded-br-md bg-zinc-200 dark:bg-zinc-900">
                  <div
                    className="h-full bg-black pl-2 dark:bg-white"
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
          <h3 className="w-36 font-normal text-black dark:text-white">Total</h3>
          <p className="w-10 text-right text-black dark:text-white">
            {statTotal.toLocaleString()}
          </p>
        </li>
      </ul>
    </section>
  )
}

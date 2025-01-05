import { Pokemon, Stat } from 'pokedex-promise-v2'
import { getTranslation } from '@/lib/utils/pokeapiHelpers'

export default function Stats({
  pokemon,
  stats,
}: {
  pokemon: Pokemon
  stats: Stat[]
}) {
  return (
    <section className="flex flex-col px-4 py-6 gap-4">
      <dt className="text-lg font-medium text-black dark:text-white">Stats</dt>
      <dd className="text-lg text-zinc-600 dark:text-zinc-400">
        {stats.map((stat) => {
          const pokemonStat = pokemon.stats.find(
            (s) => s.stat.name === stat.name
          )!
          return (
            <p key={stat.name}>
              <span className="font-semibold">
                {getTranslation(stat.names, 'name')}
              </span>
              <span>: {pokemonStat.base_stat.toLocaleString()}</span>
            </p>
          )
        })}
      </dd>
    </section>
  )
}

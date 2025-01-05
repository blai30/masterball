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

  return (
    <section className="flex flex-col gap-4 px-4 py-6">
      <h2 className="text-lg font-medium text-black dark:text-white">
        {title}
      </h2>
      {stats.map((stat) => {
        const pokemonStat = pokemon.stats.find(
          (s) => s.stat.name === stat.name
        )!
        return (
          <p
            key={stat.name}
            className="text-lg text-zinc-600 dark:text-zinc-400"
          >
            <span className="font-semibold">
              {getTranslation(stat.names, 'name')}
            </span>
            <span>: {pokemonStat.base_stat.toLocaleString()}</span>
          </p>
        )
      })}
    </section>
  )
}

import { Pokemon, Stat } from 'pokedex-promise-v2'
import TranslatedText from '@/components/TranslatedText'

export default function Stats({
  pokemon,
  stats,
}: {
  pokemon: Pokemon
  stats: Stat[]
}) {
  return (
    <section className="px-4 py-6 sm:gap-4">
      <dt className="text-lg font-medium text-black dark:text-white">Stats</dt>
      <dd className="text-lg text-zinc-600 dark:text-zinc-400">
        {stats.map((stat) => {
          const pokemonStat = pokemon.stats.find(
            (s) => s.stat.name === stat.name
          )!
          return (
            <p key={stat.name}>
              <span className="font-semibold">
                <TranslatedText resources={stat.names} field="name" />
              </span>
              <span>: {pokemonStat.base_stat.toLocaleString()}</span>
            </p>
          )
        })}
      </dd>
    </section>
  )
}

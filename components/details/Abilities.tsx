import Link from 'next/link'
import { Ability, Pokemon } from 'pokedex-promise-v2'
import { getTranslation } from '@/lib/utils/pokeapiHelpers'

export default function Abilities({
  pokemon,
  abilities,
}: {
  pokemon: Pokemon
  abilities: Ability[]
}) {
  const title = 'Abilities'
  const abilitiesMap = pokemon.abilities.map((ability) => {
    const resource = abilities.find((a) => a.name === ability.ability.name)!

    return {
      id: resource.id,
      name: ability.name,
      hidden: ability.is_hidden,
      resource,
    }
  })

  return (
    <section className="flex flex-col gap-4 px-4 py-6">
      <h2 className="text-lg font-medium text-black dark:text-white">
        {title}
      </h2>
      {abilitiesMap.map((a) => (
        <p key={a.id}>
          <Link href={`/ability/${a.name}`}>
            <span
              className={[
                'underline',
                a.hidden
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-blue-700 underline dark:text-blue-300',
              ].join(' ')}
            >
              {getTranslation(a.resource.names, 'name')}
            </span>
          </Link>
          <span className="text-lg text-zinc-600 dark:text-zinc-400">
            : {getTranslation(a.resource.effect_entries, 'effect')}
          </span>
        </p>
      ))}
    </section>
  )
}

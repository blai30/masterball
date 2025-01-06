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
      name: ability.ability.name,
      slot: ability.slot,
      hidden: ability.is_hidden,
      resource,
    }
  })

  return (
    <section className="flex flex-col gap-4 px-4 py-6">
      <h2 className="text-xl font-medium text-black dark:text-white">
        {title}
      </h2>
      {abilitiesMap.map((a) => {
        const name = getTranslation(a.resource.names, 'name')
        return (
          <div key={a.id}>
            <Link href={`/ability/${a.name}`}>
              <h3
                title={`${a.hidden ? 'Hidden ability' : `Ability ${a.slot}`}: ${name}`}
                className={[
                  'text-blue-700 underline underline-offset-4 dark:text-blue-300',
                  a.hidden && 'decoration-dotted',
                ].join(' ')}
              >
                {name}
              </h3>
            </Link>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              {getTranslation(a.resource.effect_entries, 'effect')}
            </p>
          </div>
        )
      })}
    </section>
  )
}

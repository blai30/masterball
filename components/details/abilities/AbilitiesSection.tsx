import Link from 'next/link'
import clsx from 'clsx/lite'
import { Pokemon } from 'pokedex-promise-v2'
import { pokeapi } from '@/lib/providers'
import { getTranslation } from '@/lib/utils/pokeapiHelpers'

export default async function AbilitiesSection({
  pokemon,
}: {
  pokemon: Pokemon
}) {
  const title = 'Abilities'
  const abilities = await pokeapi.getAbilityByName(
    pokemon.abilities.map((ability) => ability.ability.name)
  )

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
      <ul className="flex flex-col gap-4">
        {abilitiesMap.map((a) => {
          const name = getTranslation(a.resource.names, 'name')
          return (
            <li key={a.id}>
              <Link href={`/ability/${a.name}`} className="inline-block">
                <h3
                  title={`${a.hidden ? 'Hidden ability' : `Ability ${a.slot}`}: ${name}`}
                  className={clsx(
                    'text-blue-700 underline underline-offset-4 dark:text-blue-300',
                    a.hidden && 'decoration-dotted'
                  )}
                >
                  {name}
                </h3>
              </Link>
              <p className="text-lg text-zinc-600 dark:text-zinc-400">
                {getTranslation(a.resource.effect_entries, 'short_effect')}
              </p>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

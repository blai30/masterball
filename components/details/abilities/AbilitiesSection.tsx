import Link from 'next/link'
import pMap from 'p-map'
import type { Ability, Pokemon } from 'pokedex-promise-v2'
import { EyeOff } from 'lucide-react'
import { getTranslation } from '@/lib/utils/pokeapiHelpers'

export default async function AbilitiesSection({
  pokemon,
}: {
  pokemon: Pokemon
}) {
  const title = 'Abilities'
  const abilities = await pMap(
    pokemon.abilities.map((ability) => ability.ability.name),
    async (name) => {
      const ability = await fetch(
        `https://pokeapi.co/api/v2/ability/${name}`
      ).then((response) => response.json() as Promise<Ability>)
      return ability
    },
    { concurrency: 16 }
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
    <section className="flex flex-col gap-4 rounded-xl p-4 inset-ring-1 inset-ring-zinc-200 dark:inset-ring-zinc-800">
      <h2 className="text-xl font-medium text-black dark:text-white">
        {title}
      </h2>
      <ul className="flex flex-col gap-4">
        {abilitiesMap.map((a) => {
          const name = getTranslation(a.resource.names, 'name')
          return (
            <li key={a.id} className="">
              <div className="flex flex-col gap-1">
                <div className="flex flex-row items-center gap-2">
                  <Link href={`/ability/${a.name}`} className="inline-block">
                    <h3
                      title={`${a.hidden ? 'Hidden ability' : `Ability ${a.slot}`}: ${name}`}
                      className="font-medium text-blue-700 underline underline-offset-4 transition-colors hover:text-blue-800 hover:duration-0 dark:text-blue-300 dark:hover:text-blue-200"
                    >
                      {name}
                    </h3>
                  </Link>
                  {a.hidden && (
                    <span
                      title="Hidden ability"
                      className="rounded-md px-2 inset-ring-1 inset-ring-zinc-800 dark:inset-ring-zinc-200"
                    >
                      <EyeOff
                        size={16}
                        className="text-zinc-800 dark:text-zinc-200"
                      />
                    </span>
                  )}
                </div>
                <p className="text-lg text-pretty text-zinc-700 dark:text-zinc-300">
                  {getTranslation(a.resource.effect_entries, 'short_effect') ??
                    getTranslation(
                      a.resource.flavor_text_entries,
                      'flavor_text'
                    )}
                </p>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

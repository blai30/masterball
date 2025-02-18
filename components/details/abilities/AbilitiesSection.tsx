import Link from 'next/link'
import clsx from 'clsx/lite'
import { Pokemon } from 'pokedex-promise-v2'
import { pokeapi } from '@/lib/providers'
import { getTranslation } from '@/lib/utils/pokeapiHelpers'
import GlassCard from '@/components/GlassCard'

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
    <section className="flex flex-col gap-4">
      {/* <h2 className="text-xl font-medium text-black dark:text-white">
        {title}
      </h2> */}
      <ul className="flex flex-col gap-2">
        {abilitiesMap.map((a) => {
          const name = getTranslation(a.resource.names, 'name')
          return (
            <li key={a.id} className="first:*:rounded-t-2xl last:*:rounded-b-2xl">
              <GlassCard className="">
                <div className="flex flex-col gap-2 p-4">
                  <div className="flex flex-row items-baseline gap-2">
                    <Link href={`/ability/${a.name}`} className="inline-block">
                      <h3
                        title={`${a.hidden ? 'Hidden ability' : `Ability ${a.slot}`}: ${name}`}
                        className="font-medium text-blue-700 underline underline-offset-4 dark:text-blue-300"
                      >
                        {name}
                      </h3>
                    </Link>
                    {a.hidden && (
                      <span className="rounded-md bg-zinc-300 px-1.5 py-0.5 text-xs dark:bg-zinc-700">
                        Hidden
                      </span>
                    )}
                  </div>
                  <p className="text-lg text-pretty text-zinc-700 dark:text-zinc-300">
                    {getTranslation(
                      a.resource.effect_entries,
                      'short_effect'
                    ) ??
                      getTranslation(
                        a.resource.flavor_text_entries,
                        'flavor_text'
                      )}
                  </p>
                </div>
              </GlassCard>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

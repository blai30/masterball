import { Ability, Pokemon } from 'pokedex-promise-v2'
import TranslatedText from '@/components/TranslatedText'
import Link from 'next/link'

export default function Abilities({
  pokemon,
  abilities,
}: {
  pokemon: Pokemon
  abilities: Ability[]
}) {
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
    <section className="px-4 py-6 sm:gap-4">
      <dt className="text-lg font-medium text-black dark:text-white">
        Abilities
      </dt>
      <dd className="text-lg text-zinc-600 dark:text-zinc-400">
        {abilitiesMap.map((a) => (
          <p key={a.id}>
            <Link href={`/ability/${a.name}`}>
              <span className="text-blue-700 underline dark:text-blue-300">
                <TranslatedText resources={a.resource.names} field="name" />
              </span>
            </Link>
            <span className="">
              <TranslatedText
                resources={a.resource.effect_entries}
                field="effect"
              />
            </span>
          </p>
        ))}
      </dd>
    </section>
  )
}

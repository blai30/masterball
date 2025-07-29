import pMap from 'p-map'
import type { Pokemon, Type } from 'pokedex-promise-v2'
import pokeapi from '@/lib/api/pokeapi'
import {
  getEffectiveness,
  TypeKey,
  TypeRelation,
} from '@/lib/utils/pokeapiHelpers'
import TypePill from '@/components/TypePill'
import EffectivenessMultiplier from '@/components/details/typeEffectiveness/EffectivenessMultiplier'

export default async function TypeEffectivenessSection({
  pokemon,
}: {
  pokemon: Pokemon
}) {
  const title = 'Type effectiveness'
  const typeResources = await pMap(
    pokemon.types.map((type) => type.type.url),
    async (url) => {
      const resource = await pokeapi.getResource<Type>(url)
      return resource
    },
    { concurrency: 20 }
  )
  const allTypeResources = await pMap(
    Object.values(TypeKey).map((t) => `https://pokeapi.co/api/v2/type/${t}`),
    async (url) => {
      const resource = await pokeapi.getResource<Type>(url)
      return resource
    },
    { concurrency: 20 }
  )
  const typeEffectiveness = getEffectiveness(...typeResources)
  const allTypeRelations = allTypeResources.map(
    (typeResource) =>
      ({
        type: typeResource,
        effectiveness: typeEffectiveness[typeResource.name as TypeKey],
      }) as TypeRelation
  )

  return (
    <section className="@container flex flex-col gap-4 rounded-xl p-4 inset-ring-1 inset-ring-zinc-200 dark:inset-ring-zinc-800">
      <h2 className="text-xl font-medium text-black dark:text-white">
        {title}
      </h2>
      <div className="flex h-full w-full flex-col content-evenly items-center gap-x-6 gap-y-1 @sm:h-72 @sm:flex-wrap @lg:max-w-sm @lg:content-between">
        {allTypeRelations.map((relation) => {
          const effectiveness = relation.effectiveness
          const type = relation.type
          return (
            <div
              key={type.id}
              className="flex flex-row items-center justify-between gap-1"
            >
              <TypePill variant={type.name} size="medium" />
              <EffectivenessMultiplier variant={effectiveness} />
            </div>
          )
        })}
      </div>
    </section>
  )
}

import { Pokemon } from 'pokedex-promise-v2'
import { pokeapi } from '@/lib/providers'
import {
  getEffectiveness,
  TypeName,
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
  const typeResources = await pokeapi.getTypeByName(
    pokemon.types.map((type) => type.type.name)
  )
  const allTypeResources = await pokeapi.getTypeByName(
    Object.values(TypeName).map((t) => t)
  )
  const typeEffectiveness = getEffectiveness(...typeResources)
  const allTypeRelations = allTypeResources.map(
    (typeResource) =>
      ({
        type: typeResource,
        effectiveness: typeEffectiveness[typeResource.name as TypeName],
      }) as TypeRelation
  )

  return (
    <section className="flex flex-col gap-4 rounded-xl p-4 inset-ring-1 inset-ring-zinc-300 dark:inset-ring-zinc-700">
      <h2 className="text-xl font-medium text-black dark:text-white">
        {title}
      </h2>
      <div className="flex h-72 w-full flex-col flex-wrap content-center items-center justify-center gap-x-8 gap-y-1">
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

import { Pokemon, Type } from 'pokedex-promise-v2'
import { pokeapi } from '@/lib/providers'
import {
  Effectiveness,
  getEffectiveness,
  TypeName,
} from '@/lib/utils/pokeapiHelpers'
import GlassCard from '@/components/GlassCard'
import TypePill from '@/components/TypePill'
import EffectivenessMultiplier from '@/components/details/typeEffectiveness/EffectivenessMultiplier'

type TypeRelation = {
  type: Type
  effectiveness: Effectiveness
}

export default async function TypeEffectivenessSection({
  pokemon,
}: {
  pokemon: Pokemon
}) {
  const title = 'Type Effectiveness'
  const typeResources = await pokeapi.getTypeByName(
    pokemon.types.map((type) => type.type.name)
  )
  const allTypeResources = await pokeapi.getTypeByName(
    Object.values(TypeName).map((t) => t)
  )
  const typeEffectiveness = getEffectiveness(typeResources)
  const allTypeRelations = allTypeResources.map(
    (typeResource) =>
      ({
        type: typeResource,
        effectiveness: typeEffectiveness[typeResource.name as TypeName],
      }) as TypeRelation
  )

  return (
    <section className="flex flex-col gap-4 px-4 py-6">
      <h2 className="text-xl font-medium text-black dark:text-white">
        {title}
      </h2>
      <GlassCard className="flex w-full flex-col items-center gap-2 p-4">
        {allTypeRelations.map((relation) => {
          const effectiveness = relation.effectiveness
          const type = relation.type
          return (
            <div key={type.id} className="flex flex-row items-center gap-1">
              <TypePill variant={type.name} size="medium" />
              <EffectivenessMultiplier variant={effectiveness} />
            </div>
          )
        })}
      </GlassCard>
    </section>
  )
}

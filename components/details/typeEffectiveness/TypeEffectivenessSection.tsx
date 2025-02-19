import clsx from 'clsx/lite'
import { Pokemon } from 'pokedex-promise-v2'
import { pokeapi } from '@/lib/providers'
import {
  getEffectiveness,
  TypeName,
  TypeRelation,
} from '@/lib/utils/pokeapiHelpers'
import GlassCard from '@/components/GlassCard'
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
    <section className="flex flex-col gap-4">
      <h2 className="sr-only text-xl font-medium text-black dark:text-white">
        {title}
      </h2>
      <GlassCard
        className={clsx(
          'xs:h-80 flex h-full w-full flex-col flex-wrap items-center justify-center gap-1 p-4 sm:h-full',
          'rounded-br-2xl rounded-bl-2xl sm:rounded-tr-2xl sm:rounded-bl-none lg:rounded-tr-none lg:rounded-bl-2xl xl:rounded-tr-2xl xl:rounded-bl-none'
        )}
      >
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
      </GlassCard>
    </section>
  )
}

import EffectivenessMultiplier from '@/components/details/typeEffectiveness/EffectivenessMultiplier'
import TypePill from '@/components/TypePill'
import type { TypeRelation } from '@/lib/utils/pokeapi-helpers'

export default function TypeEffectivenessSection({
  typeRelations,
}: {
  typeRelations: TypeRelation[]
}) {
  const title = 'Type effectiveness'

  return (
    <section className="@container flex flex-col gap-4 rounded-xl p-4 inset-ring-1 inset-ring-zinc-200 dark:inset-ring-zinc-800">
      <h2 className="text-xl font-medium text-black dark:text-white">{title}</h2>
      <div className="flex h-full w-full flex-col content-evenly items-center gap-x-6 gap-y-1 @sm:h-72 @sm:flex-wrap @lg:max-w-sm @lg:content-between">
        {typeRelations.map((relation) => {
          const effectiveness = relation.effectiveness
          const type = relation.type
          return (
            <div key={type.id} className="flex flex-row items-center justify-between gap-1">
              <TypePill variant={type.name} size="medium" />
              <EffectivenessMultiplier variant={effectiveness} />
            </div>
          )
        })}
      </div>
    </section>
  )
}

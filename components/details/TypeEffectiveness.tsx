import { Type } from 'pokedex-promise-v2'
import { getEffectiveness, TypeName } from '@/lib/utils/pokeapiHelpers'
import TypePill from '@/components/TypePill'

type TypeRelation = {
  type: Type
  effectiveness: number
}

type EffectivenessCategories = {
  immune: TypeRelation[]
  quarter: TypeRelation[]
  half: TypeRelation[]
  neutral: TypeRelation[]
  double: TypeRelation[]
  quadruple: TypeRelation[]
}

export default function TypeEffectiveness({
  monsterTypes,
  allTypes,
}: {
  monsterTypes: Type[]
  allTypes: Type[]
}) {
  const title = 'Type Effectiveness'
  const typeEffectiveness = getEffectiveness(monsterTypes)
  const allTypeRelations = allTypes.map((typeResource) => ({
    type: typeResource,
    effectiveness: typeEffectiveness[typeResource.name as TypeName],
  }))

  const categorizedTypes = allTypeRelations.reduce<EffectivenessCategories>(
    (acc, relation) => {
      switch (relation.effectiveness) {
        case 0:
          acc.immune.push(relation)
          break
        case 0.25:
          acc.quarter.push(relation)
          break
        case 0.5:
          acc.half.push(relation)
          break
        case 1:
          acc.neutral.push(relation)
          break
        case 2:
          acc.double.push(relation)
          break
        case 4:
          acc.quadruple.push(relation)
          break
      }
      return acc
    },
    {
      immune: [],
      quarter: [],
      half: [],
      neutral: [],
      double: [],
      quadruple: [],
    }
  )

  return (
    <section className="flex flex-col gap-4 px-4 py-6">
      <h2 className="text-xl font-medium text-black dark:text-white">
        {title}
      </h2>
      <div className="flex flex-wrap gap-8">
        <div className="flex min-w-32 flex-col gap-y-4">
          <h4 className="text-green-800 dark:text-green-200">Weakness</h4>
          {categorizedTypes.quadruple.length > 0 && (
            <ul className="flex flex-col flex-wrap gap-2 rounded-3xl">
              <h5 className="w-14 rounded-md text-sm font-semibold">4×</h5>
              {categorizedTypes.quadruple.map(({ type }) => (
                <li key={type.name}>
                  <TypePill type={type} size="md" />
                </li>
              ))}
            </ul>
          )}
          {categorizedTypes.double.length > 0 && (
            <ul className="flex flex-col flex-wrap gap-2 rounded-3xl">
              <h5 className="w-14 rounded-md text-sm font-semibold">2×</h5>
              {categorizedTypes.double.map(({ type }) => (
                <li key={type.name}>
                  <TypePill type={type} size="md" />
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex min-w-32 flex-col gap-y-4">
          <h4 className="text-yellow-800 dark:text-yellow-200">Neutral</h4>
          {categorizedTypes.neutral.length > 0 && (
            <ul className="flex flex-col flex-wrap gap-2 rounded-3xl">
              <h5 className="w-14 rounded-md text-sm font-semibold">1×</h5>
              {categorizedTypes.neutral.map(({ type }) => (
                <li key={type.name}>
                  <TypePill type={type} size="md" />
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex min-w-32 flex-col gap-y-4">
          <h4 className="text-red-800 dark:text-red-200">Resistant</h4>
          {categorizedTypes.half.length > 0 && (
            <ul className="flex flex-col flex-wrap gap-2 rounded-3xl">
              <h5 className="w-14 rounded-md text-sm font-semibold">0.5×</h5>
              {categorizedTypes.half.map(({ type }) => (
                <li key={type.name}>
                  <TypePill type={type} size="md" />
                </li>
              ))}
            </ul>
          )}
          {categorizedTypes.quarter.length > 0 && (
            <ul className="flex flex-col flex-wrap gap-2 rounded-3xl">
              <h5 className="w-14 rounded-md text-sm font-semibold">0.25×</h5>
              {categorizedTypes.quarter.map(({ type }) => (
                <li key={type.name}>
                  <TypePill type={type} size="md" />
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex min-w-32 flex-col gap-y-4">
          <h4 className="text-purple-800 dark:text-purple-200">Immune</h4>
          {categorizedTypes.immune.length > 0 && (
            <ul className="flex flex-col flex-wrap gap-2 rounded-3xl">
              <h5 className="w-14 rounded-md text-sm font-semibold">0×</h5>
              {categorizedTypes.immune.map(({ type }) => (
                <li key={type.name}>
                  <TypePill type={type} size="md" />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}

import { Type } from 'pokedex-promise-v2'
import { getEffectiveness } from '@/lib/utils/pokeapiHelpers'
import TypePill from '../TypePill'

type TypeRelation = {
  type: Type
  effectiveness: number
}

type EffectivenessCategories = {
  immune: TypeRelation[]
  quarter: TypeRelation[]
  half: TypeRelation[]
  neutral: TypeRelation[]
  super: TypeRelation[]
  ultra: TypeRelation[]
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
    effectiveness: typeEffectiveness[typeResource.name],
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
          acc.super.push(relation)
          break
        case 4:
          acc.ultra.push(relation)
          break
      }
      return acc
    },
    {
      immune: [],
      quarter: [],
      half: [],
      neutral: [],
      super: [],
      ultra: [],
    }
  )

  return (
    <section className="flex flex-col gap-4 px-4 py-6">
      <h2 className="text-lg font-medium text-black dark:text-white">
        {title}
      </h2>
      <div className="flex flex-col justify-between gap-6 pr-8 lg:flex-row">
        <div className="flex flex-row gap-y-4 lg:flex-col">
          <h4 className="min-w-36 text-purple-800 dark:text-purple-200">
            Immune (0×)
          </h4>
          <ul className="flex flex-wrap gap-2 lg:flex-col">
            {categorizedTypes.immune.map(({ type }) => (
              <li key={type.name}>
                <TypePill type={type} />
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-row gap-y-4 lg:flex-col">
          <h4 className="min-w-36 text-red-800 dark:text-red-200">
            Quarter (0.25×)
          </h4>
          <ul className="flex flex-wrap gap-2 lg:flex-col">
            {categorizedTypes.quarter.map(({ type }) => (
              <li key={type.name}>
                <TypePill type={type} />
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-row gap-y-4 lg:flex-col">
          <h4 className="min-w-36 text-orange-800 dark:text-orange-200">
            Half (0.5×)
          </h4>
          <ul className="flex flex-wrap gap-2 lg:flex-col">
            {categorizedTypes.half.map(({ type }) => (
              <li key={type.name}>
                <TypePill type={type} />
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-row gap-y-4 lg:flex-col">
          <h4 className="min-w-36 text-yellow-800 dark:text-yellow-200">
            Neutral (1×)
          </h4>
          <ul className="flex flex-wrap gap-2 lg:flex-col">
            {categorizedTypes.neutral.map(({ type }) => (
              <li key={type.name}>
                <TypePill type={type} />
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-row gap-y-4 lg:flex-col">
          <h4 className="min-w-36 text-green-800 dark:text-green-200">
            Super (2×)
          </h4>
          <ul className="flex flex-wrap gap-2 lg:flex-col">
            {categorizedTypes.super.map(({ type }) => (
              <li key={type.name}>
                <TypePill type={type} />
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-row gap-y-4 lg:flex-col">
          <h4 className="min-w-36 text-teal-800 dark:text-teal-200">
            Ultra (4×)
          </h4>
          <ul className="flex flex-wrap gap-2 lg:flex-col">
            {categorizedTypes.ultra.map(({ type }) => (
              <li key={type.name}>
                <TypePill type={type} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

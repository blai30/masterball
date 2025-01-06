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
      <h2 className="text-lg font-medium text-black dark:text-white">
        {title}
      </h2>
      <div className="flex flex-wrap gap-8 pr-8">
        <div className="flex flex-col gap-y-6">
          <h4 className="text-green-800 dark:text-green-200">Weakness</h4>
          <ul className="flex flex-col flex-wrap gap-2 rounded-3xl">
            <h5>4×</h5>
            {categorizedTypes.quadruple.map(({ type }) => (
              <li key={type.name}>
                <TypePill type={type} />
              </li>
            ))}
          </ul>
          <ul className="flex flex-col flex-wrap gap-2 rounded-3xl">
            <h5>2×</h5>
            {categorizedTypes.double.map(({ type }) => (
              <li key={type.name}>
                <TypePill type={type} />
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-y-6">
          <h4 className="text-yellow-800 dark:text-yellow-200">Neutral</h4>
          <ul className="flex flex-col flex-wrap gap-2 rounded-3xl">
            <h5>1×</h5>
            {categorizedTypes.neutral.map(({ type }) => (
              <li key={type.name}>
                <TypePill type={type} />
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-y-6">
          <h4 className="text-red-800 dark:text-red-200">Resistant</h4>
          <ul className="flex flex-col flex-wrap gap-2 rounded-3xl">
            <h5>0.5×</h5>
            {categorizedTypes.half.map(({ type }) => (
              <li key={type.name}>
                <TypePill type={type} />
              </li>
            ))}
          </ul>
          <ul className="flex flex-col flex-wrap gap-2 rounded-3xl">
            <h5>0.25×</h5>
            {categorizedTypes.quarter.map(({ type }) => (
              <li key={type.name}>
                <TypePill type={type} />
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-y-6">
          <h4 className="text-purple-800 dark:text-purple-200">Immune</h4>
          <ul className="flex flex-col flex-wrap gap-2 rounded-3xl">
            <h5>0×</h5>
            {categorizedTypes.immune.map(({ type }) => (
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

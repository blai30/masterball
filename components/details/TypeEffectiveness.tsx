import { Type } from 'pokedex-promise-v2'
import { calculateTypeEffectiveness } from '@/lib/utils/pokeapiHelpers'
import TranslatedText from '@/components/TranslatedText'

export default function TypeEffectiveness({
  monsterTypes,
  allTypes,
}: {
  monsterTypes: Type[]
  allTypes: Type[]
}) {
  const typeEffectiveness = calculateTypeEffectiveness(monsterTypes)
  const allTypeRelations = allTypes
    .map((typeResource) => ({
      type: typeResource,
      effectiveness: typeEffectiveness[typeResource.name],
    }))
    .sort((a, b) => b.effectiveness - a.effectiveness)

  return (
    <section className="px-4 py-6 sm:gap-4">
      <dt className="text-lg font-medium text-black dark:text-white">
        Type Effectiveness
      </dt>
      <dd className="text-lg text-zinc-600 dark:text-zinc-400">
        <ul>
          {allTypeRelations.map(({ type, effectiveness }) => (
            <li key={type.name} className="flex items-center justify-between">
              <TranslatedText resources={type.names} field="name" />
              <span
                className={[
                  'font-mono font-medium',
                  effectiveness > 1 && 'text-green-600 dark:text-green-400',
                  effectiveness === 1 && 'text-zinc-600 dark:text-zinc-400',
                  effectiveness === 0 && 'text-purple-600 dark:text-purple-400',
                  effectiveness < 1 &&
                    effectiveness > 0 &&
                    'text-red-600 dark:text-red-400',
                ].join(' ')}
              >
                {effectiveness === 0 ? '0×' : `${effectiveness.toFixed(2)}×`}
              </span>
            </li>
          ))}
        </ul>
      </dd>
    </section>
  )
}

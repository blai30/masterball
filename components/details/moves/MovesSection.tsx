import Link from 'next/link'
import clsx from 'clsx/lite'
import { Move, Pokemon } from 'pokedex-promise-v2'
import { pokeapi } from '@/lib/providers'
import TypePill from '@/components/TypePill'
import { DamageClassName, TypeName } from '@/lib/utils/pokeapiHelpers'

export default async function MovesSection({ pokemon }: { pokemon: Pokemon }) {
  const title = 'Moves'

  const versionGroup = 'scarlet-violet'
  const learnMethodsList = await pokeapi.getMoveLearnMethodsList()
  const learnMethods = await pokeapi.getMoveLearnMethodByName(
    learnMethodsList.results.map((m) => m.name)
  )
  const learnMethodNames = learnMethods.reduce(
    (acc, learnMethod) => {
      acc[learnMethod.name] = learnMethod.names.find(
        (n) => n.language.name === 'en'
      )!.name
      return acc
    },
    {} as Record<string, string>
  )

  const filteredMoves = pokemon.moves.filter((move) => {
    const versionGroupDetails = move.version_group_details.find(
      (v) => v.version_group.name === versionGroup
    )
    return versionGroupDetails !== undefined
  })

  const movesData = await pokeapi.getMoveByName(
    filteredMoves.map((move) => move.move.name)
  )

  const movesMap: Record<string, Move> = movesData.reduce(
    (acc, move) => {
      acc[move.name] = move
      return acc
    },
    {} as Record<string, Move>
  )

  return (
    <section className="flex flex-col gap-4 px-4 py-6">
      <h2 className="text-xl font-medium text-black dark:text-white">
        {title}
      </h2>
      <h3 className="text-sm font-semibold">{learnMethodNames['level-up']}</h3>
      <ul className="flex flex-col gap-1">
        {filteredMoves.map((move) => {
          const resource = movesMap[move.move.name]
          const name = resource.names.find((n) => n.language.name === 'en')!
          const level = move.version_group_details[0].level_learned_at
          const type = resource.type.name as TypeName
          const damageClass = resource.damage_class.name as DamageClassName
          const power = resource.power ?? '—'
          const accuracy = resource.accuracy ?? '—'
          const pp = resource.pp

          return (
            <li key={resource.id} className="grid grid-cols-7">
              <span className="col-span-1">{level}</span>
              <Link href={`/move/${move.name}`} className="col-span-1">
                <span
                  title={`Learned at level ${level}: ${name.name}`}
                  className={clsx(
                    'text-blue-700 underline underline-offset-4 dark:text-blue-300'
                  )}
                >
                  {name.name}
                </span>
              </Link>
              <span className="col-span-1">
                {/* <TypePill type={type} size="medium" /> */}
                {type}
              </span>
              <span className="col-span-1">
                {/* <DamageClassPill damageClass={damageClass} /> */}
                {damageClass}
              </span>
              <span className="col-span-1">{power}</span>
              <span className="col-span-1">{accuracy}%</span>
              <span className="col-span-1">{pp}</span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

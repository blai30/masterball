import Link from 'next/link'
import clsx from 'clsx/lite'
import { Move, Pokemon } from 'pokedex-promise-v2'
import { pokeapi } from '@/lib/providers'
import { DamageClassName, TypeName } from '@/lib/utils/pokeapiHelpers'
import DamageClassPill from '@/components/DamageClassPill'
import TypePill from '@/components/TypePill'

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
      <ul className="flex flex-col">
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
            <li
              key={resource.id}
              className="flex flex-row gap-2 even:bg-zinc-50 dark:even:bg-zinc-950"
            >
              <div className="flex w-12 p-1">
                <p className="font-num w-full text-right tabular-nums">
                  {level}
                </p>
              </div>
              <div className="flex w-40 p-1">
                <Link href={`/move/${move.move.name}`} className="relative">
                  <p
                    title={`Learned at level ${level}: ${name.name}`}
                    className={clsx(
                      'text-blue-700 underline underline-offset-4 dark:text-blue-300'
                    )}
                  >
                    {name.name}
                  </p>
                </Link>
              </div>
              <div className="flex p-1">
                <TypePill type={type} size="medium" />
              </div>
              <div className="flex p-1">
                <DamageClassPill damageClass={damageClass} size="medium" />
              </div>
              <div className="flex w-16 p-1">
                <p className="font-num w-full text-right tabular-nums">
                  {power}
                </p>
              </div>
              <div className="flex w-16 p-1">
                <p className="font-num w-full text-right tabular-nums">
                  {accuracy}%
                </p>
              </div>
              <div className="flex w-16 p-1">
                <p className="font-num w-full text-right tabular-nums">{pp}</p>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

import Link from 'next/link'
import clsx from 'clsx'
import { Move, MoveElement } from 'pokedex-promise-v2'
import { TypeName, DamageClassName } from '@/lib/utils/pokeapiHelpers'
import DamageClassPill from '@/components/DamageClassPill'
import TypePill from '@/components/TypePill'

export default function MovesTable({
  moves,
  movesMap,
}: {
  moves: MoveElement[]
  movesMap: Record<string, Move>
}) {
  return (
    <ul className="flex w-min flex-col">
      <li className="flex h-6 flex-row items-center">
        <div className="flex w-12 py-1 px-2">
          <p className="w-full text-xs font-semibold">Level</p>
        </div>
        <div className="flex w-40 py-1 px-2">
          <p className="w-full text-xs font-semibold">Name</p>
        </div>
        <div className="flex w-32 py-1 px-2">
          <p className="w-full text-xs font-semibold">Type</p>
        </div>
        <div className="flex w-14 py-1 px-2">
          <p className="w-full text-xs font-semibold">Class</p>
        </div>
        <div className="flex w-14 py-1 px-2">
          <p className="w-full text-xs font-semibold text-right">Power</p>
        </div>
        <div className="flex w-16 py-1 px-2">
          <p className="w-full text-xs font-semibold text-right">Accuracy</p>
        </div>
        <div className="flex w-12 py-1 px-2">
          <p className="w-full text-xs font-semibold text-right">PP</p>
        </div>
      </li>
      {moves.map((move) => {
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
            className="flex h-8 flex-row items-center even:bg-zinc-50 dark:even:bg-zinc-950"
          >
            <div className="flex w-12 py-1 px-2">
              <p className="font-num w-full text-right">{level}</p>
            </div>
            <div className="flex w-40 py-1 px-2">
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
            <div className="flex w-32 py-1 px-2">
              <TypePill type={type} size="medium" />
            </div>
            <div className="flex w-14 py-1 px-2">
              <DamageClassPill damageClass={damageClass} size="medium" />
            </div>
            <div className="flex w-14 py-1 px-2">
              <p className="font-num w-full text-right">{power}</p>
            </div>
            <div className="flex w-16 py-1 px-2">
              <p className="font-num w-full text-right">{accuracy}%</p>
            </div>
            <div className="flex w-12 py-1 px-2">
              <p className="font-num w-full text-right">{pp}</p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

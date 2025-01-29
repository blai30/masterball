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
    <ul className="w-full table-fixed flex-col overflow-x-scroll py-1 md:w-min md:overflow-auto">
      <li
        className={clsx(
          'inline-flex h-6 w-full min-w-full items-center',
          'rounded-l-xs rounded-tr-xs rounded-br-md',
          'bg-white dark:bg-black'
        )}
      >
        <div className="flex min-w-12 px-2 py-1">
          <p className="w-full text-xs font-semibold">Level</p>
        </div>
        <div className="flex min-w-44 px-2 py-1">
          <p className="w-full text-xs font-semibold">Name</p>
        </div>
        <div className="flex min-w-32 px-2 py-1">
          <p className="w-full text-xs font-semibold">Type</p>
        </div>
        <div className="flex min-w-14 px-2 py-1">
          <p className="w-full text-center text-xs font-semibold">Class</p>
        </div>
        <div className="flex min-w-14 px-2 py-1">
          <p className="w-full text-right text-xs font-semibold">Power</p>
        </div>
        <div className="flex min-w-20 px-2 py-1">
          <p className="w-full text-right text-xs font-semibold">Accuracy</p>
        </div>
        <div className="flex min-w-12 px-2 py-1">
          <p className="w-full text-right text-xs font-semibold">PP</p>
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
            className={clsx(
              'group inline-flex h-8 min-w-full flex-row items-center',
              'rounded-l-xs rounded-tr-xs rounded-br-md',
              'transition-colors odd:bg-zinc-100 even:bg-white hover:bg-zinc-300 hover:duration-0 dark:odd:bg-zinc-900 dark:even:bg-black dark:hover:bg-zinc-700'
            )}
          >
            <div className="flex min-w-12 px-2 py-1">
              <p className="font-num w-full text-right">{level}</p>
            </div>
            <div className="flex min-w-44 px-2 py-1">
              <Link href={`/move/${move.move.name}`} className="">
                <p
                  title={`Learned at level ${level}: ${name.name}`}
                  className={clsx(
                    'font-medium text-blue-700 underline underline-offset-4 dark:text-blue-300'
                  )}
                >
                  {name.name}
                </p>
              </Link>
            </div>
            <div className="flex min-w-32 px-2 py-1">
              <TypePill type={type} size="medium" />
            </div>
            <div className="flex min-w-14 px-2 py-1">
              <DamageClassPill damageClass={damageClass} size="medium" />
            </div>
            <div className="flex min-w-14 px-2 py-1">
              <p className="font-num w-full text-right">{power}</p>
            </div>
            <div className="flex min-w-20 px-2 py-1">
              <p className="font-num w-full text-right">
                {accuracy}
                <span className="ml-0.5 text-zinc-600 dark:text-zinc-400">
                  %
                </span>
              </p>
            </div>
            <div className="flex min-w-12 px-2 py-1">
              <p className="font-num w-full text-right">{pp}</p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

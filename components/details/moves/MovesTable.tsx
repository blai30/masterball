import Link from 'next/link'
import clsx from 'clsx'
import { Machine, Move, MoveElement } from 'pokedex-promise-v2'
import { TypeName, DamageClassName } from '@/lib/utils/pokeapiHelpers'
import DamageClassPill from '@/components/DamageClassPill'
import TypePill from '@/components/TypePill'

const variantColumnLabels: Record<string, string> = {
  'level-up': 'Level',
  machine: 'Item',
}

export default function MovesTable({
  variant,
  moves,
  movesMap,
}: {
  variant: 'level-up' | 'machine' | 'tutor' | 'egg'
  moves: MoveElement[]
  movesMap: Record<string, Move & { machine: Machine }>
}) {
  return (
    <div className="overflow-x-scroll md:overflow-auto">
      <ul
        className={clsx(
          'group inline-flex flex-col gap-0.5 p-4',
          'rounded-l-sm rounded-tr-sm rounded-br-xl backdrop-blur-md',
          'bg-gradient-to-br from-zinc-100/60 to-zinc-200/60 to-75% inset-ring-1 inset-ring-zinc-200/60 transition-colors dark:from-zinc-800/60 dark:to-zinc-900/60 dark:inset-ring-zinc-800/60'
        )}
      >
        <li className="inline-flex h-8 items-start rounded-l-xs rounded-tr-xs rounded-br-md">
          <div className="flex h-full min-w-16 px-2 py-1">
            <p className="w-full text-xs font-semibold">
              {variantColumnLabels[variant] ?? ''}
            </p>
          </div>
          <div className="flex h-full min-w-44 px-2 py-1">
            <p className="w-full text-xs font-semibold">Name</p>
          </div>
          <div className="flex h-full min-w-32 px-2 py-1">
            <p className="w-full text-xs font-semibold">Type</p>
          </div>
          <div className="flex h-full min-w-14 px-2 py-1">
            <p className="w-full text-center text-xs font-semibold">Class</p>
          </div>
          <div className="flex h-full min-w-14 px-2 py-1">
            <p className="w-full text-right text-xs font-semibold">Power</p>
          </div>
          <div className="flex h-full min-w-20 px-2 py-1">
            <p className="w-full text-right text-xs font-semibold">Accuracy</p>
          </div>
          <div className="flex h-full min-w-12 px-2 py-1">
            <p className="w-full text-right text-xs font-semibold">PP</p>
          </div>
        </li>
        {moves.map((move) => {
          const resource = movesMap[move.move.name]
          const name = resource.names.find((n) => n.language.name === 'en')!
          const rowLabel =
            variant === 'level-up'
              ? move.version_group_details[0].level_learned_at === 0
                ? 'Evolve'
                : move.version_group_details[0].level_learned_at.toString()
              : variant === 'machine' && movesMap[move.move.name]?.machine
                ? movesMap[move.move.name].machine.item.name.toUpperCase()
                : ''
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
                'transition-colors hover:bg-zinc-300/75 hover:duration-0 dark:hover:bg-zinc-700/75'
              )}
            >
              <div className="flex h-full min-w-16 px-2 py-1">
                <p className="font-num w-full text-right text-zinc-700 dark:text-zinc-300">
                  {rowLabel}
                </p>
              </div>
              <div className="flex h-full min-w-44 px-2 py-1">
                <Link href={`/move/${move.move.name}`} className="">
                  <p
                    title={`Learned at level ${rowLabel}: ${name.name}`}
                    className="font-medium text-blue-700 underline underline-offset-4 dark:text-blue-300"
                  >
                    {name.name}
                  </p>
                </Link>
              </div>
              <div className="flex h-full min-w-32 px-2 py-1">
                <TypePill type={type} size="medium" />
              </div>
              <div className="flex h-full min-w-14 px-2 py-1">
                <DamageClassPill damageClass={damageClass} size="medium" />
              </div>
              <div className="flex h-full min-w-14 px-2 py-1">
                <p className="font-num w-full text-right">{power}</p>
              </div>
              <div className="flex h-full min-w-20 px-2 py-1">
                <p className="font-num w-full text-right">
                  {accuracy}
                  <span className="ml-0.5 text-zinc-600 dark:text-zinc-400">
                    %
                  </span>
                </p>
              </div>
              <div className="flex h-full min-w-12 px-2 py-1">
                <p className="font-num w-full text-right">{pp}</p>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

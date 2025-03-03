'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import clsx from 'clsx/lite'
import { Machine, Move, MoveElement } from 'pokedex-promise-v2'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  TypeKey,
  DamageClassKey,
  getTranslation,
} from '@/lib/utils/pokeapiHelpers'
import DamageClassIcon from '@/components/DamageClassIcon'
import TypeIcon from '@/components/TypeIcon'
import { useVersionGroup } from '@/components/shared/VersionGroupProvider'

const variantColumnLabels: Record<string, string> = {
  'form-change': 'Form',
  'level-up': 'Level',
  machine: 'TM',
  tutor: 'Tutor',
  egg: 'Egg',
}

type MoveRow = {
  rowLabel: string
  key: string
  type: TypeKey
  damageClass: DamageClassKey
  name: string
  power: number | string
  accuracy: number | string
  pp: number
}

export default function MovesTable({
  variant,
  moves,
  movesMap,
  className,
}: {
  variant: 'form-change' | 'level-up' | 'machine' | 'tutor' | 'egg'
  moves: MoveElement[]
  movesMap: Record<string, Move & { machine: Machine }>
} & React.ComponentPropsWithoutRef<'div'>) {
  const { versionGroup } = useVersionGroup()
  const columnHelper = createColumnHelper<MoveRow>()

  const columns = useMemo(
    () => [
      columnHelper.accessor('rowLabel', {
        header: variantColumnLabels[variant] ?? '',
        cell: (info) => (
          <p
            className={clsx(
              'font-num w-full text-right text-zinc-700 dark:text-zinc-300',
              info.getValue() ? 'visible' : 'invisible'
            )}
          >
            {info.getValue()}
          </p>
        ),
      }),
      columnHelper.accessor('type', {
        header: 'Type',
        cell: (info) => (
          <div className="flex items-center justify-center gap-2">
            <TypeIcon variant={info.getValue()} size="medium" />
            <DamageClassIcon
              variant={info.row.original.damageClass}
              size="medium"
            />
          </div>
        ),
      }),
      columnHelper.accessor('name', {
        header: 'Move',
        cell: (info) => (
          <div className="@container/move">
            <Link
              href={`/move/${info.row.original.key}`}
              className="inline-flex"
            >
              <p
                title={`Move: ${info.getValue()}`}
                className="max-w-52 overflow-hidden font-medium text-nowrap text-ellipsis whitespace-nowrap text-blue-700 underline underline-offset-4 transition-colors hover:text-blue-800 hover:duration-0 @max-[12rem]/move:max-w-32 @xs/move:max-w-86 dark:text-blue-300 dark:hover:text-blue-200"
              >
                {info.getValue()}
              </p>
            </Link>
          </div>
        ),
      }),
      columnHelper.accessor('power', {
        header: 'Power',
        cell: (info) => (
          <p className="font-num w-full text-right">{info.getValue()}</p>
        ),
      }),
      columnHelper.accessor('accuracy', {
        header: 'Accuracy',
        cell: (info) => (
          <p className="font-num w-full text-right">
            {info.getValue()}
            <span className="ml-0.5 text-zinc-600 dark:text-zinc-400">%</span>
          </p>
        ),
      }),
      columnHelper.accessor('pp', {
        header: 'PP',
        cell: (info) => (
          <p className="font-num w-full text-right">{info.getValue()}</p>
        ),
      }),
    ],
    [columnHelper, variant]
  )

  const filteredMoves = useMemo(
    () =>
      moves.filter((move) =>
        move.version_group_details.some(
          (v) =>
            v.move_learn_method.name === variant &&
            v.version_group.name === versionGroup
        )
      ),
    [moves, variant, versionGroup]
  )

  const data = useMemo(
    () =>
      filteredMoves.map((move) => {
        const resource = movesMap[move.move.name]
        const name = getTranslation(resource.names, 'name')!
        const rowLabel =
          variant === 'level-up'
            ? move.version_group_details[0].level_learned_at === 0
              ? 'Evolve'
              : move.version_group_details[0].level_learned_at.toString()
            : variant === 'machine' && movesMap[move.move.name]?.machine
              ? movesMap[move.move.name].machine.item.name.toUpperCase()
              : ''

        return {
          rowLabel,
          key: move.move.name,
          type: resource.type.name as TypeKey,
          damageClass: resource.damage_class.name as DamageClassKey,
          name,
          power: resource.power ?? '—',
          accuracy: resource.accuracy ?? '—',
          pp: resource.pp!,
        }
      }),
    [filteredMoves, movesMap, variant]
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const tableName = {
    'form-change': 'Form Change',
    'level-up': 'Level-Up',
    machine: 'Machine',
    tutor: 'Tutor',
    egg: 'Egg',
  }

  if (!data.length) {
    return (
      <div className={clsx('flex flex-col gap-2', className)}>
        <h3 className="text-lg">{tableName[variant]}</h3>
        <span className="text-lg text-pretty text-zinc-700 dark:text-zinc-300">
          No {tableName[variant].toLocaleLowerCase()} moves available for this
          version group.
        </span>
      </div>
    )
  }

  return (
    <div className={clsx('flex flex-col gap-2', className)}>
      <h3 className="text-lg">{tableName[variant]}</h3>
      <div className="overflow-x-scroll md:overflow-auto">
        <div className="inline-block min-w-full">
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="flex h-8 items-center">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={clsx(
                        'px-2 text-left text-xs font-semibold',
                        header.id === 'rowLabel' && 'min-w-16',
                        header.id === 'type' && 'min-w-20',
                        header.id === 'name' && 'min-w-36 grow',
                        header.id === 'power' && 'min-w-14 text-right',
                        header.id === 'accuracy' && 'min-w-20 text-right',
                        header.id === 'pp' && 'min-w-12 text-right'
                      )}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="flex flex-col gap-0.5">
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={clsx(
                    'group flex h-8 items-center rounded-md transition-colors hover:bg-zinc-300/75 hover:duration-0 dark:hover:bg-zinc-700/75'
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={clsx(
                        'px-2',
                        cell.column.id === 'rowLabel' && 'min-w-16',
                        cell.column.id === 'type' && 'min-w-20',
                        cell.column.id === 'name' && 'min-w-36 grow',
                        cell.column.id === 'power' && 'min-w-14',
                        cell.column.id === 'accuracy' && 'min-w-20',
                        cell.column.id === 'pp' && 'min-w-12'
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

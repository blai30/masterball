'use client'

import Link from 'next/link'
import clsx from 'clsx/lite'
import { Machine, Move, MoveElement } from 'pokedex-promise-v2'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  TypeName,
  DamageClassName,
  getTranslation,
} from '@/lib/utils/pokeapiHelpers'
import DamageClassPill from '@/components/DamageClassPill'
import TypeIcon from '@/components/TypeIcon'

const variantColumnLabels: Record<string, string> = {
  'level-up': 'Level',
  machine: 'TM',
  tutor: 'Tutor',
  egg: 'Egg',
}

type MoveRow = {
  rowLabel: string
  type: TypeName
  damageClass: DamageClassName
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
  variant: 'level-up' | 'machine' | 'tutor' | 'egg'
  moves: MoveElement[]
  movesMap: Record<string, Move & { machine: Machine }>
} & React.ComponentPropsWithoutRef<'div'>) {
  const columnHelper = createColumnHelper<MoveRow>()

  const columns = [
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
          <DamageClassPill
            variant={info.row.original.damageClass}
            size="medium"
          />
        </div>
      ),
    }),
    columnHelper.accessor('name', {
      header: 'Move',
      cell: (info) => (
        <Link href={`/move/${info.row.original.name}`} className="inline-flex">
          <p
            title={`Move: ${info.getValue()}`}
            className="font-medium text-blue-700 underline underline-offset-4 transition-colors hover:text-blue-800 hover:duration-0 dark:text-blue-300 dark:hover:text-blue-200"
          >
            {info.getValue()}
          </p>
        </Link>
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
  ]

  const data = moves.map((move) => {
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
      type: resource.type.name as TypeName,
      damageClass: resource.damage_class.name as DamageClassName,
      name,
      power: resource.power ?? '—',
      accuracy: resource.accuracy ?? '—',
      pp: resource.pp!,
    }
  })

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="overflow-x-scroll md:overflow-auto">
      <div className={clsx('inline-block min-w-full', className)}>
        <table className="w-full p-4">
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
                      header.id === 'name' && 'min-w-44 grow',
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
          <tbody>
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
                      cell.column.id === 'name' && 'min-w-44 grow',
                      cell.column.id === 'power' && 'min-w-14',
                      cell.column.id === 'accuracy' && 'min-w-20',
                      cell.column.id === 'pp' && 'min-w-12'
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

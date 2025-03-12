'use client'

import Link from 'next/link'
import { memo, useMemo, useState } from 'react'
import clsx from 'clsx/lite'
import { Machine, Move, MoveElement } from 'pokedex-promise-v2'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { useVersionGroup } from '@/lib/stores/version-group'
import {
  TypeKey,
  DamageClassKey,
  getTranslation,
  LearnMethodKey,
} from '@/lib/utils/pokeapiHelpers'
import DamageClassIcon from '@/components/DamageClassIcon'
import TypeIcon from '@/components/TypeIcon'
import { ChevronDown, ChevronUp } from 'lucide-react'

const tableNames = {
  [LearnMethodKey.FormChange]: 'Form Change',
  [LearnMethodKey.LevelUp]: 'Level-Up',
  [LearnMethodKey.Machine]: 'Technical Machine',
  [LearnMethodKey.Tutor]: 'Tutor',
  [LearnMethodKey.Egg]: 'Egg',
}

const idColumnLabels = {
  [LearnMethodKey.FormChange]: 'Form',
  [LearnMethodKey.LevelUp]: 'Level',
  [LearnMethodKey.Machine]: 'Item',
  [LearnMethodKey.Tutor]: '',
  [LearnMethodKey.Egg]: '',
}

const columnWidths: Record<string, string> = {
  rowLabel: 'min-w-16',
  type: 'min-w-20',
  name: 'min-w-36 grow',
  power: 'min-w-14 text-right',
  accuracy: 'min-w-20 text-right',
  pp: 'min-w-12 text-right',
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

function MovesTable({
  variant,
  moves,
  movesMap,
  className,
}: {
  variant: LearnMethodKey
  moves: MoveElement[]
  movesMap: Record<string, Move & { machineItems: Machine[] }>
} & React.ComponentPropsWithoutRef<'div'>) {
  const { versionGroup } = useVersionGroup()
  const columnHelper = createColumnHelper<MoveRow>()
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'rowLabel', desc: false },
  ])

  const columns = useMemo(
    () => [
      columnHelper.accessor('rowLabel', {
        header: idColumnLabels[variant] ?? '',
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
      filteredMoves.map((m) => {
        const move = movesMap[m.move.name]
        const versionGroupDetail = m.version_group_details.find(
          (m) => m.version_group.name === versionGroup
        )!

        let rowLabel = ''
        if (variant === LearnMethodKey.LevelUp) {
          rowLabel =
            versionGroupDetail.level_learned_at === 0
              ? 'Evolve'
              : versionGroupDetail.level_learned_at.toString()
        } else if (variant === LearnMethodKey.Machine && move.machineItems) {
          const machine = move.machineItems.find(
            (m) => m.version_group.name === versionGroup
          )
          rowLabel = machine?.item.name.toUpperCase() || ''
        }

        return {
          rowLabel,
          key: m.move.name,
          type: move.type.name as TypeKey,
          damageClass: move.damage_class.name as DamageClassKey,
          name: getTranslation(move.names, 'name')!,
          power: move.power ?? '—',
          accuracy: move.accuracy ?? '—',
          pp: move.pp!,
        }
      }),
    [filteredMoves, movesMap, variant, versionGroup]
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  if (filteredMoves.length === 0) {
    return (
      <div className={clsx('flex flex-col gap-2', className)}>
        <h3 className="text-lg">{tableNames[variant]}</h3>
        <p className="text-zinc-500 dark:text-zinc-400">
          No {tableNames[variant].toLocaleLowerCase()} moves available for this
          version group.
        </p>
      </div>
    )
  }

  return (
    <div className={className}>
      <h3 className="text-lg">{tableNames[variant]}</h3>
      <div className="-mx-4 mt-2 flex overflow-x-auto">
        <div className="grow px-4">
          <table className="min-w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="flex h-8 items-center">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      onClick={header.column.getToggleSortingHandler()}
                      className={clsx(
                        'px-2 text-left text-xs font-semibold',
                        columnWidths[header.id],
                        header.column.getCanSort() &&
                          'cursor-pointer select-none'
                      )}
                    >
                      <div className="flex items-center gap-1">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: <ChevronUp className="h-3 w-3" />,
                          desc: <ChevronDown className="h-3 w-3" />,
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="flex flex-col gap-0.5">
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="group flex h-8 items-center rounded-md transition-colors hover:bg-zinc-300/75 hover:duration-0 dark:hover:bg-zinc-700/75"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={clsx('px-2', columnWidths[cell.column.id])}
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

export default memo(MovesTable)

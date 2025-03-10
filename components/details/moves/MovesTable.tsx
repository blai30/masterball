'use client'

import Link from 'next/link'
import { useMemo, memo } from 'react'
import clsx from 'clsx/lite'
import { Machine, Move, MoveElement } from 'pokedex-promise-v2'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  LearnMethod,
  MoveRow,
  usePokemonMoves,
} from '@/lib/hooks/usePokemonMoves'
import { TypeKey, DamageClassKey } from '@/lib/utils/pokeapiHelpers'
import DamageClassIcon from '@/components/DamageClassIcon'
import TypeIcon from '@/components/TypeIcon'

// Moved outside component to avoid recreation
const tableName: Record<LearnMethod, string> = {
  'form-change': 'Form Change',
  'level-up': 'Level-Up',
  machine: 'Technical Machine',
  tutor: 'Tutor',
  egg: 'Egg',
}

const variantColumnLabels: Record<LearnMethod, string> = {
  'form-change': 'Form',
  'level-up': 'Level',
  machine: 'Item',
  tutor: '',
  egg: '',
}

// Column class mappings
const COLUMN_CLASSES = {
  rowLabel: 'min-w-16',
  type: 'min-w-20',
  name: 'min-w-36 grow',
  power: 'min-w-14 text-right',
  accuracy: 'min-w-20 text-right',
  pp: 'min-w-12 text-right',
}

// Memoized components for table cells
const MoveNameCell = memo(
  ({ name, moveKey }: { name: string; moveKey: string }) => (
    <div className="@container/move">
      <Link href={`/move/${moveKey}`} className="inline-flex">
        <p
          title={`Move: ${name}`}
          className="max-w-52 overflow-hidden font-medium text-nowrap text-ellipsis whitespace-nowrap text-blue-700 underline underline-offset-4 transition-colors hover:text-blue-800 hover:duration-0 @max-[12rem]/move:max-w-32 @xs/move:max-w-86 dark:text-blue-300 dark:hover:text-blue-200"
        >
          {name}
        </p>
      </Link>
    </div>
  )
)

const TypeCell = memo(
  ({ type, damageClass }: { type: TypeKey; damageClass: DamageClassKey }) => (
    <div className="flex items-center justify-center gap-2">
      <TypeIcon variant={type} size="medium" />
      <DamageClassIcon variant={damageClass} size="medium" />
    </div>
  )
)

// Standalone component for empty state to avoid re-renders
const EmptyMovesList = memo(
  ({ variant, className }: { variant: LearnMethod; className?: string }) => (
    <div className={clsx('flex flex-col gap-2', className)}>
      <h3 className="text-lg">{tableName[variant]}</h3>
      <p className="text-zinc-500 dark:text-zinc-400">
        No {tableName[variant].toLocaleLowerCase()} moves available for this
        version group.
      </p>
    </div>
  )
)

function MovesTable({
  variant,
  moves,
  movesMap,
  className,
}: {
  variant: LearnMethod
  moves: MoveElement[]
  movesMap: Record<string, Move & { machineItems: Machine[] }>
} & React.ComponentPropsWithoutRef<'div'>) {
  // Use the optimized hook to process moves
  const data = usePokemonMoves(variant, moves, movesMap)

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
          <TypeCell
            type={info.getValue()}
            damageClass={info.row.original.damageClass}
          />
        ),
      }),
      columnHelper.accessor('name', {
        header: 'Move',
        cell: (info) => (
          <MoveNameCell
            name={info.getValue()}
            moveKey={info.row.original.key}
          />
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

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      sorting: [
        {
          id: 'rowLabel',
          desc: false,
        },
      ],
    },
  })

  if (data.length === 0) {
    return <EmptyMovesList variant={variant} className={className} />
  }

  return (
    <div className={clsx('flex flex-col gap-2', className)}>
      <h3 className="text-lg">{tableName[variant]}</h3>
      <div className="-mx-4 flex overflow-x-auto">
        <div className="grow px-4">
          <table className="min-w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="flex h-8 items-center">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      className={clsx(
                        'px-2 text-left text-xs font-semibold',
                        COLUMN_CLASSES[header.id as keyof typeof COLUMN_CLASSES]
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
                  className="group flex h-8 items-center rounded-md transition-colors hover:bg-zinc-300/75 hover:duration-0 dark:hover:bg-zinc-700/75"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={clsx(
                        'px-2',
                        COLUMN_CLASSES[
                          cell.column.id as keyof typeof COLUMN_CLASSES
                        ]
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

// Memoize the component to prevent unnecessary rerenders
export default memo(MovesTable)

'use client'

import { memo, useCallback, useMemo, useState } from 'react'
import Link from '@/components/ui/link'
import clsx from 'clsx/lite'
import { ChevronDown, ChevronUp } from 'lucide-react'
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  createColumnHelper,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table'
import { useVersionGroup } from '@/lib/stores/version-group'
import { LearnMethodKey, type MoveRow } from '@/lib/utils/pokeapiHelpers'
import DamageClassIcon from '@/components/DamageClassIcon'
import TypeIcon from '@/components/TypeIcon'
import {
  Dialog,
  DialogActions,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'

const tableNames: Record<LearnMethodKey, string> = {
  [LearnMethodKey.LevelUp]: 'Level-Up',
  [LearnMethodKey.Machine]: 'Technical Machine',
  [LearnMethodKey.Tutor]: 'Tutor',
  [LearnMethodKey.Egg]: 'Egg',
  [LearnMethodKey.FormChange]: 'Form Change',
}

const idColumnLabels: Record<LearnMethodKey, string> = {
  [LearnMethodKey.LevelUp]: 'Level',
  [LearnMethodKey.Machine]: 'Item',
  [LearnMethodKey.Tutor]: '',
  [LearnMethodKey.Egg]: '',
  [LearnMethodKey.FormChange]: '',
}

const columnClasses: Record<string, string> = {
  id: 'w-16 justify-start text-left',
  type: 'w-6',
  name: 'grow min-w-40 justify-start text-left',
  damageClass: 'w-6',
  power: 'w-6 justify-end text-right',
  accuracy: 'w-14 justify-end text-right',
  pp: 'w-6 justify-end text-right',
}

function MovesTable({
  variant,
  moveRows,
  className,
}: {
  variant: LearnMethodKey
  moveRows: MoveRow[]
  className?: string
}) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [activeMove, setActiveMove] = useState<string | null>(null)
  const { versionGroup, hasMounted } = useVersionGroup()
  const columnHelper = createColumnHelper<MoveRow>()
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'id', desc: false },
  ])

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: idColumnLabels[variant] ?? '',
        cell: (info) => (
          <p
            className={clsx(
              'font-num w-full text-right text-zinc-700 dark:text-zinc-300',
              idColumnLabels[variant] ? 'visible' : 'invisible'
            )}
          >
            {info.getValue()}
          </p>
        ),
      }),
      columnHelper.accessor('type', {
        header: '',
        cell: (info) => (
          <div className="flex items-center justify-center gap-1">
            <TypeIcon variant={info.getValue()} size="medium" />
          </div>
        ),
      }),
      columnHelper.accessor('name', {
        header: 'Move',
        cell: (info) => (
          <span className="font-medium text-zinc-900 dark:text-zinc-100">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor('damageClass', {
        header: '',
        cell: (info) => (
          <div className="flex items-center justify-center gap-1">
            <DamageClassIcon
              variant={info.row.original.damageClass}
              size="medium"
            />
          </div>
        ),
      }),
      columnHelper.accessor('power', {
        header: 'Power',
        cell: (info) => (
          <p className="font-num w-full text-right">{info.getValue() ?? '—'}</p>
        ),
      }),
      columnHelper.accessor('accuracy', {
        header: 'Accuracy',
        cell: (info) => (
          <p className="font-num w-full text-right">
            {info.getValue() ?? '—'}
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

  const filteredMoveRows = useMemo(
    () => moveRows.filter((row) => row.versionGroup === versionGroup),
    [moveRows, versionGroup]
  )

  const memoizedMove = useMemo(
    () => filteredMoveRows.find((m) => m.slug === activeMove),
    [activeMove, filteredMoveRows]
  )

  const table = useReactTable({
    data: filteredMoveRows,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const handleRowClick = useCallback((slug: string) => {
    setActiveMove(slug)
    setDialogOpen(true)
  }, [])

  if (!hasMounted) return null

  if (filteredMoveRows.length === 0) {
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
    <>
      {memoizedMove && (
        <Dialog open={dialogOpen} onClose={setDialogOpen}>
          <DialogTitle>{memoizedMove.name}</DialogTitle>
          <DialogDescription>
            {memoizedMove.flavorTextEntries.find(
              (entry) =>
                entry.language.name === 'en' &&
                entry.version_group?.name === versionGroup
            )?.flavor_text ?? memoizedMove.defaultDescription}
          </DialogDescription>
          <DialogActions>
            <Link
              href={`/move?q=${encodeURIComponent(memoizedMove.name.toLowerCase())}`}
              className="text-blue-700 underline underline-offset-4 dark:text-blue-300"
            >
              Visit move page
            </Link>
          </DialogActions>
        </Dialog>
      )}
      <div className={clsx('max-w-2xl', className)}>
        <h3 className="text-lg">{tableNames[variant]}</h3>
        <div className="-mx-4 mt-2 flex overflow-x-auto">
          <div className="grow px-4">
            <table className="min-w-full">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="h-8 items-center">
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        colSpan={header.colSpan}
                        onClick={header.column.getToggleSortingHandler()}
                        className="px-2 text-xs font-semibold"
                      >
                        <div
                          className={clsx(
                            'flex items-center',
                            columnClasses[header.id]
                          )}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
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
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="group h-8 items-center rounded-md transition-colors hover:bg-black/10 hover:duration-0 dark:hover:bg-white/10"
                    role="button"
                    tabIndex={0}
                    onClick={() => handleRowClick(row.original.slug)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handleRowClick(row.original.slug)
                      }
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className={clsx('px-2', columnClasses[cell.column.id])}
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
    </>
  )
}

export default memo(MovesTable)

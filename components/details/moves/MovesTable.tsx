'use client'

import { Fragment, memo, useCallback, useMemo, useState } from 'react'
import { motion } from 'motion/react'
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

  const table = useReactTable({
    data: filteredMoveRows,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const handleRowClick = useCallback((slug: string) => {
    setActiveMove((prev) => (prev === slug ? null : slug))
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
    <div className={clsx('max-w-2xl', className)}>
      <h3 className="text-lg">{tableNames[variant]}</h3>
      <div className="-mx-4 mt-2 flex overflow-x-auto">
        <div className="grow px-4">
          <table className="min-w-full overflow-y-clip">
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
            <motion.tbody
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.04,
                  },
                },
              }}
              key={versionGroup + '-' + filteredMoveRows.length}
            >
              {table.getRowModel().rows.map((row) => {
                const isActive = row.original.slug === activeMove
                return (
                  <Fragment key={row.id}>
                    <motion.tr
                      className={clsx(
                        'group h-8 rounded-md transition-colors hover:bg-black/10 hover:duration-0 dark:hover:bg-white/10',
                        isActive && 'bg-zinc-100 dark:bg-zinc-900'
                      )}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleRowClick(row.original.slug)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          handleRowClick(row.original.slug)
                        }
                      }}
                      layout
                      variants={{
                        hidden: { opacity: 0, y: 32 },
                        visible: {
                          opacity: 1,
                          y: 0,
                          transition: {
                            type: 'spring',
                            bounce: 0.18,
                            duration: 0.5,
                          },
                        },
                      }}
                    >
                      {row.getVisibleCells().map((cell) => {
                        const isNameCell = cell.column.id === 'name'
                        if (isNameCell) {
                          return (
                            <td
                              key={cell.id}
                              className={clsx(
                                'px-2 py-1 align-top',
                                columnClasses[cell.column.id]
                              )}
                            >
                              <div className="flex flex-col">
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                                <motion.div
                                  initial={false}
                                  animate={
                                    isActive
                                      ? {
                                          height: 'auto',
                                          opacity: 1,
                                          marginTop: 4,
                                        }
                                      : { height: 0, opacity: 0, marginTop: 0 }
                                  }
                                  transition={{
                                    type: 'spring',
                                    duration: 0.4,
                                    bounce: 0.3,
                                  }}
                                  className="overflow-hidden"
                                >
                                  <span className="text-sm text-zinc-700 dark:text-zinc-300">
                                    {row.original.flavorTextEntries?.find(
                                      (entry) =>
                                        entry.language.name === 'en' &&
                                        entry.version_group?.name ===
                                          versionGroup
                                    )?.flavor_text ??
                                      row.original.defaultDescription}
                                  </span>
                                </motion.div>
                              </div>
                            </td>
                          )
                        }
                        return (
                          <td
                            key={cell.id}
                            className={clsx(
                              'px-2 py-1 align-top',
                              columnClasses[cell.column.id]
                            )}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        )
                      })}
                    </motion.tr>
                  </Fragment>
                )
              })}
            </motion.tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default memo(MovesTable)

import { useMemo } from 'react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { VersionGroupLabels, type LocationEncounterRow } from '@/lib/utils/pokeapi-helpers'
import { useVersionGroup } from '@/lib/stores/version-group'

export default function LocationsTable({ rows }: { rows: LocationEncounterRow[] }) {
  const { versionGroup, hasMounted } = useVersionGroup()
  const columnHelper = createColumnHelper<LocationEncounterRow>()

  const filteredRows = useMemo(
    () => rows.filter((row) => row.versionGroup === versionGroup),
    [rows, versionGroup]
  )

  const columns = useMemo(
    () => [
      columnHelper.accessor('versionName', {
        header: 'Game',
        cell: (info) => <span className="text-zinc-700 dark:text-zinc-300">{info.getValue()}</span>,
      }),
      columnHelper.accessor('locationName', {
        header: 'Location',
        cell: (info) => (
          <span className="font-medium text-zinc-900 dark:text-zinc-100">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor('methods', {
        header: 'Method',
        cell: (info) => (
          <span className="text-zinc-700 dark:text-zinc-300">{info.getValue().join(', ')}</span>
        ),
      }),
      columnHelper.accessor((row) => row, {
        id: 'level',
        header: 'Level',
        cell: (info) => {
          const row = info.getValue()
          return (
            <span className="text-zinc-700 dark:text-zinc-300">
              {row.minLevel === row.maxLevel ? row.minLevel : `${row.minLevel}-${row.maxLevel}`}
            </span>
          )
        },
      }),
      columnHelper.accessor('maxChance', {
        header: 'Chance',
        cell: (info) => (
          <span className="text-zinc-700 dark:text-zinc-300">{info.getValue()}%</span>
        ),
      }),
    ],
    [columnHelper]
  )

  const table = useReactTable({
    data: filteredRows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (!hasMounted) return null

  if (filteredRows.length === 0) {
    return (
      <p className="text-lg text-pretty text-zinc-700 dark:text-zinc-300">
        Not encountered in {VersionGroupLabels[versionGroup]}.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b border-zinc-200 dark:border-zinc-800">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="pb-2 text-left font-medium text-zinc-500 dark:text-zinc-400"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="py-2 pr-4 align-top last:pr-0">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

'use client'

import clsx from 'clsx/lite'

export type SortOption<T extends string> = {
  label: string
  value: T
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

type SortBarProps<T extends string> = {
  sortKey: T | ''
  sortDirection: SortDirection
  sortKeys: SortOption<T>[]
  onSortKeyChangeAction: (key: T | '') => void
  onSortDirectionChangeAction: (direction: SortDirection) => void
  className?: string
}

export default function SortBar<T extends string>({
  sortKey,
  sortDirection,
  sortKeys,
  onSortKeyChangeAction,
  onSortDirectionChangeAction,
  className,
}: SortBarProps<T>) {
  return (
    <div className={clsx('flex flex-row items-center gap-2', className)}>
      <label htmlFor="sortKey" className="sr-only">
        Sort by
      </label>
      <select
        id="sortKey"
        value={sortKey}
        onChange={(e) => onSortKeyChangeAction(e.target.value as T | '')}
        className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-zinc-900 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
      >
        {sortKeys.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <label htmlFor="sortDirection" className="sr-only">
        Sort direction
      </label>
      <select
        id="sortDirection"
        value={sortDirection}
        onChange={(e) =>
          onSortDirectionChangeAction(e.target.value as SortDirection)
        }
        className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-zinc-900 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
      >
        <option value="asc">Asc</option>
        <option value="desc">Desc</option>
      </select>
    </div>
  )
}

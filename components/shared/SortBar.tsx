'use client'

import clsx from 'clsx/lite'
import { ChevronDown } from 'lucide-react'

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
    <div
      className={clsx(
        'flex flex-row items-center justify-center gap-2 lg:justify-end',
        className
      )}
    >
      <div className="relative flex items-center justify-center text-sm/6">
        <label htmlFor="sortKey" className="sr-only">
          Sort by
        </label>
        <select
          id="sortKey"
          value={sortKey}
          onChange={(e) => onSortKeyChangeAction(e.target.value as T | '')}
          className="w-28 appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 inset-ring-1 inset-ring-zinc-300 focus:inset-ring-zinc-500 focus:outline-none dark:bg-black dark:text-zinc-200 dark:inset-ring-zinc-700 dark:focus:inset-ring-zinc-500"
        >
          {sortKeys.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-2 h-[1lh] w-4 text-zinc-600 dark:text-zinc-400"
        />
      </div>
      <div className="relative flex items-center justify-center text-sm/6">
        <label htmlFor="sortDirection" className="sr-only">
          Sort direction
        </label>
        <select
          id="sortDirection"
          value={sortDirection}
          onChange={(e) =>
            onSortDirectionChangeAction(e.target.value as SortDirection)
          }
          className="w-20 appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 inset-ring-1 inset-ring-zinc-300 focus:inset-ring-zinc-500 focus:outline-none dark:bg-black dark:text-zinc-200 dark:inset-ring-zinc-700 dark:focus:inset-ring-zinc-500"
        >
          <option value="asc">Asc</option>
          <option value="desc">Desc</option>
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-2 h-[1lh] w-4 text-zinc-600 dark:text-zinc-400"
        />
      </div>
    </div>
  )
}

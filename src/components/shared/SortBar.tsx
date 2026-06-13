import clsx from 'clsx/lite'
import { ArrowDownWideNarrow, ArrowUpNarrowWide } from 'lucide-react'

import { Select, type SelectItem } from '@/components/ui/Select'

export type SortOption<T extends string> = {
  label: string
  value: T
}

export const SortDirection = {
  ASC: 'asc',
  DESC: 'desc',
} as const

export type SortDirection = (typeof SortDirection)[keyof typeof SortDirection]

type SortBarProps<T extends string> = {
  sortKey: T | ''
  sortDirection: SortDirection
  sortKeys: SortOption<T>[]
  onSortKeyChangeAction: (key: T | '') => void
  onSortDirectionChangeAction: (direction: SortDirection) => void
  className?: string
}

const directionItems: SelectItem<SortDirection>[] = [
  { value: 'asc', icon: <ArrowUpNarrowWide className="size-4" /> },
  { value: 'desc', icon: <ArrowDownWideNarrow className="size-4" /> },
]

export default function SortBar<T extends string>({
  sortKey,
  sortDirection,
  sortKeys,
  onSortKeyChangeAction,
  onSortDirectionChangeAction,
  className,
}: SortBarProps<T>) {
  const keyItems: SelectItem<T | ''>[] = sortKeys.map((option) => ({
    value: option.value,
    label: option.label,
  }))

  return (
    <div className={clsx('flex gap-2', className)}>
      <Select
        ariaLabel="Sort by"
        value={sortKey}
        onValueChange={onSortKeyChangeAction}
        items={keyItems}
        className="max-w-28 min-w-28"
      />
      <Select
        ariaLabel="Sort direction"
        value={sortDirection}
        onValueChange={onSortDirectionChangeAction}
        items={directionItems}
        className="max-w-16 min-w-16"
      />
    </div>
  )
}

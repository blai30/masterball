'use client'

import clsx from 'clsx/lite'
import { ArrowDownWideNarrow, ArrowUpNarrowWide } from 'lucide-react'
import { Field, Label } from '@/components/ui/fieldset'
import { Listbox, ListboxLabel, ListboxOption } from '@/components/ui/listbox'

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
      <Field>
        <Label className="sr-only">Sort by</Label>
        <Listbox
          name="sortKey"
          value={sortKey}
          onChange={onSortKeyChangeAction}
          className="max-w-28 min-w-28"
        >
          {sortKeys.map((option) => (
            <ListboxOption key={option.value} value={option.value}>
              <ListboxLabel>{option.label}</ListboxLabel>
            </ListboxOption>
          ))}
        </Listbox>
      </Field>
      <Field>
        <Label className="sr-only">Sort direction</Label>
        <Listbox
          name="sortDirection"
          value={sortDirection}
          onChange={onSortDirectionChangeAction}
          className="max-w-16 min-w-16"
        >
          <ListboxOption value="asc">
            <ArrowUpNarrowWide className="p-0.5" />
          </ListboxOption>
          <ListboxOption value="desc">
            <ArrowDownWideNarrow className="p-0.5" />
          </ListboxOption>
        </Listbox>
      </Field>
    </div>
  )
}

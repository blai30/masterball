'use client'

import { useMemo } from 'react'
import clsx from 'clsx/lite'
import { Listbox, ListboxLabel, ListboxOption } from '@/components/ui/listbox'
import { DamageClassKey, TypeKey } from '@/lib/utils/pokeapi-helpers'
import DamageClassIcon from '@/components/DamageClassIcon'
import TypeIcon from '@/components/TypeIcon'

export type FilterOption = {
  label: string
  value: string
}

export type FilterConfig = {
  label: string
  options: FilterOption[]
  values: string[]
  onChange: (values: string | string[]) => void
}

type FilterBarProps = {
  filters: FilterConfig[]
  className?: string
}

export default function FilterBar({ filters, className }: FilterBarProps) {
  const typeKeySet = useMemo(() => new Set<string>(Object.values(TypeKey)), [])
  const damageClassKeySet = useMemo(
    () => new Set<string>(Object.values(DamageClassKey)),
    []
  )

  const optionPill = (option: FilterOption) => {
    return typeKeySet.has(option.value) ? (
      <>
        <TypeIcon
          variant={option.value as TypeKey}
          size="small"
          className="flex-shrink-0"
          data-slot="icon"
        />
        <ListboxLabel>{option.label}</ListboxLabel>
      </>
    ) : damageClassKeySet.has(option.value) ? (
      <>
        <DamageClassIcon
          variant={option.value as DamageClassKey}
          size="small"
          className="flex-shrink-0"
          data-slot="icon"
        />
        <ListboxLabel>{option.label}</ListboxLabel>
      </>
    ) : (
      <ListboxLabel>{option.label}</ListboxLabel>
    )
  }

  return (
    <div className={clsx('flex gap-2', className)}>
      {filters.map((filter) => (
        <Listbox
          key={filter.label}
          name={filter.label}
          value={filter.values}
          placeholder={filter.label}
          onChange={filter.onChange}
          multiple
          className="max-w-36 min-w-36"
        >
          {filter.options.map((option) => (
            <ListboxOption key={option.value} value={option.value}>
              {optionPill(option)}
            </ListboxOption>
          ))}
        </Listbox>
      ))}
    </div>
  )
}

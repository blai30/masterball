'use client'

import { Fragment } from 'react'
import clsx from 'clsx/lite'
import { Check, ChevronDown } from 'lucide-react'
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/react'
import { DamageClassKey, TypeKey } from '@/lib/utils/pokeapiHelpers'
import TypePill from '@/components/TypePill'
import DamageClassIcon from '@/components/DamageClassIcon'

export type FilterOption = {
  label: string
  value: string
}

export type FilterConfig = {
  label: string
  options: FilterOption[]
  values: string[]
  onChange: (values: string[]) => void
}

type FilterBarProps = {
  filters: FilterConfig[]
  className?: string
}

export default function FilterBar({ filters, className }: FilterBarProps) {
  const typeKeySet = new Set<string>(Object.values(TypeKey))
  const damageClassKeySet = new Set<string>(Object.values(DamageClassKey))

  const optionPill = (option: FilterOption) => {
    return typeKeySet.has(option.value) ? (
      <TypePill
        variant={option.value as TypeKey}
        size="small"
        link={false}
        className="flex-shrink-0"
      />
    ) : damageClassKeySet.has(option.value) ? (
      <span className="flex items-center gap-1">
        <DamageClassIcon
          variant={option.value as DamageClassKey}
          size="small"
          link={false}
          className="flex-shrink-0"
        />
        <span className="uppercase">{option.label}</span>
      </span>
    ) : (
      <span className="truncate">{option.label}</span>
    )
  }

  return (
    <div className={clsx('flex flex-row items-center gap-2', className)}>
      {filters.map((filter) => (
        <div key={filter.label} className="flex flex-col gap-1">
          <Listbox value={filter.values} onChange={filter.onChange} multiple>
            {({ open }) => (
              <div className="relative">
                <ListboxButton className="flex w-42 appearance-none items-center justify-between rounded-md bg-white py-1.5 pr-8 pl-3 inset-ring-1 inset-ring-zinc-300 focus:inset-ring-zinc-500 focus:outline-none dark:bg-black dark:text-zinc-200 dark:inset-ring-zinc-700 dark:focus:inset-ring-zinc-500">
                  <span className="truncate">
                    {filter.values.length > 0
                      ? filter.options
                          .filter((opt) => filter.values.includes(opt.value))
                          .map((opt) => opt.label)
                          .join(', ')
                      : filter.label}
                  </span>
                  <ChevronDown
                    aria-hidden="true"
                    className="pointer-events-none absolute right-2 h-[1lh] w-4 text-zinc-600 dark:text-zinc-400"
                  />
                </ListboxButton>
                <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded bg-zinc-100 py-1 text-xs shadow-lg ring-1 ring-black/5 focus:outline-none dark:bg-zinc-900 dark:text-zinc-100">
                  {filter.options.map((option) => (
                    <ListboxOption
                      key={option.value}
                      value={option.value}
                      as={Fragment}
                    >
                      {({ selected }) => (
                        <li
                          className={clsx(
                            'flex items-center gap-2 p-1 select-none data-focus:bg-zinc-200 data-selected:font-semibold dark:data-focus:bg-zinc-700'
                          )}
                        >
                          <span className="flex size-4 items-center justify-center rounded">
                            {selected && <Check className="size-4" />}
                          </span>
                          {optionPill(option)}
                        </li>
                      )}
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </div>
            )}
          </Listbox>
        </div>
      ))}
    </div>
  )
}

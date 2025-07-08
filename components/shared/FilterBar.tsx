'use client'

import clsx from 'clsx/lite'

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
  return (
      <div className={clsx('flex flex-row items-center gap-2', className)}>
      {filters.map((filter) => (
        <div key={filter.label} className="flex min-w-[120px] flex-col gap-1">
          <label className="mb-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            {filter.label}
          </label>
          <select
            multiple
            value={filter.values}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions).map(
                (opt) => opt.value
              )
              filter.onChange(selected)
            }}
            className="min-h-[2.5rem] rounded border border-zinc-300 bg-white px-2 py-1 text-xs text-zinc-900 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          >
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  )
}

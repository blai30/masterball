import { Select as BaseSelect } from '@base-ui/react/select'
import clsx from 'clsx/lite'
import { Check, ChevronsUpDown } from 'lucide-react'
import type { ReactNode } from 'react'

export type SelectItem<T extends string> = {
  value: T
  label?: string
  icon?: ReactNode
}

type SelectProps<T extends string> = {
  value: T
  onValueChange: (value: T) => void
  items: SelectItem<T>[]
  placeholder?: string
  name?: string
  ariaLabel?: string
  className?: string
}

const triggerClass =
  'flex w-full items-center justify-between gap-2 rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-left text-base/6 text-zinc-950 transition-colors hover:border-zinc-950/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 sm:py-1.5 sm:text-sm/6 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:border-white/20'

const popupClass =
  'isolate max-h-[min(24rem,var(--available-height))] min-w-[var(--anchor-width)] origin-[var(--transform-origin)] overflow-y-auto rounded-xl bg-white/90 p-1 shadow-lg ring-1 ring-zinc-950/10 backdrop-blur-xl transition-opacity data-ending-style:opacity-0 data-starting-style:opacity-0 dark:bg-zinc-800/90 dark:ring-white/10'

const itemClass =
  'grid cursor-default grid-cols-[1rem_1fr] items-center gap-x-2 rounded-lg py-1.5 pr-3 pl-1.5 text-base/6 text-zinc-950 outline-none select-none data-highlighted:bg-zinc-200 data-highlighted:text-black sm:text-sm/6 dark:text-white dark:data-highlighted:bg-zinc-700 dark:data-highlighted:text-white'

export function Select<T extends string>({
  value,
  onValueChange,
  items,
  placeholder,
  name,
  ariaLabel,
  className,
}: SelectProps<T>) {
  return (
    <BaseSelect.Root
      name={name}
      value={value}
      modal={false}
      onValueChange={(next) => {
        if (next !== null) {
          onValueChange(next)
        }
      }}
    >
      <BaseSelect.Trigger aria-label={ariaLabel} className={clsx(triggerClass, className)}>
        <BaseSelect.Value className="min-w-0 flex-1 truncate">
          {(selected: T) => {
            const item = items.find((entry) => entry.value === selected)
            if (!item) {
              return <span className="text-zinc-500">{placeholder}</span>
            }
            return item.icon ?? item.label
          }}
        </BaseSelect.Value>
        <BaseSelect.Icon className="shrink-0 text-zinc-500 dark:text-zinc-400">
          <ChevronsUpDown size={16} />
        </BaseSelect.Icon>
      </BaseSelect.Trigger>
      <BaseSelect.Portal>
        <BaseSelect.Positioner sideOffset={4} className="z-50">
          <BaseSelect.Popup className={popupClass}>
            {items.map((item) => (
              <BaseSelect.Item key={item.value} value={item.value} className={itemClass}>
                <BaseSelect.ItemIndicator className="col-start-1">
                  <Check size={16} />
                </BaseSelect.ItemIndicator>
                <BaseSelect.ItemText className="col-start-2 flex items-center gap-2">
                  {item.icon}
                  {item.label}
                </BaseSelect.ItemText>
              </BaseSelect.Item>
            ))}
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </BaseSelect.Root>
  )
}

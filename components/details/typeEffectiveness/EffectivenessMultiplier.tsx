import clsx from 'clsx/lite'
import { cva } from 'cva'
import { Effectiveness } from '@/lib/utils/pokeapiHelpers'

const variants = cva({
  base: 'font-nums w-12 rounded-l-xs rounded-tr-xs rounded-br-md px-2 py-1 text-left text-xs font-semibold tabular-nums',
  variants: {
    variant: {
      [Effectiveness.Immune]:
        'bg-zinc-200 text-purple-700 dark:bg-zinc-800 dark:text-purple-300',
      [Effectiveness.Quarter]:
        'bg-red-300 text-black dark:bg-red-700 dark:text-white',
      [Effectiveness.Half]:
        'bg-red-200 text-black dark:bg-red-800 dark:text-white',
      [Effectiveness.Neutral]:
        'bg-transparent text-zinc-700 dark:bg-transparent dark:text-zinc-300',
      [Effectiveness.Double]:
        'bg-green-200 text-black dark:bg-green-800 dark:text-white',
      [Effectiveness.Quadruple]:
        'bg-green-300 text-black dark:bg-green-700 dark:text-white',
    },
  },
})

export default function EffectivenessMultiplier({
  variant,
}: {
  variant: Effectiveness
}) {
  const label = `${variant.toPrecision(2)}×`
  return (
    <span
      className={clsx(
        'flex flex-row',
        'font-nums w-12 rounded-l-xs rounded-tr-xs rounded-br-md px-2 py-1 text-left text-xs font-semibold tabular-nums',
        variants({ variant })
      )}
    >
      {label}
    </span>
  )
}

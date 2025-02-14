import clsx from 'clsx/lite'
import { cva } from 'cva'
import { Effectiveness } from '@/lib/utils/pokeapiHelpers'

const variants = cva({
  base: 'font-nums w-12 rounded-l-xs rounded-tr-xs rounded-br-md px-2 text-left text-sm font-semibold tabular-nums',
  variants: {
    variant: {
      [Effectiveness.Immune]:
        'text-purple-700 dark:text-purple-300',
      [Effectiveness.Quarter]:
        'text-red-700 dark:text-red-300',
      [Effectiveness.Half]:
        'text-red-800 dark:text-red-400',
      [Effectiveness.Neutral]:
        'text-zinc-700 dark:text-zinc-300',
      [Effectiveness.Double]:
        'text-green-800 dark:text-green-400',
      [Effectiveness.Quadruple]:
        'text-green-700 dark:text-green-300',
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
        variants({ variant })
      )}
    >
      {label}
    </span>
  )
}

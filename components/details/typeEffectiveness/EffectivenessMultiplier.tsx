import { cva } from 'cva'
import { Effectiveness } from '@/lib/utils/pokeapiHelpers'

const variants = cva({
  base: 'font-nums w-12 rounded-md text-right text-sm font-semibold tabular-nums',
  variants: {
    variant: {
      [Effectiveness.Immune]: 'text-purple-700 dark:text-purple-300',
      [Effectiveness.Quarter]: 'text-red-800 dark:text-red-400',
      [Effectiveness.Half]: 'text-red-700 dark:text-red-300',
      [Effectiveness.Neutral]: 'text-zinc-700 dark:text-zinc-300',
      [Effectiveness.Double]: 'text-green-700 dark:text-green-300',
      [Effectiveness.Quadruple]: 'text-green-800 dark:text-green-400',
    },
  },
})

export default function EffectivenessMultiplier({
  variant,
}: {
  variant: Effectiveness
}) {
  const label = `${variant.toFixed(2)}×`
  return <span className={variants({ variant })}>{label}</span>
}

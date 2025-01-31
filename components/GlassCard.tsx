import type { HTMLAttributes } from 'react'
import clsx from 'clsx/lite'
import { cva, type VariantProps } from 'cva'

const variants = cva({
  base: 'rounded-l-sm rounded-tr-sm rounded-br-xl bg-gradient-to-br to-zinc-100 to-75% inset-ring-1 inset-ring-zinc-200 dark:from-zinc-900 dark:to-zinc-950 dark:inset-ring-zinc-800',
  variants: {
    variant: {
      default: '',
      link: 'transition-colors hover:from-zinc-200/60 hover:to-zinc-300/60 hover:inset-ring-zinc-300/60 hover:duration-0 focus-visible:from-zinc-100 focus-visible:to-zinc-200 focus-visible:inset-ring-zinc-300/60 dark:hover:from-zinc-800/60 dark:hover:to-zinc-700/60 dark:hover:inset-ring-zinc-700/60 dark:focus-visible:from-zinc-900 dark:focus-visible:to-zinc-800 dark:focus-visible:inset-ring-zinc-700/60',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export default function GlassCard({
  children,
  className,
  variant,
  ...props
}: {
  children: React.ReactNode
} & VariantProps<typeof variants> &
  HTMLAttributes<Element>) {
  return (
    <div {...props} className={clsx('', variants({ variant, className }))}>
      {children}
    </div>
  )
}

import clsx from 'clsx/lite'

type GlassVariant = 'default' | 'link'
type GlassTransparency = 'opaque' | 'transparent'

const variantClasses: Record<GlassVariant, string> = {
  default: '',
  // link: 'transition-colors hover:from-zinc-200/60 hover:to-zinc-300/60 hover:inset-ring-zinc-300/60 hover:duration-0 dark:hover:from-zinc-800/60 dark:hover:to-zinc-700/60 dark:hover:inset-ring-zinc-700/60',
  link: 'transition-colors hover:bg-zinc-200/60 hover:inset-ring-zinc-300/60 hover:duration-0 dark:hover:bg-zinc-800/60 dark:hover:inset-ring-zinc-700/60',
}

const transparencyClasses: Record<GlassTransparency, string> = {
  // opaque: 'from-zinc-50 to-zinc-100 inset-ring-1 inset-ring-zinc-200 dark:from-zinc-900 dark:to-zinc-950 dark:inset-ring-zinc-800',
  opaque: 'bg-zinc-50 inset-ring-1 inset-ring-zinc-100 dark:bg-zinc-950 dark:inset-ring-zinc-900',
  // transparent: 'from-zinc-50/60 to-zinc-100/60 inset-ring-1 inset-ring-zinc-200/60 backdrop-blur-xl dark:from-zinc-900/60 dark:to-zinc-950/60 dark:inset-ring-zinc-800',
  transparent:
    'bg-zinc-100/50 inset-ring-1 inset-ring-zinc-200/50 backdrop-blur-xl dark:bg-zinc-900/50 dark:inset-ring-zinc-800/50',
}

export default function GlassCard({
  children,
  className,
  variant = 'default',
  transparency = 'transparent',
  ...props
}: {
  children: React.ReactNode
  variant?: GlassVariant
  transparency?: GlassTransparency
} & React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      {...props}
      className={clsx(className, variantClasses[variant], transparencyClasses[transparency])}
    >
      {children}
    </div>
  )
}

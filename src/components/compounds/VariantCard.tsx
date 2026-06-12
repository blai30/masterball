import clsx from 'clsx/lite'

import { TypeIcon } from '@/components/icons'
import type { Monster } from '@/lib/utils/pokeapi-helpers'

export default function VariantCard({
  monster,
  className,
  variant = 'link',
}: {
  monster: Monster
  className?: string
  variant?: 'default' | 'link'
}) {
  const { name, types, imageUrl } = monster

  return (
    <div
      className={clsx(
        'relative flex w-44 flex-col items-center gap-4 rounded-xl p-3',
        'bg-zinc-100/50 inset-ring-1 inset-ring-zinc-200/50 backdrop-blur-xl dark:bg-zinc-900/50 dark:inset-ring-zinc-800/50',
        variant === 'link' &&
          'transition-colors hover:bg-zinc-200/60 hover:inset-ring-zinc-300/60 hover:duration-0 dark:hover:bg-zinc-800/60 dark:hover:inset-ring-zinc-700/60',
        className
      )}
    >
      <div className="flex aspect-square size-36 items-center justify-center">
        <img
          src={imageUrl || ''}
          alt={name}
          width={128}
          height={128}
          loading="eager"
          className="object-scale-down"
        />
      </div>
      <div className="flex grow flex-col items-center gap-3">
        {types && (
          <ul className="flex flex-row gap-1">
            {types.map((type) => (
              <li key={type}>
                <TypeIcon variant={type} size="small" />
              </li>
            ))}
          </ul>
        )}
        <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{name}</h3>
      </div>
    </div>
  )
}

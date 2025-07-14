'use client'

import Image from 'next/image'
import clsx from 'clsx/lite'
import { Monster } from '@/lib/utils/pokeapiHelpers'
import TypeIcon from '@/components/TypeIcon'
import GlassCard from '@/components/GlassCard'

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
    <GlassCard
      variant={variant}
      className={clsx(
        'relative flex w-44 flex-col items-center gap-4 rounded-xl p-3',
        className
      )}
    >
      <div className="flex aspect-square size-36 items-center justify-center">
        <Image
          src={imageUrl || ''}
          alt={name}
          width={128}
          height={128}
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
        <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          {name}
        </h3>
      </div>
    </GlassCard>
  )
}

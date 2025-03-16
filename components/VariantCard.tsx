'use client'

import Image from 'next/image'
import clsx from 'clsx/lite'
import { Monster } from '@/lib/utils/pokeapiHelpers'
import TypePill from '@/components/TypePill'

export default function VariantCard({
  monster,
  className,
}: {
  monster: Monster
  className?: string
}) {
  const { name, types, imageUrl } = monster

  return (
    <div
      className={clsx(
        'relative flex w-58 flex-col items-center gap-4',
        className
      )}
    >
      <Image
        src={imageUrl || ''}
        alt={name}
        width={200}
        height={200}
        className="object-scale-down"
      />
      <h3 className="text-lg font-medium text-black dark:text-white">{name}</h3>
      {types && (
        <ul className="flex flex-row gap-2">
          {types.map((type) => (
            <li key={type}>
              <TypePill variant={type} size="medium" link={false} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

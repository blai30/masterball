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
        'relative flex w-58 flex-col items-center gap-3',
        className
      )}
    >
      <div className="flex w-full items-center justify-center">
        <Image
          src={imageUrl || ''}
          alt={name}
          width={128}
          height={128}
          className="object-scale-down"
        />
      </div>
      <div className="flex h-full w-full flex-col items-center gap-3">
        <h3 className="w-full text-center text-lg font-normal text-balance text-black dark:text-white">
          {name}
        </h3>
        {types && (
          <ul className="flex w-full flex-row justify-center gap-2">
            {types.map((type) => (
              <li key={type}>
                <TypePill variant={type} size="medium" link={false} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

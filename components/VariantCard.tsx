'use client'

import Image from 'next/image'
import clsx from 'clsx/lite'
import { Monster } from '@/lib/utils/pokeapiHelpers'
import TypeIcon from '@/components/TypeIcon'

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
        'relative flex w-full flex-row items-center gap-3 px-4 py-3',
        className
      )}
    >
      <div className="flex aspect-square size-16 items-center justify-center">
        <Image
          src={imageUrl || ''}
          alt={name}
          width={128}
          height={128}
          className="object-scale-down"
        />
      </div>
      <div className="flex grow flex-col gap-2">
        <h3 className="text-base font-normal text-black dark:text-white">
          {name}
        </h3>
        {types && (
          <ul className="flex flex-row gap-1">
            {types.map((type) => (
              <li key={type}>
                <TypeIcon variant={type} size="small" link={false} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

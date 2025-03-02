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
  const imageId = monster.species.id.toString().padStart(4, '0')
  const imageUrl =
    monster.pokemon.sprites.other?.home?.front_default ??
    monster.pokemon.sprites.other['official-artwork'].front_default ??
    `https://resource.pokemon-home.com/battledata/img/pokei128/icon${imageId}_f00_s0.png`

  return (
    <div
      className={clsx(
        'relative flex w-58 flex-col items-center gap-2',
        className
      )}
    >
      <Image
        src={imageUrl}
        alt={monster.name}
        width={128}
        height={128}
        priority
        loading="eager"
        className="object-scale-down"
      />
      <h3 className="text-lg font-medium text-black dark:text-white">
        {monster.name}
      </h3>
      <ul className="flex flex-row gap-2">
        {monster.pokemon.types.map((type) => (
          <li key={type.type.name}>
            <TypePill variant={type.type.name} size="medium" link={false} />
          </li>
        ))}
      </ul>
    </div>
  )
}

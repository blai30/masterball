'use client'

import Link from 'next/link'
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
  const url = monster.form
    ? `/${monster.species.name}/${monster.form.name}`
    : `/${monster.species.name}`

  const imageId = monster.species.id.toString().padStart(4, '0')
  const imageUrl =
    monster.pokemon.sprites.other?.home?.front_default ??
    monster.pokemon.sprites.front_default ??
    `https://resource.pokemon-home.com/battledata/img/pokei128/icon${imageId}_f00_s0.png`

  return (
    <Link
      href={url}
      className={clsx(
        'flex flex-col items-center gap-2 rounded-xl p-4',
        'transition-colors hover:bg-zinc-100 hover:duration-0 dark:hover:bg-zinc-900',
        className
      )}
    >
      <Image
        src={imageUrl}
        alt={`${monster.name} front default`}
        width={128}
        height={128}
        priority
        loading="eager"
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
    </Link>
  )
}

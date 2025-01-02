'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Type } from 'pokedex-promise-v2'

const typeClasses: Record<string, string> = {
  ['normal']: 'bg-gradient-to-br to-black/60 bg-normal',
  ['fighting']: 'bg-gradient-to-br to-black/60 bg-fighting',
  ['flying']: 'bg-gradient-to-br to-black/60 bg-flying',
  ['poison']: 'bg-gradient-to-br to-black/60 bg-poison',
  ['ground']: 'bg-gradient-to-br to-black/60 bg-ground',
  ['rock']: 'bg-gradient-to-br to-black/60 bg-rock',
  ['bug']: 'bg-gradient-to-br to-black/60 bg-bug',
  ['ghost']: 'bg-gradient-to-br to-black/60 bg-ghost',
  ['steel']: 'bg-gradient-to-br to-black/60 bg-steel',
  ['fire']: 'bg-gradient-to-br to-black/60 bg-fire',
  ['water']: 'bg-gradient-to-br to-black/60 bg-water',
  ['grass']: 'bg-gradient-to-br to-black/60 bg-grass',
  ['electric']: 'bg-gradient-to-br to-black/60 bg-electric',
  ['psychic']: 'bg-gradient-to-br to-black/60 bg-psychic',
  ['ice']: 'bg-gradient-to-br to-black/60 bg-ice',
  ['dragon']: 'bg-gradient-to-br to-black/60 bg-dragon',
  ['dark']: 'bg-gradient-to-br to-black/60 bg-dark',
  ['fairy']: 'bg-gradient-to-br to-black/60 bg-fairy',
}

export default function TypePill({ type }: { type: Type }) {
  const language = 'en'
  const name =
    type.names.find((typeName) => typeName.language.name === language) ??
    type.names.find((typeName) => typeName.language.name === 'en')!

  const imageUrl = `${process.env.NEXT_PUBLIC_BASEPATH}/${type.name}.png`

  return (
    <Link
      href={`/type/${type.name}`}
      className={[
        'flex w-32 flex-row items-center rounded-lg px-2 py-1.5',
        typeClasses[type.name],
      ].join(' ')}
    >
      <Image
        src={imageUrl}
        alt={type.name}
        width={24}
        height={24}
        className={[
          'aspect-square rounded-md object-contain',
          `bg-transparent`,
        ].join(' ')}
      />
      <p className="w-full rounded-r-md px-2 font-medium text-white uppercase dark:text-white">
        {name.name}
      </p>
    </Link>
  )
}

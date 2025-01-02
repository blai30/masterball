'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Type } from 'pokedex-promise-v2'

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
        `bg-gradient-to-br to-black/60 bg-${type.name}`,
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

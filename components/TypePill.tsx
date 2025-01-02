'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Type } from 'pokedex-promise-v2'
import { typeClasses, typeIconUrl } from '@/lib/utils'

export default function TypePill({ type }: { type: Type }) {
  const language = 'en'
  const name =
    type.names.find((typeName) => typeName.language.name === language) ??
    type.names.find((typeName) => typeName.language.name === 'en')!

  return (
    <Link
      href={`/type/${type.name}`}
      className={[
        'flex w-32 flex-row items-center rounded-lg px-2 py-1.5',
        `bg-gradient-to-br to-zinc-800 bg-${type.name}`,
      ].join(' ')}
    >
      <Image
        src={typeIconUrl(type.name)}
        alt={type.name}
        width={24}
        height={24}
        className={[
          'aspect-square rounded-md object-contain',
          `bg-transparent`,
        ].join(' ')}
      />
      <p className="w-full rounded-r-md px-2 font-medium text-black uppercase dark:text-white">
        {name.name}
      </p>
    </Link>
  )
}

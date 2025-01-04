'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Type } from 'pokedex-promise-v2'
import { useLanguage } from '@/lib/LanguageContext'

const typeClasses: Record<string, string> = {
  ['normal']: 'bg-normal',
  ['fighting']: 'bg-fighting',
  ['flying']: 'bg-flying',
  ['poison']: 'bg-poison',
  ['ground']: 'bg-ground',
  ['rock']: 'bg-rock',
  ['bug']: 'bg-bug',
  ['ghost']: 'bg-ghost',
  ['steel']: 'bg-steel',
  ['fire']: 'bg-fire',
  ['water']: 'bg-water',
  ['grass']: 'bg-grass',
  ['electric']: 'bg-electric',
  ['psychic']: 'bg-psychic',
  ['ice']: 'bg-ice',
  ['dragon']: 'bg-dragon',
  ['dark']: 'bg-dark',
  ['fairy']: 'bg-fairy',
}

export default function TypePill({ type }: { type: Type }) {
  const { language } = useLanguage()
  const name =
    type.names.find((typeName) => typeName.language.name === language) ??
    type.names.find((typeName) => typeName.language.name === 'en')!

  const imageUrl = `${process.env.NEXT_PUBLIC_BASEPATH}/${type.name}.png`

  return (
    <Link
      href={`/type/${type.name}`}
      className={[
        'flex w-36 flex-row items-center rounded-lg bg-gradient-to-br to-black/40 px-2 py-1.5 transition hover:scale-105',
        typeClasses[type.name],
      ].join(' ')}
    >
      <Image
        src={imageUrl}
        alt={type.name}
        width={24}
        height={24}
        priority
        loading="eager"
        className={[
          'aspect-square rounded-md object-contain',
          `bg-transparent`,
        ].join(' ')}
      />
      <p className="w-full rounded-r-md px-2 font-semibold text-white uppercase dark:text-white">
        {name.name}
      </p>
    </Link>
  )
}

import Image from 'next/image'
import Link from 'next/link'
import { Type } from 'pokedex-promise-v2'
import { getTranslation } from '@/lib/utils/pokeapiHelpers'

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

const sizeContainerClasses: Record<string, string> = {
  ['sm']: 'h-4 w-20 rounded-br-md rounded-l-xs rounded-tr-xs px-0.5',
  ['md']: 'h-6 w-28 rounded-br-md rounded-l-xs rounded-tr-xs px-1',
  ['lg']: 'h-8 w-32 rounded-full px-2',
}

const sizeTextClasses: Record<string, string> = {
  ['sm']: 'px-2 text-xs font-light tracking-tight',
  ['md']: 'px-2 text-xs font-normal tracking-normal',
  ['lg']: 'px-2 text-xs font-medium tracking-wide',
}

export default function TypePill({
  type,
  size = 'lg',
}: {
  type: Type
  size?: 'sm' | 'md' | 'lg'
}) {
  const name = getTranslation(type.names, 'name')
  const imageUrl = `${process.env.NEXT_PUBLIC_BASEPATH}/${type.name}.png`

  return (
    <Link
      href={`/type/${type.name}`}
      className={[
        'flex flex-row items-center',
        typeClasses[type.name],
        sizeContainerClasses[size],
      ].join(' ')}
    >
      {size !== 'sm' && (
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
      )}
      <p
        className={[
          'w-full text-white uppercase dark:text-white',
          sizeTextClasses[size],
        ].join(' ')}
      >
        {name}
      </p>
    </Link>
  )
}

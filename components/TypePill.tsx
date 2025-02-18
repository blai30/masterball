import Image from 'next/image'
import Link from 'next/link'
import { cva } from 'cva'
import { TypeLabels, TypeName } from '@/lib/utils/pokeapiHelpers'

const variants = cva({
  base: 'flex flex-row items-center',
  variants: {
    variant: {
      [TypeName.Normal]: 'bg-normal',
      [TypeName.Fighting]: 'bg-fighting',
      [TypeName.Flying]: 'bg-flying',
      [TypeName.Poison]: 'bg-poison',
      [TypeName.Ground]: 'bg-ground',
      [TypeName.Rock]: 'bg-rock',
      [TypeName.Bug]: 'bg-bug',
      [TypeName.Ghost]: 'bg-ghost',
      [TypeName.Steel]: 'bg-steel',
      [TypeName.Fire]: 'bg-fire',
      [TypeName.Water]: 'bg-water',
      [TypeName.Grass]: 'bg-grass',
      [TypeName.Electric]: 'bg-electric',
      [TypeName.Psychic]: 'bg-psychic',
      [TypeName.Ice]: 'bg-ice',
      [TypeName.Dragon]: 'bg-dragon',
      [TypeName.Dark]: 'bg-dark',
      [TypeName.Fairy]: 'bg-fairy',
    },
    size: {
      small:
        'size-6 rounded-xs',
      medium:
        'h-6 w-28 rounded-sm px-1 tracking-normal',
      large: 'h-8 w-32 rounded-full px-2 font-medium tracking-wide',
    },
  },
})

export default function TypePill({
  variant,
  size = 'large',
  link = true,
}: {
  variant: string
  size?: 'small' | 'medium' | 'large'
  link?: boolean
}) {
  const name = TypeLabels[variant as TypeName]
  const imageUrl = `${process.env.NEXT_PUBLIC_BASEPATH}/${variant}.png`

  return link ? (
    <Link
      href={`/type/${variant}`}
      className={variants({ variant: variant as TypeName, size })}
    >
      <Image
        src={imageUrl}
        alt={name}
        width={24}
        height={24}
        priority
        loading="eager"
        className="aspect-square bg-transparent object-contain"
      />
      {size !== 'small' && (
        <p className="w-full px-2 text-xs text-white uppercase dark:text-white">
          {name}
        </p>
      )}
    </Link>
  ) : (
    <div className={variants({ variant: variant as TypeName, size })}>
      <Image
        src={imageUrl}
        alt={name}
        width={24}
        height={24}
        priority
        loading="eager"
        className="aspect-square bg-transparent object-contain"
      />
      {size !== 'small' && (
        <p className="w-full px-2 text-xs text-white uppercase dark:text-white">
          {name}
        </p>
      )}
    </div>
  )
}

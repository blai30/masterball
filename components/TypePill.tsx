import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx/lite'
import { cva } from 'cva'
import { TypeLabels, TypeKey } from '@/lib/utils/pokeapiHelpers'

const variants = cva({
  base: 'flex flex-row items-center',
  variants: {
    variant: {
      [TypeKey.Normal]: 'bg-normal',
      [TypeKey.Fighting]: 'bg-fighting',
      [TypeKey.Flying]: 'bg-flying',
      [TypeKey.Poison]: 'bg-poison',
      [TypeKey.Ground]: 'bg-ground',
      [TypeKey.Rock]: 'bg-rock',
      [TypeKey.Bug]: 'bg-bug',
      [TypeKey.Ghost]: 'bg-ghost',
      [TypeKey.Steel]: 'bg-steel',
      [TypeKey.Fire]: 'bg-fire',
      [TypeKey.Water]: 'bg-water',
      [TypeKey.Grass]: 'bg-grass',
      [TypeKey.Electric]: 'bg-electric',
      [TypeKey.Psychic]: 'bg-psychic',
      [TypeKey.Ice]: 'bg-ice',
      [TypeKey.Dragon]: 'bg-dragon',
      [TypeKey.Dark]: 'bg-dark',
      [TypeKey.Fairy]: 'bg-fairy',
    },
    size: {
      small: 'w-24 gap-1.5 rounded-xs text-xs font-normal tracking-tight',
      medium: 'w-28 gap-2 rounded-sm p-0.5 text-xs font-semibold tracking-wide',
      large: 'w-32 gap-2.5 rounded-md p-1 text-sm font-semibold tracking-wider',
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
  const name = TypeLabels[variant as TypeKey]
  const imageUrl = `${process.env.NEXT_PUBLIC_BASEPATH}/${variant}.png`
  const dimensions = {
    small: 20,
    medium: 24,
    large: 28,
  }

  const Wrapper: React.ElementType = link ? Link : 'div'
  const wrapperProps = link ? { href: `/type/${variant}` } : {}

  return (
    <Wrapper
      {...wrapperProps}
      className={clsx(
        variants({ size }),
        link &&
          'transition-colors hover:bg-zinc-300 hover:duration-0 dark:hover:bg-zinc-700',
        'bg-zinc-200 dark:bg-zinc-800'
      )}
    >
      <Image
        src={imageUrl}
        alt={name}
        width={dimensions[size]}
        height={dimensions[size]}
        className={clsx(
          variants({ variant: variant as TypeKey }),
          'aspect-square rounded-xs object-contain'
        )}
      />
      <p className="inline-flex h-full w-full items-center text-black uppercase dark:text-white">
        {name}
      </p>
    </Wrapper>
  )
}

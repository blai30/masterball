import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx/lite'
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
  const name = TypeLabels[variant as TypeName]
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
        priority
        loading="eager"
        className={clsx(
          variants({ variant: variant as TypeName }),
          'aspect-square rounded-xs object-contain'
        )}
      />
      <p className="inline-flex h-full w-full items-center text-black uppercase dark:text-white">
        {name}
      </p>
    </Wrapper>
  )
}

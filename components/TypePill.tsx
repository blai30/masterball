import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx/lite'
import { cva } from 'cva'
import { TypeLabels, TypeName } from '@/lib/utils/pokeapiHelpers'

const variants = cva({
  base: '',
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
      small: 'size-6 rounded-xs',
      medium: 'w-28 rounded-sm p-0.5 text-sm font-medium tracking-wide',
      large: 'w-36 rounded-md p-1 text-lg font-semibold tracking-wider',
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
    small: 24,
    medium: 24,
    large: 32,
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
        'flex flex-row items-center overflow-hidden',
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
      {size !== 'small' && (
        <p className="inline-flex h-full w-full items-center px-2 text-white uppercase dark:text-white">
          {name}
        </p>
      )}
    </Wrapper>
  )
}

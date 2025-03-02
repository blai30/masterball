import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx/lite'
import { cva } from 'cva'
import { TypeLabels, TypeKey } from '@/lib/utils/pokeapiHelpers'

const variants = cva({
  base: 'flex flex-row items-center justify-center',
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
      small: 'size-5 rounded-xs',
      medium: 'size-6 rounded-sm',
      large: 'size-8 rounded-md',
    },
  },
})

export default function TypeIcon({
  variant,
  size = 'large',
  link = true,
  className,
}: {
  variant: string
  size?: 'small' | 'medium' | 'large'
  link?: boolean
  className?: string
}) {
  const name = TypeLabels[variant as TypeKey]
  const imageUrl = `${process.env.NEXT_PUBLIC_BASEPATH}/${variant}.png`
  const dimensions = {
    small: 20,
    medium: 28,
    large: 32,
  }

  const Wrapper: React.ElementType = link ? Link : 'div'
  const wrapperProps = link ? { href: `/type/${variant}` } : {}

  return (
    <Wrapper
      {...wrapperProps}
      title={name}
      className={clsx(
        variants({ variant: variant as TypeKey, size }),
        link &&
          'transition-(--tw-brightness) hover:brightness-125 hover:duration-0',
        className
      )}
    >
      <Image
        src={imageUrl}
        alt={name}
        width={dimensions[size]}
        height={dimensions[size]}
        priority
        loading="eager"
        className="relative object-contain"
      />
    </Wrapper>
  )
}

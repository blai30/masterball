import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx/lite'
import { cva } from 'cva'
import { TypeName } from '@/lib/utils/pokeapiHelpers'

const variants = cva({
  base: 'flex flex-row items-center justify-center',
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
}: {
  variant: string
  size?: 'small' | 'medium' | 'large'
  link?: boolean
}) {
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
      className={clsx(
        variants({ variant: variant as TypeName, size }),
        link &&
          'transition-(--tw-brightness) hover:brightness-125 hover:duration-0'
      )}
    >
      <Image
        src={imageUrl}
        alt={variant}
        width={dimensions[size]}
        height={dimensions[size]}
        priority
        loading="eager"
        className="relative object-contain"
      />
    </Wrapper>
  )
}

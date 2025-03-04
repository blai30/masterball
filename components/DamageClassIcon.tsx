import Image from 'next/image'
import Link from 'next/link'
import { clsx } from 'clsx/lite'
import { cva } from 'cva'
import { DamageClassLabels, DamageClassKey } from '@/lib/utils/pokeapiHelpers'

const variants = cva({
  base: 'flex flex-row items-center justify-center',
  variants: {
    variant: {
      [DamageClassKey.Physical]: 'bg-physical',
      [DamageClassKey.Special]: 'bg-special',
      [DamageClassKey.Status]: 'bg-status',
    },
    size: {
      small: 'size-5 rounded-xs',
      medium: 'size-6 rounded-sm',
      large: 'h-7 w-10 rounded-sm px-1',
    },
  },
})

export default function DamageClassIcon({
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
  const name = DamageClassLabels[variant as DamageClassKey]
  const imageUrl = `${process.env.NEXT_PUBLIC_BASEPATH}/${variant}.png`

  const Wrapper: React.ElementType = link ? Link : 'div'
  const wrapperProps = link ? { href: `/damage-class/${variant}` } : {}

  return (
    <Wrapper
      {...wrapperProps}
      title={name}
      className={clsx(
        'relative',
        variants({
          variant: variant as DamageClassKey,
          size,
        }),
        link &&
          'transition-(--tw-brightness) hover:brightness-125 hover:duration-0',
        className
      )}
    >
      {/* <div
        className={clsx(
          'h-full w-2',
          variants({ variant: variant as DamageClassName })
        )}
      ></div> */}
      <Image
        src={imageUrl}
        alt={name}
        width={50}
        height={40}
        className="relative object-contain px-0.5"
      />
    </Wrapper>
  )
}

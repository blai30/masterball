import Image from 'next/image'
import Link from 'next/link'
import { clsx } from 'clsx/lite'
import { cva } from 'cva'
import { DamageClassLabels, DamageClassName } from '@/lib/utils/pokeapiHelpers'

const variants = cva({
  base: 'flex flex-row items-center justify-center transition-(--tw-brightness) hover:brightness-125 hover:duration-0',
  variants: {
    variant: {
      [DamageClassName.Physical]: 'bg-physical',
      [DamageClassName.Special]: 'bg-special',
      [DamageClassName.Status]: 'bg-status',
    },
    size: {
      small: 'size-5 rounded-xs',
      medium: 'size-6 rounded-sm',
      large: 'h-7 w-10 rounded-sm',
    },
  },
})

export default function DamageClassPill({
  variant,
  size = 'large',
}: {
  variant: string
  size?: 'small' | 'medium' | 'large'
}) {
  const name = DamageClassLabels[variant as DamageClassName]
  const imageUrl = `${process.env.NEXT_PUBLIC_BASEPATH}/${variant}.png`

  return (
    <Link
      href={`/damage-class/${variant}`}
      title={name}
      className={clsx(
        '',
        'relative',
        variants({
          variant: variant as DamageClassName,
          size,
        })
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
        priority
        loading="eager"
        className="relative object-contain px-0.5"
      />
    </Link>
  )
}

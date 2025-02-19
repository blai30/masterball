import Image from 'next/image'
import Link from 'next/link'
import { clsx } from 'clsx/lite'
import { cva } from 'cva'
import { DamageClassLabels, DamageClassName } from '@/lib/utils/pokeapiHelpers'

const variants = cva({
  base: 'flex flex-row items-center justify-center transition-colors hover:duration-0',
  variants: {
    variant: {
      [DamageClassName.Physical]: 'bg-physical hover:bg-physical-light',
      [DamageClassName.Special]: 'bg-special hover:bg-special-light',
      [DamageClassName.Status]: 'bg-status hover:bg-status-light',
    },
    size: {
      small: 'w-8 rounded-sm',
      medium: 'w-10 rounded-md',
      large: 'w-20 rounded-xl',
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
        className="relative object-contain p-0.5"
      />
    </Link>
  )
}

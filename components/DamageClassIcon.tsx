import Image from 'next/image'
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
      large: 'size-8 rounded-md',
    },
  },
})

export default function DamageClassIcon({
  variant,
  size = 'large',
  className,
}: {
  variant: string
  size?: 'small' | 'medium' | 'large'
  className?: string
}) {
  const name = DamageClassLabels[variant as DamageClassKey]
  const imageUrl = `${process.env.NEXT_PUBLIC_BASEPATH}/${variant}.png`
  const dimensions = {
    small: 20,
    medium: 28,
    large: 32,
  }

  return (
    <div
      title={name}
      className={clsx(
        'relative',
        variants({
          variant: variant as DamageClassKey,
          size,
        }),
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
        width={dimensions[size]}
        height={dimensions[size]}
        className="absolute object-contain p-0.5"
      />
    </div>
  )
}

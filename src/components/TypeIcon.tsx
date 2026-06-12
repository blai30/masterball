import clsx from 'clsx/lite'
import { cva } from 'cva'

import { TYPES, type TypeKey } from '@/lib/domain/types'

const variants = cva({
  base: 'flex flex-row items-center justify-center',
  variants: {
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
  className,
  ...props
}: {
  variant: string
  size?: 'small' | 'medium' | 'large'
  className?: string
}) {
  const name = TYPES[variant as TypeKey]
  const imageUrl = `${variant}.png`
  const dimensions = {
    small: 20,
    medium: 28,
    large: 32,
  }

  return (
    <div
      {...props}
      title={name}
      className={clsx('relative', `bg-${variant}`, variants({ size }), className)}
    >
      <img
        src={imageUrl}
        alt={name}
        width={dimensions[size]}
        height={dimensions[size]}
        className="absolute object-contain"
      />
    </div>
  )
}

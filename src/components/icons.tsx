import clsx from 'clsx/lite'

import { DAMAGE_CLASSES, type DamageClassKey } from '@/lib/domain/damage-class'
import { TYPES, type TypeKey } from '@/lib/domain/types'

type IconSize = 'small' | 'medium' | 'large'

type IconProps = {
  variant: string
  size?: IconSize
  className?: string
}

const sizeClasses: Record<IconSize, string> = {
  small: 'size-5 rounded-xs',
  medium: 'size-6 rounded-sm',
  large: 'size-8 rounded-md',
}

const dimensions: Record<IconSize, number> = {
  small: 20,
  medium: 28,
  large: 32,
}

function IconBadge({
  variant,
  name,
  imgClassName,
  size = 'large',
  className,
  ...props
}: IconProps & { name: string; imgClassName?: string }) {
  return (
    <div
      {...props}
      title={name}
      className={clsx(
        'relative flex flex-row items-center justify-center',
        `bg-${variant}`,
        sizeClasses[size],
        className
      )}
    >
      <img
        src={`${variant}.png`}
        alt={name}
        width={dimensions[size]}
        height={dimensions[size]}
        className={clsx('absolute object-contain', imgClassName)}
      />
    </div>
  )
}

export function TypeIcon({ variant, ...props }: IconProps) {
  return <IconBadge variant={variant} name={TYPES[variant as TypeKey]} {...props} />
}

export function DamageClassIcon({ variant, ...props }: IconProps) {
  return (
    <IconBadge
      variant={variant}
      name={DAMAGE_CLASSES[variant as DamageClassKey]}
      imgClassName="p-[0.05rem]"
      {...props}
    />
  )
}

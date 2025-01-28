import Image from 'next/image'
import Link from 'next/link'
import { clsx } from 'clsx/lite'
import { cva } from 'cva'
import { damageClassLabels, DamageClassName } from '@/lib/utils/pokeapiHelpers'

const damageClassPill = cva({
  base: 'flex flex-row items-center',
  variants: {
    damageClass: {
      [DamageClassName.Physical]: 'bg-physical',
      [DamageClassName.Special]: 'bg-special',
      [DamageClassName.Status]: 'bg-status',
    },
    size: {
      small:
        'h-4 w-8 rounded-l-xs rounded-tr-xs rounded-br-md font-light tracking-tight',
      medium:
        'h-6 w-10 rounded-l-xs rounded-tr-xs rounded-br-md font-normal tracking-normal',
      large: 'h-8 w-12 rounded-full font-medium tracking-wide',
    },
  },
})

export default function DamageClassPill({
  damageClass,
  size = 'large',
}: {
  damageClass: string
  size?: 'small' | 'medium' | 'large'
}) {
  const name = damageClassLabels[damageClass as DamageClassName]
  const imageUrl = `${process.env.NEXT_PUBLIC_BASEPATH}/${damageClass}.png`

  return (
    <Link
      href={`/damage-class/${damageClass}`}
      title={name}
      className={clsx(
        'py-1',
        damageClassPill({
          damageClass: damageClass as DamageClassName,
          size,
        })
      )}
    >
      {/* <div
        className={clsx(
          'h-full w-2',
          damageClassPill({ damageClass: damageClass as DamageClassName })
        )}
      ></div> */}
      <Image
        src={imageUrl}
        alt={name}
        width={50}
        height={40}
        priority
        loading="eager"
        className="object-fill p-2"
      />
      <span className="sr-only">{name}</span>
    </Link>
  )
}

import Image from 'next/image'
import Link from 'next/link'
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
        'h-4 rounded-l-xs rounded-tr-xs rounded-br-md px-0.5 font-light tracking-tight',
      medium:
        'h-6 rounded-l-xs rounded-tr-xs rounded-br-md px-1 font-normal tracking-normal',
      large: 'h-8 rounded-full px-2 font-medium tracking-wide',
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
  const imageUrl = `${process.env.NEXT_PUBLIC_BASEPATH}/${name}.png`

  return (
    <Link
      href={`/damage-class/${name}`}
      className={damageClassPill({
        // damageClass: damageClass as DamageClassName,
        size,
      })}
    >
      <Image
        src={imageUrl}
        alt={name}
        width={40}
        height={20}
        priority
        loading="eager"
        className="rounded-md bg-transparent object-contain"
      />
    </Link>
  )
}

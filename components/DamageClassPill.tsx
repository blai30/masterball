import Image from 'next/image'
import Link from 'next/link'
import { clsx } from 'clsx/lite'
import { cva } from 'cva'
import { DamageClassLabels, DamageClassName } from '@/lib/utils/pokeapiHelpers'

const variants = cva({
  base: 'flex flex-row items-center',
  variants: {
    variant: {
      [DamageClassName.Physical]: 'bg-physical',
      [DamageClassName.Special]: 'bg-special',
      [DamageClassName.Status]: 'bg-status',
    },
    size: {
      small:
        'h-4 w-8 rounded-l-xs rounded-tr-xs rounded-br-md',
      medium:
        'h-6 w-10 rounded-l-xs rounded-tr-xs rounded-br-md',
      large: 'h-8 w-12 rounded-full',
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
        // 'py-1',
        ' relative',
        variants({
          // variant: variant as DamageClassName,
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
        className="object-contain p-1 dark:brightness-200 relative"
      />
    </Link>
  )
}

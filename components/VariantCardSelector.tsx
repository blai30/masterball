'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import clsx from 'clsx/lite'
import { Radio, RadioGroup } from '@headlessui/react'
import { Monster } from '@/lib/utils/pokeapiHelpers'
import VariantCard from '@/components/VariantCard'

export default function VariantCardSelector({
  monsters,
  className,
}: {
  monsters: Monster[]
  className?: string
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [selectedVariant, setSelectedVariant] = useState(pathname)

  const handleVariantChange = (url: string) => {
    setSelectedVariant(url)
    router.replace(url)
  }

  const getUrl = (monster: Monster) =>
    monster.formSlug
      ? `/${monster.speciesSlug}/${monster.formSlug}`
      : `/${monster.speciesSlug}`

  return (
    <RadioGroup
      value={selectedVariant}
      onChange={handleVariantChange}
      className={clsx(
        'grid grid-cols-1 gap-3 py-4 @lg:grid-cols-2 @3xl:grid-cols-3 @5xl:grid-cols-4 @7xl:grid-cols-5',
        className
      )}
    >
      {monsters.map((monster) => (
        <Radio
          key={monster.key}
          value={getUrl(monster)}
          aria-label={monster.name}
          className={clsx(
            'group relative flex cursor-pointer justify-center rounded-xl focus:outline-offset-4 data-checked:cursor-default',
            'bg-white inset-ring inset-ring-zinc-200 transition-colors hover:bg-zinc-100 hover:inset-ring-zinc-300 hover:duration-0 data-checked:inset-ring-2 data-checked:inset-ring-zinc-700 data-checked:hover:bg-inherit dark:bg-black dark:inset-ring-zinc-800 dark:hover:bg-zinc-900 dark:hover:inset-ring-zinc-700 dark:data-checked:inset-ring-zinc-300'
          )}
        >
          <VariantCard monster={monster} />
        </Radio>
      ))}
    </RadioGroup>
  )
}

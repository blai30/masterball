'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import clsx from 'clsx/lite'
import { Radio, RadioGroup } from '@headlessui/react'
import { Monster } from '@/lib/utils/pokeapiHelpers'
import VariantCard from '@/components/compounds/VariantCard'

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
        // 'grid grid-cols-2 gap-2 py-4 @md:grid-cols-3 @2xl:grid-cols-4 @3xl:grid-cols-5 @4xl:grid-cols-6 @5xl:grid-cols-7 @6xl:grid-cols-8',
        'flex flex-row gap-2 py-4',
        className
      )}
    >
      {monsters.map((monster) => (
        <Radio
          key={monster.key}
          value={getUrl(monster)}
          aria-label={monster.name}
          className={clsx(
            'group relative flex cursor-pointer justify-center rounded-xl focus:outline-offset-4 data-checked:cursor-default'
          )}
        >
          <VariantCard
            monster={monster}
            className={clsx(
              // 'rounded-xl',
              'group-data-checked:bg-inherit group-data-checked:inset-ring-2 group-data-checked:inset-ring-zinc-700 dark:group-data-checked:inset-ring-zinc-300'
            )}
            variant={selectedVariant === getUrl(monster) ? 'default' : 'link'}
          />
        </Radio>
      ))}
    </RadioGroup>
  )
}

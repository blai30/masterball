import { Radio, RadioGroup } from '@headlessui/react'
import clsx from 'clsx/lite'
import { useState } from 'react'

import VariantCard from '@/components/compounds/VariantCard'
import type { Monster } from '@/lib/utils/pokeapi-helpers'

export default function VariantCardSelector({
  monsters,
  pathname,
  className,
}: {
  monsters: Monster[]
  pathname: string
  className?: string
}) {
  const [selectedVariant, setSelectedVariant] = useState<string>(pathname)

  const handleVariantChange = (url: string) => {
    setSelectedVariant(url)
    window.location.href = url
  }

  const getUrl = (monster: Monster) =>
    monster.formSlug ? `/${monster.speciesSlug}/${monster.formSlug}` : `/${monster.speciesSlug}`

  return (
    <RadioGroup
      value={selectedVariant}
      onChange={handleVariantChange}
      className={clsx('flex flex-row gap-2 py-4', className)}
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

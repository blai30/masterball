import { useState, useEffect } from 'react'
import clsx from 'clsx/lite'
import { Radio, RadioGroup } from '@headlessui/react'
import type { Monster } from '@/lib/utils/pokeapi-helpers'
import VariantCard from '@/components/compounds/VariantCard'

export default function VariantCardSelector({
  monsters,
  className,
}: {
  monsters: Monster[]
  className?: string
}) {
  const [selectedVariant, setSelectedVariant] = useState('/')

  useEffect(() => {
    setSelectedVariant(window.location.pathname)
  }, [])

  const basePath = (import.meta as { env: Record<string, string> }).env?.PUBLIC_BASEPATH || ''

  const getUrl = (monster: Monster) => {
    const path = monster.formSlug
      ? `/${monster.speciesSlug}/${monster.formSlug}`
      : `/${monster.speciesSlug}`
    return basePath + path
  }

  const handleVariantChange = (url: string) => {
    setSelectedVariant(url)
    window.location.href = url
  }

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
              'group-data-checked:bg-inherit group-data-checked:inset-ring-2 group-data-checked:inset-ring-zinc-700 dark:group-data-checked:inset-ring-zinc-300'
            )}
            variant={selectedVariant === getUrl(monster) ? 'default' : 'link'}
          />
        </Radio>
      ))}
    </RadioGroup>
  )
}

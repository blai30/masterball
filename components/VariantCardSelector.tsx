'use client'

import clsx from 'clsx/lite'
import { Monster } from '@/lib/utils/pokeapiHelpers'
import VariantCard from '@/components/VariantCard'
import { Radio, RadioGroup } from '@headlessui/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function VariantCardSelector({
  monsters,
  className,
}: {
  monsters: Monster[]
  className?: string
}) {
  const [selectedVariant, setSelectedVariant] = useState(monsters[0].key)
  const router = useRouter()

  const handleVariantChange = (variant: string) => {
    setSelectedVariant(variant)
    const url = monsters.find((m) => m.key === variant)?.form
      ? `/${monsters.find((m) => m.key === variant)?.species.name}/${
          monsters.find((m) => m.key === variant)?.form.name
        }`
      : `/${monsters.find((m) => m.key === variant)?.species.name}`
    router.push(url, { scroll: false })
  }

  return (
    <RadioGroup
      value={selectedVariant}
      onChange={handleVariantChange}
      className="flex flex-row gap-4 py-2"
    >
      <p>{selectedVariant}</p>
      {monsters.map((monster) => (
        <Radio
          key={monster.key}
          value={monster.key}
          aria-label={monster.name}
          className="group relative flex cursor-pointer border border-gray-300 bg-white focus:outline-hidden data-checked:border-indigo-600 data-checked:ring-2 data-checked:ring-indigo-600 dark:bg-black"
        >
          {monster.name}
        </Radio>
      ))}
    </RadioGroup>
  )
}

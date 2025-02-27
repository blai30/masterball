'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import clsx from 'clsx'
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
    monster.form
      ? `/${monster.species.name}/${monster.form.name}`
      : `/${monster.species.name}`

  return (
    <>
      <p>{selectedVariant}</p>
      <RadioGroup
        value={selectedVariant}
        onChange={handleVariantChange}
        className="flex flex-row gap-4 py-2"
      >
        {monsters.map((monster) => (
          <Radio
            key={monster.key}
            value={getUrl(monster)}
            aria-label={monster.name}
            className={clsx(
              'group relative flex min-w-64 cursor-pointer justify-center rounded-xl p-4 focus:outline-hidden',
              'bg-white inset-ring inset-ring-zinc-600 transition-colors hover:bg-zinc-100 hover:duration-0 data-checked:ring-2 data-checked:ring-indigo-600 data-checked:inset-ring-indigo-400 dark:bg-black dark:inset-ring-zinc-600 dark:hover:bg-zinc-900'
            )}
          >
            <VariantCard monster={monster} />
          </Radio>
        ))}
      </RadioGroup>
    </>
  )
}

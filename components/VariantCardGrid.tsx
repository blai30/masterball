'use client'

import clsx from 'clsx/lite'
import { Monster } from '@/lib/utils/pokeapiHelpers'
import VariantCard from '@/components/VariantCard'

export default function VariantCardGrid({
  monsters,
  activeKey,
  className,
}: {
  monsters: Record<string, Monster>
  activeKey: string
  className?: string
}) {
  return (
    <ul className={clsx('flex flex-row gap-4 py-2', className)}>
      {Object.entries(monsters).map(([key, monster]) => {
        const active = monster.key === activeKey
        return (
          <li key={monster.key} className="w-66">
            <VariantCard
              monster={monster}
              className={clsx(
                active ? 'pointer-events-none bg-zinc-200 dark:bg-zinc-800' : ''
              )}
            />
          </li>
        )
      })}
    </ul>
  )
}

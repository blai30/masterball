import clsx from 'clsx/lite'

import VariantCard from '@/components/compounds/VariantCard'
import Link from '@/components/ui/catalyst/link'
import { normalizePathname, resolvePath } from '@/lib/utils/path'
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
  const selectedVariant = normalizePathname(pathname)

  const getUrl = (monster: Monster) =>
    monster.formSlug ? `/${monster.speciesSlug}/${monster.formSlug}` : `/${monster.speciesSlug}`

  return (
    <div className={clsx('flex flex-row gap-2 py-4', className)}>
      {monsters.map((monster) => {
        const active = selectedVariant === getUrl(monster)
        return (
          <Link
            key={monster.key}
            // href={getUrl(monster)}
            aria-label={monster.name}
            onClick={(e) => {
              e.preventDefault()
              window.location.replace(resolvePath(getUrl(monster)))
            }}
            className={clsx(
              'group relative flex justify-center rounded-xl focus:outline-offset-4',
              active ? 'cursor-default' : 'cursor-pointer'
            )}
            aria-current={active ? 'page' : undefined}
            aria-disabled={active}
          >
            <VariantCard
              monster={monster}
              className={clsx(
                'group-aria-[current=page]:bg-inherit group-aria-[current=page]:inset-ring-2 group-aria-[current=page]:inset-ring-zinc-700 dark:group-aria-[current=page]:inset-ring-zinc-300'
              )}
              variant={active ? 'default' : 'link'}
            />
          </Link>
        )
      })}
    </div>
  )
}

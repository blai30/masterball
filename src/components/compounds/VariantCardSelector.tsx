import clsx from 'clsx/lite'

import VariantCard from '@/components/compounds/VariantCard'
import Link from '@/components/ui/catalyst/link'
import { normalizePathname } from '@/lib/utils/path'
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
      {monsters.map((monster) => (
        <Link
          key={monster.key}
          // href={getUrl(monster)}
          aria-label={monster.name}
          onClick={(e) => {
            e.preventDefault()
            window.location.replace(getUrl(monster))
          }}
          className={clsx(
            'group relative flex justify-center rounded-xl focus:outline-offset-4',
            selectedVariant === getUrl(monster) ? 'cursor-default' : 'cursor-pointer'
          )}
          aria-current={selectedVariant === getUrl(monster) ? 'page' : undefined}
        >
          <VariantCard
            monster={monster}
            className={clsx(
              'group-aria-[current=page]:bg-inherit group-aria-[current=page]:inset-ring-2 group-aria-[current=page]:inset-ring-zinc-700 dark:group-aria-[current=page]:inset-ring-zinc-300'
            )}
            variant={selectedVariant === getUrl(monster) ? 'default' : 'link'}
          />
        </Link>
      ))}
    </div>
  )
}

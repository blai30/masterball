import { memo } from 'react'

import Link from '@/components/ui/catalyst/link'
import type { TypeKey } from '@/lib/domain/types'
import { toHref } from '@/lib/utils/path'

export type MonsterCardProps = {
  id: number
  slug: string
  name: string
  types: TypeKey[]
}

const MonsterCard = ({ props }: { props: MonsterCardProps }) => {
  const imageId = props.id.toString().padStart(4, '0')
  const imageUrl = `https://raw.githubusercontent.com/blai30/PokemonSpritesDump/refs/heads/main/sprites/sprite_${imageId}_s0.webp`

  return (
    <div className="h-full rounded-xl bg-zinc-100/50 inset-ring-1 inset-ring-zinc-200/50 backdrop-blur-xl transition-colors hover:bg-zinc-200/60 hover:inset-ring-zinc-300/60 hover:duration-0 dark:bg-zinc-900/50 dark:inset-ring-zinc-800/50 dark:hover:bg-zinc-800/60 dark:hover:inset-ring-zinc-700/60">
      <Link
        href={toHref(props.slug)}
        className="group flex flex-col items-center justify-between px-2 py-3"
      >
        <p
          aria-hidden="true"
          className="font-num h-3 text-sm text-zinc-600 opacity-0 transition-opacity group-hover:opacity-100 group-hover:transition-none dark:text-zinc-400"
        >
          {props.id}
        </p>
        <div className="min-w-full py-3">
          <img
            src={imageUrl}
            alt={props.slug}
            width={128}
            height={128}
            className="object-contain"
            fetchPriority="high"
            style={{ viewTransitionName: `pokemon-sprite-${props.slug}` }}
          />
        </div>
        <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{props.name}</h3>
      </Link>
    </div>
  )
}

export default memo(MonsterCard)

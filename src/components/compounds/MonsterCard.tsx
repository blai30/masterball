import { motion } from 'motion/react'
import { memo } from 'react'

import GlassCard from '@/components/GlassCard'
import Link from '@/components/ui/catalyst/link'
import type { TypeKey } from '@/lib/utils/pokeapi-helpers'

export type MonsterCardProps = {
  id: number
  slug: string
  name: string
  types: TypeKey[]
}

const MonsterCard = ({ props }: { props: MonsterCardProps }) => {
  const imageId = props.id.toString().padStart(4, '0')
  const imageUrl = `https://raw.githubusercontent.com/blai30/PokemonSpritesDump/refs/heads/main/sprites/sprite_${imageId}_s0.webp`
  const layoutId = `pokemon-image-${props.id}`

  return (
    <GlassCard variant="link" className="h-full rounded-xl">
      <Link
        href={`${import.meta.env.BASE_URL}${props.slug}`}
        className="group flex flex-col items-center justify-between px-2 py-3"
      >
        <p aria-hidden="true" className="font-num text-xs text-zinc-400 dark:text-zinc-500">
          {props.id}
        </p>
        <motion.div layoutId={layoutId} className="min-w-full py-3">
          <img
            src={imageUrl}
            alt={props.slug}
            width={128}
            height={128}
            className="object-contain"
            fetchPriority="high"
          />
        </motion.div>
        <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{props.name}</h3>
      </Link>
    </GlassCard>
  )
}

export default memo(MonsterCard)

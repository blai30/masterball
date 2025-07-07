'use client'

import Image from 'next/image'
import { memo } from 'react'
import GlassCard from '@/components/GlassCard'

const ItemCard = ({
  id,
  slug,
  name,
  description,
  imageUrl,
}: {
  id: number
  slug: string
  name: string
  description: string
  imageUrl?: string
}) => {
  // const imageUrl = `https://raw.githubusercontent.com/blai30/PokemonSpritesDump/refs/heads/main/sprites/sprite_${imageId}_s0.webp`

  return (
    <GlassCard variant="default" className="h-48 rounded-xl">
      <div className="group flex flex-row items-start gap-4 p-4">
        {imageUrl && (
          <div className="aspect-square size-16">
            <Image
              src={imageUrl}
              alt={slug}
              width={64}
              height={64}
              className=""
            />
          </div>
        )}
        <div className="flex flex-col items-start gap-1">
          <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
            {name}
          </h3>
          <p className="text-base font-normal text-zinc-700 dark:text-zinc-300">
            {description}
          </p>
        </div>
      </div>
    </GlassCard>
  )
}

export default memo(ItemCard)

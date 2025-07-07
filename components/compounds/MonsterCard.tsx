'use client'

import Image from 'next/image'
import Link from 'next/link'
import { memo } from 'react'
import GlassCard from '@/components/GlassCard'

export type MonsterCardProps = {
  id: number
  slug: string
  name: string
}

const MonsterCard = ({ props }: { props: MonsterCardProps }) => {
  const imageId = props.id.toString().padStart(4, '0')
  // const imageUrl = `https://resource.pokemon-home.com/battledata/img/pokei128/icon${imageId}_f00_s0.png`
  const imageUrl = `https://raw.githubusercontent.com/blai30/PokemonSpritesDump/refs/heads/main/sprites/sprite_${imageId}_s0.webp`

  return (
    <GlassCard variant="link" className="h-full rounded-xl">
      <Link
        href={`/${props.slug}`}
        className="group flex flex-col items-center justify-between px-2 py-3"
      >
        <p
          aria-hidden="true"
          className="font-num text-sm text-zinc-400 dark:text-zinc-500"
        >
          {props.id}
        </p>
        <Image
          src={imageUrl}
          alt={props.slug}
          width={128}
          height={128}
          className="min-w-full object-contain py-1"
        />
        <h3 className="font-base rounded-xs text-base text-zinc-700 dark:text-zinc-300">
          {props.name}
        </h3>
      </Link>
    </GlassCard>
  )
}

export default memo(MonsterCard)

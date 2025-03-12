'use client'

import Image from 'next/image'
import Link from 'next/link'
import GlassCard from '@/components/GlassCard'
import { memo } from 'react'

const MonsterCard = memo(function MonsterCard({
  id,
  slug,
  name,
}: {
  id: number
  slug: string
  name: string
}) {
  const imageId = id.toString().padStart(4, '0')
  const imageUrl = `https://resource.pokemon-home.com/battledata/img/pokei128/icon${imageId}_f00_s0.png`

  return (
    <GlassCard variant="link" className="h-full rounded-xl">
      <Link
        href={`/${slug}`}
        className="group flex flex-col items-center justify-between px-2 py-3"
      >
        <p
          aria-hidden="true"
          className="font-num text-sm text-zinc-400 dark:text-zinc-500"
        >
          {id}
        </p>
        <Image
          src={imageUrl}
          alt={slug}
          width={128}
          height={128}
          className="min-w-full object-contain py-1"
        />
        <h3 className="rounded-xs text-base font-base text-zinc-700 dark:text-zinc-300">
          {name}
        </h3>
      </Link>
    </GlassCard>
  )
})

export default MonsterCard

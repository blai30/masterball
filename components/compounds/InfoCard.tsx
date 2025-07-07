'use client'

import Image from 'next/image'
import GlassCard from '@/components/GlassCard'

interface InfoCardProps {
  id: number
  slug: string
  name: string
  description: string
  imageUrl?: string
}

export default function InfoCard({
  id,
  slug,
  name,
  description,
  imageUrl,
}: InfoCardProps) {
  return (
    <GlassCard variant="default" className="h-full rounded-xl">
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

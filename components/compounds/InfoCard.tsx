'use client'

import Image from 'next/image'
import GlassCard from '@/components/GlassCard'

export type InfoCardProps = {
  id: number
  slug: string
  name: string
  description: string
  imageUrl?: string
}

export default function InfoCard({ props }: { props: InfoCardProps }) {
  return (
    <GlassCard variant="default" className="h-full rounded-xl">
      <div className="flex flex-row items-start gap-4 p-4">
        {props.imageUrl && (
          <div className="flex aspect-square size-20 items-center justify-center rounded-md bg-gradient-to-br from-zinc-100 to-zinc-200 p-2 dark:from-zinc-800 dark:to-zinc-900">
            <Image
              src={props.imageUrl}
              alt={props.slug}
              width={64}
              height={64}
              className=""
            />
          </div>
        )}
        <div className="flex flex-col items-start gap-1">
          <h3 className="text-lg font-medium text-black dark:text-white">
            {props.name}
          </h3>
          <p className="text-base font-normal text-zinc-600 dark:text-zinc-400">
            {props.description}
          </p>
        </div>
      </div>
    </GlassCard>
  )
}

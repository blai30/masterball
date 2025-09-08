'use client'

import Image from 'next/image'
import type { FlavorText, VersionGroupFlavorText } from 'pokedex-promise-v2'
import GlassCard from '@/components/GlassCard'
import { useVersionGroup } from '@/lib/stores/version-group'
import { Badge } from '@/components/ui/catalyst/badge'

type Tag = {
  label: string
  value: string
}

export type InfoCardProps = {
  id: number
  slug: string
  name: string
  defaultDescription: string
  flavorTextEntries: FlavorText[] | VersionGroupFlavorText[]
  imageUrl?: string
  tags?: Tag[]
}

export default function InfoCard({ props }: { props: InfoCardProps }) {
  const { versionGroup, hasMounted } = useVersionGroup()
  if (!hasMounted) return null

  const description = (() => {
    const entry = props.flavorTextEntries.find(
      (entry) =>
        entry.language.name === 'en' &&
        entry.version_group?.name === versionGroup
    )
    if (!entry) return props.defaultDescription
    if ('text' in entry) return entry.text
    if ('flavor_text' in entry) return entry.flavor_text

    return props.defaultDescription
  })()

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
              priority={true}
              loading="eager"
            />
          </div>
        )}
        <div className="flex flex-col items-start gap-2">
          <h3 className="text-lg font-medium text-black dark:text-white">
            {props.name}
          </h3>
          {props.tags && props.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {props.tags.map((tag) => (
                <Badge key={tag.value} color="zinc">
                  {tag.label}
                </Badge>
              ))}
            </div>
          )}
          <p className="text-base font-normal text-zinc-600 dark:text-zinc-400">
            {description}
          </p>
        </div>
      </div>
    </GlassCard>
  )
}

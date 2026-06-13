import type { FlavorText, VersionGroupFlavorText } from 'pokedex-promise-v2'
import { memo } from 'react'

import { Badge } from '@/components/ui/catalyst/badge'
import { useVersionGroup } from '@/lib/stores/version-group'
import { resolveFlavorText } from '@/lib/utils/pokeapi-helpers'

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

const InfoCard = ({ props }: { props: InfoCardProps }) => {
  const { versionGroup } = useVersionGroup()

  const description =
    resolveFlavorText(props.flavorTextEntries, versionGroup) ?? props.defaultDescription

  return (
    <div className="h-full rounded-xl bg-zinc-100/50 inset-ring-1 inset-ring-zinc-200/50 backdrop-blur-xl dark:bg-zinc-900/50 dark:inset-ring-zinc-800/50">
      <div className="flex flex-row items-start gap-4 p-4">
        {props.imageUrl && (
          <div className="flex aspect-square size-20 items-center justify-center rounded-md bg-linear-to-br from-zinc-100 to-zinc-200 p-2 dark:from-zinc-800 dark:to-zinc-900">
            <img
              src={props.imageUrl}
              alt={props.slug}
              width={64}
              height={64}
              fetchPriority="high"
              loading="eager"
            />
          </div>
        )}
        <div className="flex flex-col items-start gap-2">
          <h3 className="text-lg font-medium text-black dark:text-white">{props.name}</h3>
          {props.tags && props.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {props.tags.map((tag) => (
                <Badge key={tag.value} color="zinc">
                  {tag.label}
                </Badge>
              ))}
            </div>
          )}
          <p className="text-base font-normal text-zinc-600 dark:text-zinc-400">{description}</p>
        </div>
      </div>
    </div>
  )
}

export default memo(InfoCard)

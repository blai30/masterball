import type { FlavorText, VersionGroupFlavorText } from 'pokedex-promise-v2'
import { memo } from 'react'

import { Badge } from '@/components/ui/catalyst/badge'
import {
  ITEM_CATEGORIES,
  type ItemCategoryKey,
  ITEM_POCKETS,
  type ItemPocketKey,
} from '@/lib/domain/items'
import { useVersionGroup } from '@/lib/stores/version-group'

export type ItemCardProps = {
  id: number
  slug: string
  name: string
  defaultDescription: string
  flavorTextEntries: FlavorText[] | VersionGroupFlavorText[]
  imageUrl?: string
  pocket: ItemPocketKey
  category: ItemCategoryKey
}

const ItemCard = ({ props }: { props: ItemCardProps }) => {
  const { versionGroup } = useVersionGroup()

  const description = (() => {
    const entry = props.flavorTextEntries.find(
      (entry) => entry.language.name === 'en' && entry.version_group?.name === versionGroup
    )
    if (!entry) return props.defaultDescription
    if ('text' in entry) return entry.text
    if ('flavor_text' in entry) return entry.flavor_text

    return props.defaultDescription
  })()

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
          <div className="flex flex-wrap gap-1">
            <Badge key={props.pocket} color="zinc">
              {ITEM_POCKETS[props.pocket]}
            </Badge>
            <Badge key={props.category} color="zinc">
              {ITEM_CATEGORIES[props.category].label}
            </Badge>
          </div>
          <p className="text-base font-normal text-zinc-600 dark:text-zinc-400">{description}</p>
        </div>
      </div>
    </div>
  )
}

export default memo(ItemCard)

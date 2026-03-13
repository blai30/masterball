import Link from '@/components/ui/catalyst/link'
import type { TypeKey } from '@/lib/utils/pokeapi-helpers'
import GlassCard from '@/components/GlassCard'
import TypeIcon from '@/components/TypeIcon'

export type MonsterPillData = {
  speciesSlug: string
  name: string
  imageUrl: string
  types: TypeKey[]
}

export default function MonsterPill({ data }: { data: MonsterPillData }) {
  return (
    <GlassCard variant="link" className="rounded-lg">
      <Link
        href={`/${data.speciesSlug}`}
        className="group flex w-56 items-center gap-3 px-3 py-2"
      >
        <img
          src={data.imageUrl}
          alt={data.speciesSlug}
          width={64}
          height={64}
          className="w-16 object-contain py-1"
        />
        <div className="flex h-full w-full flex-col justify-between gap-1">
          <h3 className="rounded-xs text-lg font-medium text-zinc-700 dark:text-zinc-300">
            {data.name}
          </h3>
          <div className="flex flex-row gap-1">
            {data.types.map((type) => (
              <TypeIcon
                key={type}
                variant={type}
                size="small"
              />
            ))}
          </div>
        </div>
      </Link>
    </GlassCard>
  )
}

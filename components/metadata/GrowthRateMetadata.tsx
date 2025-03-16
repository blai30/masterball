import type { GrowthRate } from 'pokedex-promise-v2'
import { getTranslation } from '@/lib/utils/pokeapiHelpers'

export default function GrowthRateMetadata({
  growthRate,
}: {
  growthRate: GrowthRate
}) {
  const title = 'Growth rate'
  const description = getTranslation(growthRate.descriptions, 'description')

  const maxExperience = growthRate.levels.find(
    (level) => level.level === 100
  )!.experience

  return (
    <div className="flex flex-col gap-2 rounded-lg">
      <h2 className="text-sm/6 text-zinc-600 dark:text-zinc-400">{title}</h2>
      <div className="flex flex-col">
        <p className="flex gap-x-1">
          <span className="text-base font-light text-black dark:text-white">
            {maxExperience.toLocaleString()}
          </span>
          <span className="text-base text-zinc-600 dark:text-zinc-400">
            points
          </span>
        </p>
        <p className="flex gap-x-1">
          <span className="text-base font-light text-black dark:text-white">
            {description}
          </span>
        </p>
      </div>
    </div>
  )
}

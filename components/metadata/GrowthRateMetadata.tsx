'use client'

import { GrowthRate } from 'pokedex-promise-v2'
import { useLanguage } from '@/lib/LanguageContext'

export default function GrowthRateMetadata({
  growthRate,
}: {
  growthRate: GrowthRate
}) {
  const { language } = useLanguage()
  const title = 'Growth rate'

  const maxExperience = growthRate.levels.find(
    (level) => level.level === 100
  )!.experience

  const growthRateName =
    growthRate.descriptions.find(
      (description) => description.language.name === language
    ) ??
    growthRate.descriptions.find(
      (description) => description.language.name === 'en'
    )!

  return (
    <div className="flex flex-col gap-2 rounded-lg p-4">
      <p className="text-sm/6 text-zinc-600 dark:text-zinc-400">{title}</p>
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
            {growthRateName.description}
          </span>
        </p>
      </div>
    </div>
  )
}

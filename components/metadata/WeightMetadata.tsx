'use client'

import { useLanguage } from '@/lib/LanguageContext'

export default function WeightMetadata({ weight }: { weight: number }) {
  const { language } = useLanguage()
  const title = 'Weight'

  // Convert from hectograms to pounds and kilograms.
  const weightPounds = Math.fround(weight / 4.536).toFixed(1)
  const weightKilograms = (weight / 10).toFixed(1)

  return (
    <div className="flex flex-col gap-2 rounded-lg p-4">
      <p className="text-sm/6 text-zinc-600 dark:text-zinc-400">{title}</p>
      <div className="flex flex-col">
        <p className="flex gap-x-1">
          <span className="text-base font-light text-black dark:text-white">
            {weightPounds}
          </span>
          <span className="text-base text-zinc-600 dark:text-zinc-400">
            lbs
          </span>
        </p>
        <p className="flex gap-x-1">
          <span className="text-base font-light text-black dark:text-white">
            {weightKilograms}
          </span>
          <span className="text-base text-zinc-600 dark:text-zinc-400">kg</span>
        </p>
      </div>
    </div>
  )
}

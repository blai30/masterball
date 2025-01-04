'use client'

import { useLanguage } from '@/components/LanguageContext'

export default function HatchCounterMetadata({
  hatchCounter,
}: {
  hatchCounter: number
}) {
  const { language } = useLanguage()
  const title = 'Hatch counter'

  // Multiply hatch cycles by number of steps in a cycle.
  const hatchSteps = (hatchCounter * 128).toLocaleString()

  return (
    <div className="flex flex-col gap-2 rounded-lg p-4">
      <p className="text-sm/6 text-zinc-600 dark:text-zinc-400">{title}</p>
      <div className="flex flex-col">
        <p className="flex gap-x-1">
          <span className="text-base font-light text-black dark:text-white">
            {hatchSteps}
          </span>
          <span className="text-base text-zinc-600 dark:text-zinc-400">
            steps
          </span>
        </p>
        <p className="flex gap-x-1">
          <span className="text-base font-light text-black dark:text-white">
            {hatchCounter.toLocaleString()}
          </span>
          <span className="text-base text-zinc-600 dark:text-zinc-400">
            cycles
          </span>
        </p>
      </div>
    </div>
  )
}
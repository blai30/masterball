import { lazy, Suspense, useEffect, useState } from 'react'

import LoadingSection from '@/components/details/LoadingSection'
import { loadMovesData, loadMovesDescriptions } from '@/lib/api/moves-client'
import { useVersionGroup } from '@/lib/stores/version-group'
import {
  LearnMethodKey,
  VersionGroupLabels,
  type LearnsetEntry,
  type MoveRow,
  type MovesDataMap,
  type MovesDescriptionsMap,
} from '@/lib/utils/pokeapi-helpers'

const MovesTable = lazy(() => import('@/components/details/moves/MovesTable'))

const methodOrder = Object.values(LearnMethodKey)

function emptyByMethod(): Record<LearnMethodKey, MoveRow[]> {
  return {
    [LearnMethodKey.FormChange]: [],
    [LearnMethodKey.LevelUp]: [],
    [LearnMethodKey.Machine]: [],
    [LearnMethodKey.Tutor]: [],
    [LearnMethodKey.Egg]: [],
  }
}

export default function MovesSection({
  learnset,
  defaultRows,
  defaultVersionGroup,
}: {
  learnset: LearnsetEntry[]
  defaultRows: Record<LearnMethodKey, MoveRow[]>
  defaultVersionGroup: string
}) {
  const title = 'Moves'
  const { versionGroup } = useVersionGroup()
  const isDefault = versionGroup === defaultVersionGroup

  const [movesData, setMovesData] = useState<MovesDataMap | null>(null)
  const [descriptions, setDescriptions] = useState<MovesDescriptionsMap | null>(null)

  // Shared move data is required to render rows for a non-default version group.
  useEffect(() => {
    if (isDefault || movesData) return
    let active = true
    loadMovesData()
      .then((data) => {
        if (active) setMovesData(data)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [isDefault, movesData])

  // Descriptions are only shown on row expansion, so prefetch them at idle once a
  // non-default version is active to keep expanding instant without blocking anything.
  useEffect(() => {
    if (isDefault || descriptions) return
    let active = true
    const prefetch = () => {
      loadMovesDescriptions()
        .then((data) => {
          if (active) setDescriptions(data)
        })
        .catch(() => {})
    }
    const handle =
      typeof window.requestIdleCallback === 'function'
        ? window.requestIdleCallback(prefetch)
        : window.setTimeout(prefetch, 200)
    return () => {
      active = false
      if (typeof window.cancelIdleCallback === 'function') {
        window.cancelIdleCallback(handle as number)
      } else {
        window.clearTimeout(handle as number)
      }
    }
  }, [isDefault, descriptions])

  // Ensures descriptions are loaded when a user expands a row, in case the idle
  // prefetch has not run yet.
  const ensureDescriptions = () => {
    loadMovesDescriptions()
      .then(setDescriptions)
      .catch(() => {})
  }

  const rowsByMethod = (() => {
    if (isDefault) return defaultRows
    if (!movesData) return emptyByMethod()

    const result = emptyByMethod()
    for (const entry of learnset) {
      if (entry.versionGroup !== versionGroup) continue
      const moveData = movesData[entry.slug]
      if (!moveData) continue
      result[entry.method].push({
        ...moveData,
        id: entry.id,
        slug: entry.slug,
        versionGroup: entry.versionGroup,
        description: descriptions
          ? (descriptions[entry.slug]?.[versionGroup] ?? descriptions[entry.slug]?._default ?? '')
          : undefined,
      })
    }
    return result
  })()

  const sectionClass =
    'flex flex-col gap-4 rounded-xl p-4 inset-ring-1 inset-ring-zinc-200 dark:inset-ring-zinc-800'
  const heading = <h2 className="text-xl font-medium text-black dark:text-white">{title}</h2>

  if (learnset.length === 0) {
    return (
      <section className={sectionClass}>
        {heading}
        <p className="flex items-baseline gap-2">
          <span className="text-lg text-pretty text-zinc-700 dark:text-zinc-300">
            No moves available.
          </span>
        </p>
      </section>
    )
  }

  // Brief loading state while the shared move data for a non-default version loads.
  if (!isDefault && !movesData) {
    return (
      <section className={sectionClass}>
        {heading}
        <LoadingSection />
      </section>
    )
  }

  const methodsWithRows = methodOrder.filter((method) => rowsByMethod[method].length > 0)

  if (methodsWithRows.length === 0) {
    return (
      <section className={sectionClass}>
        {heading}
        <p className="flex items-baseline gap-2">
          <span className="text-lg text-pretty text-zinc-700 dark:text-zinc-300">
            Not learnable in {VersionGroupLabels[versionGroup as keyof typeof VersionGroupLabels]}.
          </span>
        </p>
      </section>
    )
  }

  return (
    <section className={sectionClass}>
      {heading}
      <div className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
        {methodsWithRows.map((method) => (
          <Suspense key={method} fallback={<LoadingSection />}>
            <MovesTable
              variant={method}
              moveRows={rowsByMethod[method]}
              versionGroup={versionGroup}
              onExpand={ensureDescriptions}
              className="not-first:pt-4 not-last:pb-4"
            />
          </Suspense>
        ))}
      </div>
    </section>
  )
}

import { lazy, Suspense } from 'react'
import { LearnMethodKey, type MoveRow } from '@/lib/utils/pokeapi-helpers'
import LoadingSection from '@/components/details/LoadingSection'

const MovesTable = lazy(() => import('@/components/details/moves/MovesTable'))

export default function MovesSection({
  moveRowsByMethod,
}: {
  moveRowsByMethod: Record<LearnMethodKey, MoveRow[]>
}) {
  const title = 'Moves'
  const hasAnyMoves = Object.values(moveRowsByMethod).some(
    (rows) => rows.length > 0
  )

  if (!hasAnyMoves) {
    return (
      <section className="flex flex-col gap-4 rounded-xl p-4 inset-ring-1 inset-ring-zinc-200 dark:inset-ring-zinc-800">
        <h2 className="text-xl font-medium text-black dark:text-white">{title}</h2>
        <p className="flex items-baseline gap-2">
          <span className="text-lg text-pretty text-zinc-700 dark:text-zinc-300">No moves available.</span>
        </p>
      </section>
    )
  }

  return (
    <section className="flex flex-col gap-4 rounded-xl p-4 inset-ring-1 inset-ring-zinc-200 dark:inset-ring-zinc-800">
      <h2 className="text-xl font-medium text-black dark:text-white">Moves</h2>
      <div className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
        {Object.entries(moveRowsByMethod).map(
          ([method, moveRows]) =>
            moveRows.length > 0 && (
              <Suspense key={method} fallback={<LoadingSection />}>
                <MovesTable
                  variant={method as LearnMethodKey}
                  moveRows={moveRows}
                  className="not-first:pt-4 not-last:pb-4"
                />
              </Suspense>
            )
        )}
      </div>
    </section>
  )
}

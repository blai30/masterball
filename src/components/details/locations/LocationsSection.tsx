import { lazy, Suspense } from 'react'

import LoadingSection from '@/components/details/LoadingSection'
import type { LocationEncounterRow } from '@/lib/utils/pokeapi-helpers'

const LocationsTable = lazy(() => import('@/components/details/locations/LocationsTable'))

export default function LocationsSection({ rows }: { rows: LocationEncounterRow[] }) {
  const title = 'Locations'

  if (rows.length === 0) {
    return (
      <section className="flex flex-col gap-4 rounded-xl p-4 inset-ring-1 inset-ring-zinc-200 dark:inset-ring-zinc-800">
        <h2 className="text-xl font-medium text-black dark:text-white">{title}</h2>
        <p className="flex items-baseline gap-2">
          <span className="text-lg text-pretty text-zinc-700 dark:text-zinc-300">
            Not encountered in the wild.
          </span>
        </p>
      </section>
    )
  }

  return (
    <section className="flex flex-col gap-4 rounded-xl p-4 inset-ring-1 inset-ring-zinc-200 dark:inset-ring-zinc-800">
      <h2 className="text-xl font-medium text-black dark:text-white">{title}</h2>
      <Suspense fallback={<LoadingSection />}>
        <LocationsTable rows={rows} />
      </Suspense>
    </section>
  )
}

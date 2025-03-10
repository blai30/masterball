import { cache } from 'react'
import { Machine, Move, MoveElement, Pokemon } from 'pokedex-promise-v2'
import { pokeapi } from '@/lib/providers'
import { batchFetch } from '@/lib/utils/pokeapiHelpers'
import MovesTable from '@/components/details/moves/MovesTable'

// Cache expensive API calls with optimized batching
const getMoveData = cache(async (names: string[]) => {
  if (names.length === 0) return []
  return batchFetch(
    names,
    (name) => pokeapi.getMoveByName(name),
    20 // Process in batches of 20 for better parallelization
  ).catch(() => [] as Move[])
})

const getMachineData = cache(async (urls: string[]) => {
  if (urls.length === 0) return []
  return batchFetch(
    urls,
    (url) => pokeapi.getResource(url) as Promise<Machine>,
    20
  ).catch(() => [] as Machine[])
})

export default async function MovesSection({ pokemon }: { pokemon: Pokemon }) {
  // Early return if no moves - unchanged
  if (pokemon.moves.length === 0) {
    return (
      <section className="flex flex-col gap-4 rounded-xl p-4 inset-ring-1 inset-ring-zinc-200 dark:inset-ring-zinc-800">
        <h2 className="text-xl font-medium text-black dark:text-white">
          Moves
        </h2>
        <p className="flex items-baseline gap-2">
          <span className="text-lg text-pretty text-zinc-700 dark:text-zinc-300">
            No moves available.
          </span>
        </p>
      </section>
    )
  }

  // Group moves by learn method (optimized using Map for faster lookups)
  const methodMap = new Map<string, Set<MoveElement>>([
    ['form-change', new Set()],
    ['level-up', new Set()],
    ['machine', new Set()],
    ['tutor', new Set()],
    ['egg', new Set()],
  ])

  // Group moves by learn method
  pokemon.moves.forEach((move) => {
    move.version_group_details.forEach((detail) => {
      const methodSet = methodMap.get(detail.move_learn_method.name)
      if (methodSet) methodSet.add(move)
    })
  })

  // Convert map to record format
  const movesByMethod = Object.fromEntries(
    Array.from(methodMap.entries()).map(([method, moveSet]) => [
      method,
      Array.from(moveSet),
    ])
  ) as Record<string, MoveElement[]>

  // Fetch move data in parallel
  const moveNames = [...new Set(pokemon.moves.map((move) => move.move.name))]
  const movesData = await getMoveData(moveNames)

  // Fetch machine data in parallel
  const machineUrls = [
    ...new Set(
      movesData.flatMap(
        (move) => move.machines?.map((machine) => machine.machine.url) || []
      )
    ),
  ]
  const machinesData = await getMachineData(machineUrls)

  // Create map from move names to their machines
  const machinesMap = new Map<string, Machine[]>()
  for (const machine of machinesData) {
    if (!machinesMap.has(machine.move.name)) {
      machinesMap.set(machine.move.name, [])
    }
    machinesMap.get(machine.move.name)!.push(machine)
  }

  // Create final moves map with enhanced data
  const movesMapObj = Object.fromEntries(
    movesData.map((move) => [
      move.name,
      { ...move, machineItems: machinesMap.get(move.name) || [] },
    ])
  ) as Record<string, Move & { machineItems: Machine[] }>

  return (
    <section className="flex flex-col gap-4 rounded-xl p-4 inset-ring-1 inset-ring-zinc-200 dark:inset-ring-zinc-800">
      <h2 className="text-xl font-medium text-black dark:text-white">Moves</h2>
      <div className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
        {Object.entries(movesByMethod).map(
          ([method, moves]) =>
            moves.length > 0 && (
              <MovesTable
                key={method}
                variant={
                  method as
                    | 'form-change'
                    | 'level-up'
                    | 'machine'
                    | 'tutor'
                    | 'egg'
                }
                moves={moves}
                movesMap={movesMapObj}
                className="not-first:pt-4 not-last:pb-4"
              />
            )
        )}
      </div>
    </section>
  )
}

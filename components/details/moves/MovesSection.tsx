import { Machine, Move, MoveElement, Pokemon } from 'pokedex-promise-v2'
import { pokeapi } from '@/lib/providers'
import MovesTable from '@/components/details/moves/MovesTable'
import { cache } from 'react'
import { batchFetch } from '@/lib/utils/pokeapiHelpers'

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

  // Deduplicate move names for more efficient fetching
  const uniqueMoveNames = Array.from(
    new Set(pokemon.moves.map((move) => move.move.name))
  )

  // Group moves by learn method (optimized using Map for faster lookups)
  const methodMap = new Map<string, Set<MoveElement>>([
    ['form-change', new Set()],
    ['level-up', new Set()],
    ['machine', new Set()],
    ['tutor', new Set()],
    ['egg', new Set()],
  ])

  // Process each move once with more efficient Set operations
  for (const move of pokemon.moves) {
    for (const detail of move.version_group_details) {
      const method = detail.move_learn_method.name
      const methodSet = methodMap.get(method)
      if (methodSet) {
        methodSet.add(move)
      }
    }
  }

  // Convert back to record format expected by component
  const movesByMethod = Object.fromEntries(
    Array.from(methodMap.entries()).map(([method, moveSet]) => [
      method,
      Array.from(moveSet),
    ])
  ) as Record<string, MoveElement[]>

  // Parallel fetch for move data
  const movesData = await getMoveData(uniqueMoveNames)

  // More efficient machine mapping with Sets for lookups
  const movesWithMachines = movesData.filter(
    (move) => move.machines?.length > 0
  )

  // Use Set for machine URLs to avoid duplicates
  const machineUrlSet = new Set<string>()
  for (const move of movesWithMachines) {
    if (move.machines) {
      for (const machine of move.machines) {
        machineUrlSet.add(machine.machine.url)
      }
    }
  }
  const machineUrls = Array.from(machineUrlSet)

  // Fetch machines in parallel
  const machinesData = await getMachineData(machineUrls)

  // Create more efficient machine mapping using Map
  const machinesMap = new Map<string, Machine[]>()

  // Group machines by move name in a single pass
  machinesData.forEach((machine) => {
    if (!machinesMap.has(machine.move.name)) {
      machinesMap.set(machine.move.name, [])
    }
    machinesMap.get(machine.move.name)!.push(machine)
  })

  // Create move map with enhanced data using Map for faster lookups
  const movesMapObj: Record<string, Move & { machineItems: Machine[] }> = {}

  movesData.forEach((move) => {
    movesMapObj[move.name] = {
      ...move,
      machineItems: machinesMap.get(move.name) || [],
    }
  })

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

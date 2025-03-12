import { MoveElement, Pokemon } from 'pokedex-promise-v2'
import { pokeapi } from '@/lib/providers'
import { batchFetch, LearnMethodKey } from '@/lib/utils/pokeapiHelpers'
import MovesTable from '@/components/details/moves/MovesTable'
import { cache } from 'react'

export default async function MovesSection({ pokemon }: { pokemon: Pokemon }) {
  const title = 'Moves'

  if (pokemon.moves.length === 0) {
    return (
      <section className="flex flex-col gap-4 rounded-xl p-4 inset-ring-1 inset-ring-zinc-200 dark:inset-ring-zinc-800">
        <h2 className="text-xl font-medium text-black dark:text-white">
          {title}
        </h2>
        <p className="flex items-baseline gap-2">
          <span className="text-lg text-pretty text-zinc-700 dark:text-zinc-300">
            No moves available.
          </span>
        </p>
      </section>
    )
  }

  const uniqueMoveNames = [
    ...new Set(pokemon.moves.map((move) => move.move.name)),
  ]
  const fetchMoves = cache(
    async () =>
      await batchFetch(uniqueMoveNames, (name) => pokeapi.getMoveByName(name))
  )
  const movesData = await fetchMoves()

  // Process moves with machines
  const movesWithMachines = movesData.filter(
    (move) => move.machines?.length > 0
  )
  const uniqueMachinesUrls = [
    ...new Set(
      movesWithMachines.flatMap((move) =>
        move.machines.map((machine) => machine.machine.url)
      )
    ),
  ]

  const fetchMachines = cache(async () =>
    uniqueMachinesUrls.length > 0
      ? await batchFetch(uniqueMachinesUrls, (url) => pokeapi.getResource(url))
      : []
  )
  const machinesData = await fetchMachines()

  // Create optimized maps
  const machinesMap = new Map()
  movesWithMachines.forEach((move) => {
    machinesMap.set(
      move.name,
      machinesData.filter((m) => m.move.name === move.name)
    )
  })

  const movesMap = Object.fromEntries(
    movesData.map((move) => [
      move.name,
      { ...move, machineItems: machinesMap.get(move.name) || [] },
    ])
  )

  // Organize moves by learn method
  const movesByMethod: Record<LearnMethodKey, MoveElement[]> = {
    [LearnMethodKey.FormChange]: [],
    [LearnMethodKey.LevelUp]: [],
    [LearnMethodKey.Machine]: [],
    [LearnMethodKey.Tutor]: [],
    [LearnMethodKey.Egg]: [],
  }

  // Group moves by their learn method
  pokemon.moves.forEach((move) => {
    for (const method of Object.keys(movesByMethod) as LearnMethodKey[]) {
      if (
        move.version_group_details.some(
          (detail) => detail.move_learn_method.name === method
        )
      ) {
        movesByMethod[method].push(move)
      }
    }
  })

  return (
    <section className="flex flex-col gap-4 rounded-xl p-4 inset-ring-1 inset-ring-zinc-200 dark:inset-ring-zinc-800">
      <h2 className="text-xl font-medium text-black dark:text-white">
        {title}
      </h2>
      <div className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
        {Object.entries(movesByMethod).map(
          ([method, moves]) =>
            moves.length > 0 && (
              <MovesTable
                key={method}
                variant={method as LearnMethodKey}
                moves={moves}
                movesMap={movesMap}
                className="not-first:pt-4 not-last:pb-4"
              />
            )
        )}
      </div>
    </section>
  )
}

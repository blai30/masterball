import { Machine, Move, MoveElement, Pokemon } from 'pokedex-promise-v2'
import { pokeapi } from '@/lib/providers'
import {
  batchFetch,
  LearnMethodKey,
  getTranslation,
  MoveRow,
  DamageClassKey,
  TypeKey,
} from '@/lib/utils/pokeapiHelpers'
import MovesTable from '@/components/details/moves/MovesTable'
import { cache } from 'react'

function createMoveRows(
  moves: MoveElement[],
  movesMap: Record<string, Move>,
  variant: LearnMethodKey
): MoveRow[] {
  const moveRows: MoveRow[] = []

  moves.forEach((m) => {
    const move = movesMap[m.move.name]

    m.version_group_details.forEach((vgd) => {
      if (vgd.move_learn_method.name === variant) {
        let id = move.id.toString()

        if (variant === LearnMethodKey.LevelUp) {
          id =
            vgd.level_learned_at === 0
              ? 'Evolve'
              : vgd.level_learned_at.toString()
        } else if (variant === LearnMethodKey.Machine && move.machineItems) {
          const machine = move.machineItems.find(
            (m: Machine) => m.version_group.name === vgd.version_group.name
          )
          if (machine) {
            id = machine.item.name.toUpperCase()
          }
        }

        moveRows.push({
          id,
          slug: m.move.name,
          versionGroup: vgd.version_group.name,
          type: move.type.name as TypeKey,
          damageClass: move.damage_class.name as DamageClassKey,
          name: getTranslation(move.names, 'name')!,
          power: move.power,
          accuracy: move.accuracy,
          pp: move.pp!,
        })
      }
    })
  })

  return moveRows
}

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

  // Group moves by their learn method and prepare MoveRow objects
  const moveRowsByMethod: Record<LearnMethodKey, MoveRow[]> = {
    [LearnMethodKey.FormChange]: [],
    [LearnMethodKey.LevelUp]: [],
    [LearnMethodKey.Machine]: [],
    [LearnMethodKey.Tutor]: [],
    [LearnMethodKey.Egg]: [],
  }

  // For each learn method, create MoveRow objects
  Object.keys(moveRowsByMethod).forEach((method) => {
    const methodKey = method as LearnMethodKey
    const methodMoves = pokemon.moves.filter((move) =>
      move.version_group_details.some(
        (vgd) => vgd.move_learn_method.name === methodKey
      )
    )

    moveRowsByMethod[methodKey] = createMoveRows(
      methodMoves,
      movesMap,
      methodKey
    )
  })

  return (
    <section className="flex flex-col gap-4 rounded-xl p-4 inset-ring-1 inset-ring-zinc-200 dark:inset-ring-zinc-800">
      <h2 className="text-xl font-medium text-black dark:text-white">Moves</h2>
      <div className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
        {Object.entries(moveRowsByMethod).map(
          ([method, moveRows]) =>
            moveRows.length > 0 && (
              <MovesTable
                key={method}
                variant={method as LearnMethodKey}
                moveRows={moveRows}
                className="not-first:pt-4 not-last:pb-4"
              />
            )
        )}
      </div>
    </section>
  )
}

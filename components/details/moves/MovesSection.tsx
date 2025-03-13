import { Machine, Pokemon } from 'pokedex-promise-v2'
import { pokeapi } from '@/lib/providers'
import {
  LearnMethodKey,
  getTranslation,
  MoveRow,
  DamageClassKey,
  TypeKey,
} from '@/lib/utils/pokeapiHelpers'
import MovesTable from '@/components/details/moves/MovesTable'

export default async function MovesSection({ pokemon }: { pokemon: Pokemon }) {
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

  // Fetch all required data in parallel
  const uniqueMoveNames = [
    ...new Set(pokemon.moves.map((move) => move.move.name)),
  ]
  const [movesData] = await Promise.all([
    pokeapi.getMoveByName(uniqueMoveNames),
  ])

  // Create moves lookup map for quick access
  const movesMap = new Map(movesData.map((move) => [move.name, move]))

  // Create a map of all version groups a move appears in
  const moveVersionGroups = new Map<string, Set<string>>()
  pokemon.moves.forEach((move) => {
    const moveDetails = new Set<string>()
    move.version_group_details.forEach((detail) => {
      moveDetails.add(detail.version_group.name)
    })
    moveVersionGroups.set(move.move.name, moveDetails)
  })

  // Fetch machine data for moves that use machines
  const machineUrls = movesData.flatMap(
    (move) =>
      move.machines
        ?.filter((m) => {
          const versionGroup = m.version_group.url.split('/').slice(-2, -1)[0]
          const moveVersions = moveVersionGroups.get(move.name)
          return moveVersions?.has(versionGroup)
        })
        .map((m) => m.machine.url) || []
  )

  const machinesData =
    machineUrls.length > 0
      ? ((await pokeapi.getResource(machineUrls)) as Machine[])
      : []

  // Create machine lookup map
  const machinesByMoveAndVersion = new Map<string, Map<string, Machine>>()
  machinesData.forEach((machine) => {
    const moveName = machine.move.name
    const versionGroup = machine.version_group.name

    if (!machinesByMoveAndVersion.has(moveName)) {
      machinesByMoveAndVersion.set(moveName, new Map())
    }

    machinesByMoveAndVersion.get(moveName)?.set(versionGroup, machine)
  })

  // Process moves directly into final structure in a single pass
  const moveRowsByMethod: Record<LearnMethodKey, MoveRow[]> =
    Object.fromEntries(
      Object.values(LearnMethodKey).map((method) => [method, [] as MoveRow[]])
    ) as Record<LearnMethodKey, MoveRow[]>

  // Track processed moves to avoid duplicates (move name + method combination)
  const processedMoves = new Map<string, Set<string>>()

  pokemon.moves.forEach((moveElement) => {
    const moveName = moveElement.move.name
    const moveData = movesMap.get(moveName)

    if (!moveData) return

    moveElement.version_group_details.forEach((detail) => {
      const method = detail.move_learn_method.name as LearnMethodKey
      const versionGroup = detail.version_group.name
      const moveMethodKey = `${moveName}-${method}`

      // Skip if we don't support this method
      if (!moveRowsByMethod[method]) return

      // Initialize the set if it doesn't exist
      if (!processedMoves.has(moveMethodKey)) {
        processedMoves.set(moveMethodKey, new Set())
      }

      // Skip if this version has already been processed
      const processedVersions = processedMoves.get(moveMethodKey)!
      if (processedVersions.has(versionGroup)) return
      processedVersions.add(versionGroup)

      // Create the move row
      let id = moveData.id.toString()

      if (method === LearnMethodKey.LevelUp) {
        id =
          detail.level_learned_at === 0
            ? 'Evolve'
            : detail.level_learned_at.toString()
      } else if (method === LearnMethodKey.Machine) {
        const moveMachines = machinesByMoveAndVersion.get(moveName)
        const machine = moveMachines?.get(versionGroup)
        if (machine) {
          id = machine.item.name.toUpperCase()
        }
      }

      moveRowsByMethod[method].push({
        id,
        slug: moveName,
        versionGroup,
        type: moveData.type.name as TypeKey,
        damageClass: moveData.damage_class.name as DamageClassKey,
        name: getTranslation(moveData.names, 'name')!,
        power: moveData.power,
        accuracy: moveData.accuracy,
        pp: moveData.pp!,
      })
    })
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

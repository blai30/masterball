import { Machine, Move, Pokemon } from 'pokedex-promise-v2'
import { pokeapi } from '@/lib/providers'
import MovesTable from '@/components/details/moves/MovesTable'

export default async function MovesSection({ pokemon }: { pokemon: Pokemon }) {
  const title = 'Moves'
  const versionGroup = 'scarlet-violet'

  const moves = pokemon.moves.filter((move) => {
    const versionGroupDetails = move.version_group_details.find(
      (v) => v.version_group.name === versionGroup
    )
    return versionGroupDetails !== undefined
  })

  const movesData = await pokeapi.getMoveByName(
    moves.map((move) => move.move.name)
  )

  const movesWithMachines = movesData.filter((move) => {
    const machineVersionDetails = move.machines.find(
      (v) => v.version_group.name === versionGroup
    )
    return machineVersionDetails !== undefined
  })

  const machinesData: Machine[] = await pokeapi.getResource(
    movesWithMachines.map((move) => move.machines[0].machine.url)
  )

  const machinesMap: Record<string, Machine> = machinesData.reduce(
    (acc, machine) => {
      acc[machine.move.name] = machine
      return acc
    },
    {} as Record<string, Machine>
  )

  const movesMap: Record<string, Move & { machine: Machine }> =
    movesData.reduce(
      (acc, move) => {
        acc[move.name] = { ...move, machine: machinesMap[move.name] }
        return acc
      },
      {} as Record<string, Move & { machine: Machine }>
    )

  const levelUpMoves = moves
    .filter((move) =>
      move.version_group_details.some(
        (v) => v.move_learn_method.name === 'level-up'
      )
    )
    .toSorted((a, b) => {
      const levelA = a.version_group_details[0].level_learned_at
      const levelB = b.version_group_details[0].level_learned_at
      return levelA - levelB
    })

  const machineMoves = moves
    .filter((move) =>
      move.version_group_details.some(
        (v) => v.move_learn_method.name === 'machine'
      )
    )
    .toSorted((a, b) => {
      // Item name examples: TM02, TM21, TM211, TR21, TR211, HM04, etc.
      // Sort by machine type and by their numbers.
      if (!machinesMap[a.move.name] || !machinesMap[b.move.name]) {
        return 0
      }
      const machineA = machinesMap[a.move.name].item.name
      const machineB = machinesMap[b.move.name].item.name
      const typeA = machineA.slice(0, 2)
      const typeB = machineB.slice(0, 2)
      const numberA = parseInt(machineA.slice(2))
      const numberB = parseInt(machineB.slice(2))
      if (typeA !== typeB) {
        return typeA.localeCompare(typeB)
      }
      return numberA - numberB
    })

  const tutorMoves = moves.filter((move) =>
    move.version_group_details.some((v) => v.move_learn_method.name === 'tutor')
  )

  const eggMoves = moves.filter((move) =>
    move.version_group_details.some((v) => v.move_learn_method.name === 'egg')
  )

  return (
    <section className="flex flex-col gap-4 px-4 py-6">
      <h2 className="text-xl font-medium text-black dark:text-white">
        {title}
      </h2>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold">Level up</h3>
          <MovesTable
            variant="level-up"
            moves={levelUpMoves}
            movesMap={movesMap}
          />
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold">Technical Machine (TM)</h3>
          <MovesTable
            variant="machine"
            moves={machineMoves}
            movesMap={movesMap}
          />
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold">Tutor</h3>
          <MovesTable variant="tutor" moves={tutorMoves} movesMap={movesMap} />
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold">Egg</h3>
          <MovesTable variant="egg" moves={eggMoves} movesMap={movesMap} />
        </div>
      </div>
    </section>
  )
}

import { Machine, Move, Pokemon } from 'pokedex-promise-v2'
import { pokeapi } from '@/lib/providers'
import MovesTable from '@/components/details/moves/MovesTable'

export default async function MovesSection({ pokemon }: { pokemon: Pokemon }) {
  const title = 'Moves'
  const versionGroup = 'scarlet-violet'

  const moves = pokemon.moves.filter((move) =>
    move.version_group_details.some(
      (v) => v.version_group.name === versionGroup
    )
  )

  const movesData = await pokeapi.getMoveByName(
    moves.map((move) => move.move.name)
  )

  const filterByLearnMethod = (method: string) =>
    moves.filter((move) =>
      move.version_group_details.some(
        (v) =>
          v.move_learn_method.name === method &&
          v.version_group.name === versionGroup
      )
    )

  const movesWithMachines = movesData.filter((move) =>
    move.machines.some((m) => m.version_group.name === versionGroup)
  )

  const machinesData = await pokeapi.getResource(
    movesWithMachines.map(
      (move) =>
        move.machines.find((m) => m.version_group.name === versionGroup)!
          .machine.url
    )
  )

  const machinesMap: Record<string, Machine> = Object.fromEntries(
    machinesData.map((machine) => [machine.move.name, machine])
  )

  const movesMap: Record<string, Move & { machine: Machine }> =
    Object.fromEntries(
      movesData.map((move) => [
        move.name,
        { ...move, machine: machinesMap[move.name] },
      ])
    )

  const levelUpMoves = filterByLearnMethod('level-up').toSorted((a, b) => {
    const levelA = a.version_group_details[0].level_learned_at
    const levelB = b.version_group_details[0].level_learned_at
    return levelA - levelB
  })

  const machineMoves = filterByLearnMethod('machine').toSorted((a, b) => {
    if (!machinesMap[a.move.name] || !machinesMap[b.move.name]) return 0
    const machineA = machinesMap[a.move.name].item.name
    const machineB = machinesMap[b.move.name].item.name
    const typeA = machineA.slice(0, 2)
    const typeB = machineB.slice(0, 2)
    return typeA === typeB
      ? parseInt(machineA.slice(2)) - parseInt(machineB.slice(2))
      : typeA.localeCompare(typeB)
  })

  const tutorMoves = filterByLearnMethod('tutor')
  const eggMoves = filterByLearnMethod('egg')

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

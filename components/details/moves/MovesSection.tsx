import { Machine, Move, Pokemon } from 'pokedex-promise-v2'
import { pokeapi } from '@/lib/providers'
import MovesTable from '@/components/details/moves/MovesTable'
import VersionGroupSelector from '@/components/shared/VersionGroupSelector'

export default async function MovesSection({ pokemon }: { pokemon: Pokemon }) {
  const title = 'Moves'

  const movesData = await pokeapi.getMoveByName(
    pokemon.moves.map((move) => move.move.name)
  )

  const filterByLearnMethod = (method: string) =>
    pokemon.moves.filter((move) =>
      move.version_group_details.some(
        (v) => v.move_learn_method.name === method
      )
    )

  const movesWithMachines = movesData.filter((move) => move.machines)

  const machinesData: Machine[] = await pokeapi.getResource(
    movesWithMachines.flatMap((move) =>
      move.machines.map((machine) => machine.machine.url)
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

  const formChangeMoves = filterByLearnMethod('form-change')

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
    <section className="flex flex-col gap-4 rounded-xl p-4 inset-ring-1 inset-ring-zinc-200 dark:inset-ring-zinc-800">
      <h2 className="text-xl font-medium text-black dark:text-white">
        {title}
      </h2>
      <VersionGroupSelector />
      {/* {pokemon.moves.length === 0 && (
        <p className="flex items-baseline gap-2">
          <span className="text-lg text-pretty text-zinc-700 dark:text-zinc-300">
            No moves available for version group:
          </span>
          <span className="rounded-sm bg-zinc-200 px-1.5 py-1 font-mono text-sm text-rose-800 dark:bg-zinc-800 dark:text-rose-200">
            {versionGroup}
          </span>
        </p>
      )} */}
      <div className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
        {formChangeMoves.length > 0 && (
          <MovesTable
            variant="form-change"
            moves={formChangeMoves}
            movesMap={movesMap}
            className="not-first:pt-4 not-last:pb-4"
          />
        )}
        {levelUpMoves.length > 0 && (
          <MovesTable
            variant="level-up"
            moves={levelUpMoves}
            movesMap={movesMap}
            className="not-first:pt-4 not-last:pb-4"
          />
        )}
        {machineMoves.length > 0 && (
          <MovesTable
            variant="machine"
            moves={machineMoves}
            movesMap={movesMap}
            className="not-first:pt-4 not-last:pb-4"
          />
        )}
        {tutorMoves.length > 0 && (
          <MovesTable
            variant="tutor"
            moves={tutorMoves}
            movesMap={movesMap}
            className="not-first:pt-4 not-last:pb-4"
          />
        )}
        {eggMoves.length > 0 && (
          <MovesTable
            variant="egg"
            moves={eggMoves}
            movesMap={movesMap}
            className="not-first:pt-4 not-last:pb-4"
          />
        )}
      </div>
    </section>
  )
}

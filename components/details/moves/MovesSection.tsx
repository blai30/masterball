import { Machine, Move, Pokemon } from 'pokedex-promise-v2'
import { pokeapi } from '@/lib/providers'
import MovesTable from '@/components/details/moves/MovesTable'
import VersionGroupSelector from '@/components/shared/VersionGroupSelector'

export default async function MovesSection({ pokemon }: { pokemon: Pokemon }) {
  const title = 'Moves'

  const movesData = await pokeapi
    .getMoveByName(pokemon.moves.map((move) => move.move.name))
    .catch(() => [] as Move[])

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

  const machinesMap: Record<string, Machine[]> = Object.fromEntries(
    movesWithMachines.flatMap((move) =>
      move.machines.map(() => [
        move.name,
        machinesData.filter((m) => m.move.name === move.name),
      ])
    )
  )

  const movesMap: Record<string, Move & { machineItems: Machine[] }> =
    Object.fromEntries(
      movesData.map((move) => [
        move.name,
        { ...move, machineItems: machinesMap[move.name] },
      ])
    ) ?? {}

  const formChangeMoves = filterByLearnMethod('form-change')
  const levelUpMoves = filterByLearnMethod('level-up')
  const machineMoves = filterByLearnMethod('machine')
  const tutorMoves = filterByLearnMethod('tutor')
  const eggMoves = filterByLearnMethod('egg')

  return (
    <section className="flex flex-col gap-4 rounded-xl p-4 inset-ring-1 inset-ring-zinc-200 dark:inset-ring-zinc-800">
      <h2 className="text-xl font-medium text-black dark:text-white">
        {title}
      </h2>
      <VersionGroupSelector />
      {pokemon.moves.length === 0 ? (
        <p className="flex items-baseline gap-2">
          <span className="text-lg text-pretty text-zinc-700 dark:text-zinc-300">
            No moves available for this version group.
          </span>
        </p>
      ) : (
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
      )}
    </section>
  )
}

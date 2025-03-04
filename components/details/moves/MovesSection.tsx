import { Machine, Move, Pokemon } from 'pokedex-promise-v2'
import { pokeapi } from '@/lib/providers'
import MovesTable from '@/components/details/moves/MovesTable'

export default async function MovesSection({ pokemon }: { pokemon: Pokemon }) {
  const title = 'Moves'

  const movesData = await pokeapi
    .getMoveByName(pokemon.moves.map((move) => move.move.name))
    .catch(() => [] as Move[])

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

  return (
    <section className="flex flex-col gap-4 rounded-xl p-4 inset-ring-1 inset-ring-zinc-200 dark:inset-ring-zinc-800">
      <h2 className="text-xl font-medium text-black dark:text-white">
        {title}
      </h2>
      {pokemon.moves.length === 0 ? (
        <p className="flex items-baseline gap-2">
          <span className="text-lg text-pretty text-zinc-700 dark:text-zinc-300">
            No moves available.
          </span>
        </p>
      ) : (
        <div className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
          <MovesTable
            variant="form-change"
            moves={pokemon.moves}
            movesMap={movesMap}
            className="not-first:pt-4 not-last:pb-4"
          />
          <MovesTable
            variant="level-up"
            moves={pokemon.moves}
            movesMap={movesMap}
            className="not-first:pt-4 not-last:pb-4"
          />
          <MovesTable
            variant="machine"
            moves={pokemon.moves}
            movesMap={movesMap}
            className="not-first:pt-4 not-last:pb-4"
          />
          <MovesTable
            variant="tutor"
            moves={pokemon.moves}
            movesMap={movesMap}
            className="not-first:pt-4 not-last:pb-4"
          />
          <MovesTable
            variant="egg"
            moves={pokemon.moves}
            movesMap={movesMap}
            className="not-first:pt-4 not-last:pb-4"
          />
        </div>
      )}
    </section>
  )
}

import { Move, Pokemon } from 'pokedex-promise-v2'
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

  const movesMap: Record<string, Move> = movesData.reduce(
    (acc, move) => {
      acc[move.name] = move
      return acc
    },
    {} as Record<string, Move>
  )

  const levelUpMoves = moves
    .filter((move) =>
      move.version_group_details.some(
        (v) => v.move_learn_method.name === 'level-up'
      )
    )
    .sort((a, b) => {
      const levelA = a.version_group_details[0].level_learned_at
      const levelB = b.version_group_details[0].level_learned_at
      return levelA - levelB
    })

  const machineMoves = moves.filter((move) =>
    move.version_group_details.some(
      (v) => v.move_learn_method.name === 'machine'
    )
  )

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
          <MovesTable moves={levelUpMoves} movesMap={movesMap} />
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold">Technical Machine (TM)</h3>
          <MovesTable moves={machineMoves} movesMap={movesMap} />
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold">Tutor</h3>
          <MovesTable moves={tutorMoves} movesMap={movesMap} />
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold">Egg</h3>
          <MovesTable moves={eggMoves} movesMap={movesMap} />
        </div>
      </div>
    </section>
  )
}

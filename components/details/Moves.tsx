import Link from 'next/link'
import clsx from 'clsx/lite'
import { Move, Pokemon } from 'pokedex-promise-v2'
import { pokeapi } from '@/lib/providers'

export default async function Moves({ pokemon }: { pokemon: Pokemon }) {
  const title = 'Moves'
  const latestVersionGroup = 'scarlet-violet'

  const moves = await pokeapi.getMoveByName(
    pokemon.moves.map((move) => move.move.name)
  )

  return (
    <section className="flex flex-col gap-4 px-4 py-6">
      <h2 className="text-xl font-medium text-black dark:text-white">
        {title}
      </h2>
      <ul className="flex flex-col">
        {moves.map((move) => (
          <li key={move.id}>
            <p>{move.name}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

import clsx from 'clsx/lite'
import type { EvolutionChain, PokemonSpecies } from 'pokedex-promise-v2'
import MonsterPill from '@/components/MonsterPill'

async function EvolutionNode({
  chain,
  depth = 0,
}: {
  chain: EvolutionChain['chain']
  depth?: number
}) {
  const species: PokemonSpecies = await fetch(chain.species.url).then(
    (response) => response.json() as Promise<PokemonSpecies>
  )

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        {depth > 0 && (
          <div className={clsx('flex items-center', depth > 1 && 'ml-8')}>
            <svg
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 text-zinc-700 dark:text-zinc-300"
              aria-label="Evolves to"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.49 12 3.75 3.75m0 0-3.75 3.75m3.75-3.75H3.74V4.499"
              />
            </svg>
          </div>
        )}

        <div className="flex flex-col gap-1">
          <MonsterPill species={species} />
        </div>
      </div>

      {chain.evolves_to.length > 0 && (
        <div className="flex flex-col gap-2">
          {chain.evolves_to.map((evolution) => (
            <EvolutionNode
              key={evolution.species.name}
              chain={evolution}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default async function EvolutionSection({
  species,
}: {
  species: PokemonSpecies
}) {
  const evolutionChain: EvolutionChain = await fetch(
    species.evolution_chain.url
  ).then((response) => response.json() as Promise<EvolutionChain>)

  return (
    <section className="flex flex-col gap-4 rounded-xl p-4 inset-ring-1 inset-ring-zinc-200 dark:inset-ring-zinc-800">
      <h2 className="text-xl font-medium text-black dark:text-white">
        Evolution
      </h2>
      <EvolutionNode chain={evolutionChain.chain} />
    </section>
  )
}

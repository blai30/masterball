import { EvolutionChain, PokemonSpecies } from 'pokedex-promise-v2'
import { pokeapi } from '@/lib/providers'
import MonsterPill from '@/components/MonsterPill'

async function EvolutionNode({
  chain,
  depth = 0,
}: {
  chain: EvolutionChain['chain']
  depth?: number
}) {
  const species: PokemonSpecies = await pokeapi.getResource(chain.species.url)

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        {depth > 0 && (
          <>
            <svg
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.49 12 3.75 3.75m0 0-3.75 3.75m3.75-3.75H3.74V4.499"
              />
            </svg>
          </>
        )}

        <div className="flex flex-col">
          {chain.evolution_details[0] && (
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              {/* Evolution details will have pre-requisites for the trigger to successfully evolve the pokemon. Show all unique evolution methods while also listing out the requirements for each */}
            </div>
          )}
          <MonsterPill species={species} />
        </div>
      </div>
      <div className={depth > 0 ? 'ml-6' : ''}>
        {chain.evolves_to.map((evolution) => (
          <EvolutionNode
            key={evolution.species.name}
            chain={evolution}
            depth={depth + 1}
          />
        ))}
      </div>
    </div>
  )
}

export default async function EvolutionSection({
  species,
}: {
  species: PokemonSpecies
}) {
  const evolutionChain: EvolutionChain = await pokeapi.getResource(
    species.evolution_chain.url
  )

  return (
    <section className="flex flex-col gap-4 px-4 py-6">
      <h2 className="text-xl font-medium text-black dark:text-white">
        Evolution
      </h2>
      <EvolutionNode chain={evolutionChain.chain} />
    </section>
  )
}

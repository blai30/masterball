import type { PokemonSpecies } from 'pokedex-promise-v2'
import { getMonstersBySpecies } from '@/lib/utils/pokeapi-helpers'
import VariantCardSelector from '@/components/compounds/VariantCardSelector'

export const dynamicParams = false
export const fetchCache = 'only-cache'

export default async function RootLayout(props: LayoutProps<'/[slug]'>) {
  const { slug } = await props.params
  const species = await fetch(
    `https://pokeapi.co/api/v2/pokemon-species/${slug}`
  ).then((response) => response.json() as Promise<PokemonSpecies>)
  const monsters = await getMonstersBySpecies(species)

  return (
    <div className="flex w-full flex-1 flex-col gap-6">
      {/* Variants section */}
      <div className="grow">
        <div className="mx-auto max-w-[96rem]">
          <div className="flex overflow-x-auto">
            <div className="@container grow">
              <VariantCardSelector
                monsters={monsters}
                className="min-w-full justify-center-safe whitespace-nowrap"
              />
            </div>
          </div>
        </div>
      </div>
      {props.children}
    </div>
  )
}

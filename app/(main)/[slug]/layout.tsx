import type { PokemonSpecies } from 'pokedex-promise-v2'
import {
  getMonstersBySpecies,
  getTranslation,
} from '@/lib/utils/pokeapiHelpers'
import VariantCardSelector from '@/components/VariantCardSelector'

export const dynamicParams = false
export const fetchCache = 'only-cache'

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ slug: string }>
}>) {
  const { slug } = await params
  const species = await fetch(
    `https://pokeapi.co/api/v2/pokemon-species/${slug}`
  ).then((response) => response.json() as Promise<PokemonSpecies>)
  const name = getTranslation(species.names, 'name')!
  const monsters = await getMonstersBySpecies(species)

  const dexId = species.id.toString().padStart(4, '0')
  const leadingZeros = dexId.match(/^0+/)?.[0] || ''
  const significantDigits = dexId.slice(leadingZeros.length)

  return (
    <div className="flex w-full flex-1 flex-col gap-6">
      {/* <div className="mx-auto w-full max-w-[96rem] px-4">
        <div className="flex flex-row items-center gap-2.5">
          <p className="font-num rounded-lg bg-zinc-200 px-2 text-lg font-bold dark:bg-zinc-800">
            <span className="text-zinc-400 dark:text-zinc-600">
              {leadingZeros}
            </span>
            <span className="text-black dark:text-white">
              {significantDigits}
            </span>
          </p>
          <div className="flex flex-col">
            <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-white">
              {name}
            </h1>
          </div>
        </div>
      </div> */}
      {/* Variants section */}
      <div className="grow">
        <div className="mx-auto max-w-[96rem]">
          <div className="flex">
            <div className="@container grow px-4">
              <VariantCardSelector
                monsters={monsters}
                className="min-w-full whitespace-nowrap"
              />
            </div>
          </div>
        </div>
      </div>
      {children}
    </div>
  )
}

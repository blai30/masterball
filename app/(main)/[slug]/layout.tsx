import { pokeapi } from '@/lib/providers'
import {
  getMonstersBySpecies,
  getTranslation,
} from '@/lib/utils/pokeapiHelpers'
import HorizontalScroller from '@/components/HorizontalScroller'
import VariantCardSelector from '@/components/VariantCardSelector'

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ slug: string }>
}>) {
  const { slug } = await params
  const species = await pokeapi.getPokemonSpeciesByName(slug)
  const name = getTranslation(species.names, 'name')!
  const monsters = await getMonstersBySpecies(species)

  const dexId = species.id.toString().padStart(4, '0')
  const leadingZeros = dexId.match(/^0+/)?.[0] || ''
  const significantDigits = dexId.slice(leadingZeros.length)

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="container mx-auto px-4">
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
      </div>
      {/* Variants section */}
      <div className="container mx-auto px-4">
        <HorizontalScroller>
          <VariantCardSelector monsters={monsters} />
        </HorizontalScroller>
      </div>
      {children}
    </div>
  )
}

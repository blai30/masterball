import { Pokemon } from 'pokedex-promise-v2'
import { pokeapi } from '@/lib/providers'
import { getTranslation, Monster } from '@/lib/utils/pokeapiHelpers'
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
  const variants: Pokemon[] = await pokeapi.getResource(
    species.varieties.map((v) => v.pokemon.url)
  )

  const monsters = await Promise.all(
    variants.map(async (variant) => {
      const form = await pokeapi
        .getPokemonFormByName(variant.name)
        .catch(() => undefined)

      const name =
        getTranslation(form?.form_names, 'name') ??
        getTranslation(form?.names, 'name') ??
        getTranslation(species.names, 'name')!

      return {
        id: species.id,
        key: variant.name,
        name,
        species,
        pokemon: variant,
        form: variant.is_default ? undefined : form,
      } as Monster
    })
  )

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
        <div className="overflow-x-auto">
          <VariantCardSelector monsters={monsters} />
        </div>
      </div>
      {children}
    </div>
  )
}

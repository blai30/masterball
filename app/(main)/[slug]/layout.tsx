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
  const variants: Pokemon[] = await pokeapi.getResource(
    species.varieties.map((v) => v.pokemon.url)
  )

  const monsters = await Promise.all(
    variants.map(async (variant) => {
      const form = await pokeapi
        .getPokemonFormByName(variant.name)
        .catch(() => undefined)

      const name = form
        ? getTranslation(form?.form_names, 'name') ||
          getTranslation(form?.names, 'name') ||
          getTranslation(species.names, 'name')!
        : getTranslation(species.names, 'name')!

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

  return (
    <div className="flex w-full flex-col gap-6">
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

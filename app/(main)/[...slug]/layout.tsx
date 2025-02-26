import Link from 'next/link'
import { pokeapi } from '@/lib/providers'
import { getTranslation, Monster } from '@/lib/utils/pokeapiHelpers'
import VariantCardGrid from '@/components/VariantCardGrid'
import { Pokemon } from 'pokedex-promise-v2'

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ slug: string }>
}>) {
  const { slug } = await params
  const [speciesKey, variantKey] = slug
  const species = await pokeapi.getPokemonSpeciesByName(speciesKey)
  const variants: Pokemon[] = await pokeapi.getResource(
    species.varieties.map((v) => v.pokemon.url)
  )
  const monsters: Record<string, Monster> = Object.fromEntries(
    await Promise.all(
      variants.map(async (variant) => {
        const form = !variant.is_default
          ? (await pokeapi.getPokemonFormByName(variant.name)) || undefined
          : undefined

        const name = form
          ? getTranslation(form?.form_names, 'name') ||
            getTranslation(form?.names, 'name') ||
            getTranslation(species.names, 'name')!
          : getTranslation(species.names, 'name')!

        return [
          variant.is_default ? species.name : variant.name,
          {
            id: species.id,
            key: variant.name,
            name,
            species,
            pokemon: variant,
            form: variant.is_default ? undefined : form,
          },
        ] as const
      })
    )
  )
  const pokemon = monsters[variantKey ?? species.name].pokemon

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Breadcrumb */}
      <section className="container mx-auto px-4">
        <nav className="flex w-full flex-row items-center gap-2">
          <Link
            href={`/${species.name}`}
            className="text-zinc-600 dark:text-zinc-400"
          >
            {getTranslation(species.names, 'name')}
          </Link>
          {variantKey && (
            <>
              <span className="text-zinc-600 dark:text-zinc-400">/</span>
              <Link
                href={`/${species.name}/${variantKey}`}
                className="text-zinc-600 dark:text-zinc-400"
              >
                {monsters[variantKey].name}
              </Link>
            </>
          )}
        </nav>
      </section>
      {/* Variants section */}
      <div className="container mx-auto px-4">
        <div className="overflow-x-auto">
          <VariantCardGrid monsters={monsters} activeKey={pokemon.name} />
        </div>
      </div>
      {children}
    </div>
  )
}

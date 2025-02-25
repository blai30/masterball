import Image from 'next/image'
import { getTestSpeciesList, pokeapi } from '@/lib/providers'
import { getTranslation } from '@/lib/utils/pokeapiHelpers'
import TypePill from '@/components/TypePill'
import StatsRadarChart from '@/components/details/stats/StatsRadarChart'

export const dynamic = 'force-static'

export async function generateStaticParams() {
  const speciesList = await getTestSpeciesList()
  const species = await pokeapi.getPokemonSpeciesByName(
    speciesList.results.map((result) => result.name)
  )

  const params = species.flatMap((specie) =>
    specie.varieties.map((variant) => ({
      slug: variant.is_default
        ? [specie.name]
        : [specie.name, variant.pokemon.name],
    }))
  )

  return params
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [speciesKey, variantKey] = slug
  const species = await pokeapi.getPokemonSpeciesByName(speciesKey)
  const pokemon = await pokeapi.getPokemonByName(
    species.varieties.find((v) =>
      variantKey ? v.pokemon.name === variantKey : v.is_default
    )!.pokemon.name
  )
  const form = variantKey
    ? await pokeapi.getPokemonFormByName(variantKey)
    : undefined
  const stats = await pokeapi.getStatByName(
    pokemon.stats.map((stat) => stat.stat.name)
  )
  const name = getTranslation(species.names, 'name')!
  const formName = form
    ? (getTranslation(form?.form_names, 'name') ??
      getTranslation(form?.names, 'name') ??
      'Base')
    : 'Base'

  const imageId = species.id.toString().padStart(4, '0')
  // const imageUrl = `https://resource.pokemon-home.com/battledata/img/pokei128/icon${imageId}_f00_s0.png`
  const imageUrl = pokemon.sprites.other.home.front_default!

  return (
    <div className="h-[400px] w-[800px] rounded-xl bg-transparent inset-ring-1 inset-ring-zinc-200 dark:inset-ring-zinc-800">
      <div className="h-full w-full p-8">
        <div className="flex h-full flex-row justify-between">
          <div className="flex h-full flex-col items-start justify-between">
            <div className="flex max-w-lg flex-col items-start gap-5">
              <div className="flex flex-col gap-1">
                <h1 className="text-5xl font-semibold tracking-tight text-black dark:text-white">
                  {name}
                </h1>
                <p className="text-3xl font-medium tracking-tight text-zinc-600 dark:text-zinc-400">
                  {formName}
                </p>
              </div>
              <ul className="flex flex-row gap-2">
                {pokemon.types.map((type) => (
                  <li key={type.type.name}>
                    <TypePill variant={type.type.name} link={false} />
                  </li>
                ))}
              </ul>
            </div>
            <Image
              src={imageUrl}
              alt={name}
              width={180}
              height={180}
              priority
              className="object-contain"
            />
          </div>
          <div className="mr-3 flex h-full min-w-72 flex-col justify-center">
            <StatsRadarChart pokemon={pokemon} stats={stats} />
          </div>
        </div>
      </div>
    </div>
  )
}

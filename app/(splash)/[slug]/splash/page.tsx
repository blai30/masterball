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
      slug: variant.pokemon.name,
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
  const form = await pokeapi.getPokemonFormByName(slug)
  const pokemon = await pokeapi.getPokemonByName(form.pokemon.name)
  const species = await pokeapi.getPokemonSpeciesByName(pokemon.species.name)
  const stats = await pokeapi.getStatByName(
    pokemon.stats.map((stat) => stat.stat.name)
  )
  const name = form?.form_names?.length
    ? `${getTranslation(species.names, 'name')} (${getTranslation(form.form_names, 'name') ?? getTranslation(form.names, 'name')})`
    : getTranslation(species.names, 'name')!

  const imageId = species.id.toString().padStart(4, '0')
  // const imageUrl = `https://resource.pokemon-home.com/battledata/img/pokei128/icon${imageId}_f00_s0.png`
  const imageUrl = pokemon.sprites.other.home.front_default!

  return (
    <div className="h-[400px] w-[800px] rounded-xl bg-transparent inset-ring-1 inset-ring-zinc-200 dark:inset-ring-zinc-800">
      <div className="h-full w-full p-8">
        <div className="flex h-full flex-row justify-between">
          <div className="flex h-full flex-col items-start justify-between">
            <div className="flex flex-col items-start gap-5">
              <h1 className="max-w-lg text-5xl font-semibold tracking-tight text-white">
                {name}
              </h1>
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

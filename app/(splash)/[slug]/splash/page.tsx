import Image from 'next/image'
import { getTestSpeciesList, pokeapi } from '@/lib/providers'
import { getTranslation } from '@/lib/utils/pokeapiHelpers'
import GlassCard from '@/components/GlassCard'
import TypePill from '@/components/TypePill'
import StatsRadarChart from '@/components/details/stats/StatsRadarChart'

export const dynamic = 'force-static'

export async function generateStaticParams() {
  const speciesList = await getTestSpeciesList()

  return speciesList.results.map((result) => ({
    slug: result.name,
  }))
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const species = await pokeapi.getPokemonSpeciesByName(slug)
  const pokemon = await pokeapi.getPokemonByName(
    species.varieties.find((variety) => variety.is_default)!.pokemon.name
  )
  const stats = await pokeapi.getStatByName(
    pokemon.stats.map((stat) => stat.stat.name)
  )
  const label = getTranslation(species.names, 'name')

  const imageId = species.id.toString().padStart(4, '0')
  const imageUrl = `https://resource.pokemon-home.com/battledata/img/pokei128/icon${imageId}_f00_s0.png`

  return (
    <div className="h-[400px] w-[800px] bg-transparent">
      <GlassCard className="h-full w-full p-10">
        <div className="flex h-full flex-row justify-between">
          <div className="flex h-full flex-col items-start justify-between">
            <div className="flex flex-col items-start gap-6">
              <h1 className="text-6xl font-semibold tracking-tight text-white">
                {label}
              </h1>
              <ul className="flex flex-row gap-2">
                {pokemon.types.map((type) => (
                  <li key={type.type.name}>
                    <TypePill variant={type.type.name} />
                  </li>
                ))}
              </ul>
            </div>
            <Image
              src={imageUrl}
              alt={species.name}
              width={128}
              height={128}
              priority
              className="object-contain"
            />
          </div>
          <div className="mr-3 flex h-full flex-col justify-center">
            <StatsRadarChart pokemon={pokemon} stats={stats} />
          </div>
        </div>
      </GlassCard>
    </div>
  )
}

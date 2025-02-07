import { ImageResponse } from 'next/og'
import { getTestSpeciesList, pokeapi } from '@/lib/providers'
import '@/public/og-bg.png'
import {
  getTranslation,
  StatLabels,
  StatName,
  TypeLabels,
  TypeName,
} from '@/lib/utils/pokeapiHelpers'

export const dynamic = 'force-static'

const typeBackgrounds: Record<string, string> = {
  [TypeName.Normal]: '#9fa19f',
  [TypeName.Fighting]: '#ff8000',
  [TypeName.Flying]: '#81b9ef',
  [TypeName.Poison]: '#9141cb',
  [TypeName.Ground]: '#915121',
  [TypeName.Rock]: '#afa981',
  [TypeName.Bug]: '#91a119',
  [TypeName.Ghost]: '#704170',
  [TypeName.Steel]: '#60a1b8',
  [TypeName.Fire]: '#e62829',
  [TypeName.Water]: '#2980ef',
  [TypeName.Grass]: '#3fa129',
  [TypeName.Electric]: '#fac000',
  [TypeName.Psychic]: '#ef4179',
  [TypeName.Ice]: '#3dcef3',
  [TypeName.Dragon]: '#5060e1',
  [TypeName.Dark]: '#624d4e',
  [TypeName.Fairy]: '#ef70ef',
}

export async function generateStaticParams() {
  const speciesList = await getTestSpeciesList()

  return speciesList.results.map((result) => ({
    name: result.name,
  }))
}

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ name: string }>
  }
) {
  const { name } = await params
  const species = await pokeapi.getPokemonSpeciesByName(name)
  const pokemon = await pokeapi.getPokemonByName(
    species.varieties.find((variety) => variety.is_default)!.pokemon.name
  )
  const stats = await pokeapi.getStatByName(
    pokemon.stats.map((stat) => stat.stat.name)
  )
  const imageId = species.id.toString().padStart(4, '0')
  const imageUrl = `https://resource.pokemon-home.com/battledata/img/pokei128/icon${imageId}_f00_s0.png`
  const leadingZeros = imageId.match(/^0+/)?.[0] || ''
  const significantDigits = imageId.slice(leadingZeros.length)

  return new ImageResponse(
    (
      <div tw="w-full h-full bg-transparent flex flex-col">
        <div tw="w-full h-full bg-black flex flex-col p-12">
          <div tw="flex flex-row justify-between w-full">
            <div tw="flex flex-col">
              <div tw="text-5xl flex flex-row">
                <span tw="text-zinc-600">{leadingZeros}</span>
                <span tw="text-white">{significantDigits}</span>
              </div>
              <div tw="mt-6 text-white text-7xl font-semibold tracking-tight">
                {getTranslation(species.names, 'name')}
              </div>
              <div tw="mt-6 flex flex-row">
                {pokemon.types.map((type) => {
                  return (
                    <div
                      key={type.type.name}
                      tw="flex flex-row items-center justify-start text-white text-2xl w-44 bg-red-200 px-6 py-1 rounded-full mr-4"
                      style={{
                        backgroundColor:
                          typeBackgrounds[type.type.name as TypeName],
                      }}
                    >
                      {TypeLabels[type.type.name as TypeName]}
                    </div>
                  )
                })}
              </div>
            </div>
            <img src={imageUrl} alt={species.name} width={128} height={128} />
          </div>
          <div tw="mt-16 flex flex-col">
            {stats.map((stat) => {
              const pokemonStat = pokemon.stats.find(
                (s) => s.stat.name === stat.name
              )!
              const fillPercentage =
                ((pokemonStat.base_stat / 255) * 100).toFixed(4) + '%'
              return (
                <div key={stat.id} tw="flex flex-row items-center mb-1">
                  <div tw="flex flex-row items-center justify-between">
                    <abbr tw="min-w-20 font-normal text-zinc-300 no-underline">
                      {StatLabels[stat.name as StatName]}
                    </abbr>
                    <span
                      tw="min-w-12 text-right text-white"
                      style={{ fontVariantNumeric: 'tabular-nums' }}
                    >
                      {pokemonStat.base_stat.toLocaleString()}
                    </span>
                  </div>

                  {/* Progress bar visualization */}
                  <div tw="flex h-5 w-full flex-row items-center">
                    <div tw="h-full flex max-w-full bg-black">
                      <div
                        tw="h-full flex bg-white"
                        style={{
                          width: fillPercentage,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 600,
    }
  )
}

import { ImageResponse } from 'next/og'
import { getTestSpeciesList, pokeapi } from '@/lib/providers'

export const dynamic = 'force-static'

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
  const imageId = species.id.toString().padStart(4, '0')
  const imageUrl = `https://resource.pokemon-home.com/battledata/img/pokei128/icon${imageId}_f00_s0.png`
  const leadingZeros = imageId.match(/^0+/)?.[0] || ''
  const significantDigits = imageId.slice(leadingZeros.length)

  return new ImageResponse(
    (
      <div tw="w-full h-full bg-black flex flex-col justify-start p-8 items-start gap-2">
        <div tw="flex flex-row items-center justify-between w-full">
          <div tw="flex flex-col gap-2">
            <p tw="font-num relative text-2xl">
              <span tw="text-zinc-600">{leadingZeros}</span>
              <span tw="text-white">{significantDigits}</span>
            </p>
            <p tw="text-white text-4xl font-semibold tracking-tight">
              {species.name}
            </p>
          </div>
          <img
            src={imageUrl}
            alt={species.name}
            width={128}
            height={128}
            tw="object-scale-down"
          />
        </div>
        <div tw="flex flex-row">
          {pokemon.types.map((type) => (
            <p
              key={type.type.name}
              tw="rounded-md bg-zinc-800 px-2 py-1 text-center text-xs font-semibold uppercase text-white"
            >
              {type.type.name}
            </p>
          ))}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}

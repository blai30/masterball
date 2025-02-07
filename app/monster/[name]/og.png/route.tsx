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
  const id = species.id.toString().padStart(4, '0')
  const leadingZeros = id.match(/^0+/)?.[0] || ''
  const significantDigits = id.slice(leadingZeros.length)

  return new ImageResponse(
    (
      <div tw="w-full h-full bg-black flex flex-col justify-center p-12 items-start gap-4">
        <h1 tw="text-zinc-300">{species.id}</h1>
        <p tw="font-num relative text-2xl">
          <span tw="text-zinc-600">{leadingZeros}</span>
          <span tw="text-white">{significantDigits}</span>
        </p>
        <h2 tw="text-white text-4xl font-semibold tracking-tight">
          {species.name}
        </h2>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}

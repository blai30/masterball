import { ImageResponse } from 'next/og'
import { getTestSpeciesList, pokeapi } from '@/lib/providers'

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
  console.log(request)
  const { name } = await params
  return new ImageResponse(
    (
      <div tw="w-full h-full bg-black">
        <h1>{name}</h1>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}

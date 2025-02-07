import { ImageResponse } from 'next/og'
import { getTestSpeciesList, pokeapi } from '@/lib/providers'
import { NextRequest } from 'next/server'

export async function generateStaticParams() {
  const speciesList = await getTestSpeciesList()

  return speciesList.results.map((result) => ({
    name: result.name,
  }))
}

export async function GET({ params }: { params: Promise<{ name: string }> }) {
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

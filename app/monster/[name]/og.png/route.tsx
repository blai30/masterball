import { ImageResponse } from 'next/og'
import { getTestSpeciesList, pokeapi } from '@/lib/providers'
import MonsterCard from '@/components/MonsterCard'

export async function generateStaticParams() {
  const speciesList = await getTestSpeciesList()

  return speciesList.results.map((result) => ({
    name: result.name,
  }))
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params
  const species = await pokeapi.getPokemonSpeciesByName(name)
  return new ImageResponse(<MonsterCard species={species}></MonsterCard>, {
    width: 1200,
    height: 630,
  })
}

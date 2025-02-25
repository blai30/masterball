import { NextResponse } from 'next/server'
import playwright from 'playwright'
import { getTestSpeciesList, pokeapi } from '@/lib/providers'

export const dynamic = 'force-static'

export async function generateStaticParams() {
  const speciesList = await getTestSpeciesList()
  const species = await pokeapi.getPokemonSpeciesByName(
    speciesList.results.map((result) => result.name)
  )

  const params = species.flatMap((specie) =>
    specie.varieties.map((variant) => ({
      slug: variant.is_default
        ? `${specie.name}.png`
        : `${specie.name}_${variant.pokemon.name}.png`,
    }))
  )

  return params
}

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ slug: string }>
  }
) {
  const { slug } = await params
  const path = slug.split('.png')[0].replace('_', '/')
  const url = `${process.env.NEXT_PUBLIC_BASEPATH || 'localhost:3000'}/splash/${path}`

  const browser = await playwright.chromium.launch({
    headless: true,
  })
  const page = await browser.newPage({
    colorScheme: 'dark',
    viewport: { width: 800, height: 400 },
  })

  await page.goto(url)
  await page.waitForLoadState()
  const screenshot = await page.screenshot({
    type: 'png',
  })
  await browser.close()

  return new NextResponse(screenshot, {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}

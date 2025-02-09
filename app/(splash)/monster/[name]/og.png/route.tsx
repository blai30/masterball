import { NextResponse } from 'next/server'
import playwright from 'playwright'
import { getTestSpeciesList } from '@/lib/providers'

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
  const url = `${process.env.NEXT_PUBLIC_BASEPATH || 'localhost:3000'}/monster/${name}/splash`

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

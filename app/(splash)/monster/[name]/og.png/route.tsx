import { NextResponse } from 'next/server'
import puppeteer from 'puppeteer'
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
  const url = `${process.env.NEXT_PUBLIC_BASEPATH}/monster/${name}/splash`

  const browser = await puppeteer.launch({
    defaultViewport: { width: 800, height: 400 },
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })
  const page = await browser.newPage()
  await page.goto(url)
  const screenshot = await page.screenshot()
  await browser.close()
  return new NextResponse(screenshot, {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}

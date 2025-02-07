import { getTestSpeciesList } from '@/lib/providers'
import { NextResponse } from 'next/server'
import puppeteer from 'puppeteer'

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

  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  try {
    await page.setViewport({ width: 1200, height: 630 })
    await page.goto(url, { waitUntil: 'networkidle0' })
    const imageBuffer = await page.screenshot()

    await browser.close()
    return new NextResponse(imageBuffer, {
      headers: { 'Content-Type': 'image/png' },
    })
  } catch (error) {
    console.error('Screenshot error:', error)
    return new NextResponse('Failed to generate image', { status: 500 })
  } finally {
    await browser.close()
  }
}

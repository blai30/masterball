import { ImageResponse } from 'next/og'
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
  const url = `/monster/${name}/splash`

  const browser = await playwright.chromium.launch({
    headless: true,
  })
  const page = await browser.newPage({
    colorScheme: 'dark',
    baseURL: process.env.NEXT_PUBLIC_BASEPATH,
    viewport: { width: 800, height: 400 },
  })
  await page.goto(url)
  const screenshot = await page.screenshot({
    omitBackground: true,
    type: 'png',
  })
  await browser.close()
  const buffer = screenshot.toString('base64')

  return new ImageResponse(
    (
      <div
        style={{
          backgroundColor: 'transparent',
          backgroundImage: `url('data:image/png;base64,${buffer}')`,
          backgroundSize: '800px 400px',
          height: '100%',
          width: '100%',
        }}
      />
    ),
    {
      width: 800,
      height: 400,
    }
  )
  // return new NextResponse(screenshot.toString('base64'), {
  //   status: 200,
  //   headers: {
  //     'Content-Type': 'image/png;base64',
  //     'Cache-Control': 'public, max-age=31536000, immutable',
  //   },
  // })
}
